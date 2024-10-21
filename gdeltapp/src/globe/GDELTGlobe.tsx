import Globe from 'react-globe.gl';
import { Event } from '../data/GDELTTypes';
import earthTexture from '../assets/gdelt/8081_earthmap4k.jpg';
import earthBump from '../assets/gdelt/8081_earthbump4k.jpg';
import skyTexture from '../assets/gdelt/stars.jpg';
import useEvents from '../data/useEvents';
import useCodes from '../data/useCodes';
import * as d3 from 'd3';
import { useState, useMemo } from 'react';

const today = new Date();
const actorCameoEndpoints = ["eventcodes", "country", "ethnic", "knowngroup", "religion", "type"];
const actorCameoFields = ["Country", "Ethnic", "KnownGroup", "Religion", "Type"]
const quadClasses = { 1: "Verbal Cooperation", 2: "Material Cooperation", 3: "Verbal Conflict", 4: "Material Conflict" }

const colorScale = d3.scaleLinear()
    .domain([-10, 10])
    .range([0, 1])
    .clamp(true);

const goldsteinColor = (point) => {
    return d3.interpolateHsl("red", "lime")(colorScale(point.GoldsteinScale));
};

const avgToneColor = (point) => {
    return d3.interpolateHsl("red", "lime")(colorScale((20/Math.PI)*Math.atan(point.AvgTone/10)));
};

const colorFuncs = { "Goldstein": goldsteinColor, "AvgTone": avgToneColor }

function GDELTGlobe() {
    const { events, loadingEvents, errorEvents } = useEvents(today, today);
    const { codes, loadingCodes, errorCodes } = useCodes(actorCameoEndpoints);
    const [tooltip, setTooltip] = useState<object[]>([]);
    const [colorFunc, setColorFunc] = useState<string>("Goldstein");
    const [pointSize, setPointSize] = useState<number>(0.25);
    const [hoverArc, setHoverArc] = useState<object[]>([]);

    const arcsEq = (x: any, y: any) => {
        return x.Actor1Geo_Lat === y.Actor1Geo_Lat &&
            x.Actor1Geo_Long === y.Actor1Geo_Long &&
            x.Actor2Geo_Lat === y.Actor2Geo_Lat &&
            x.Actor2Geo_Long === y.Actor2Geo_Long;
    };

    const arcNonTrivial = (event: Event) => {
        return event.Actor1Geo_FeatureID !== null &&
            event.Actor2Geo_FeatureID !== null &&
            event.Actor1Geo_Lat !== event.Actor2Geo_Lat &&
            event.Actor1Geo_Long !== event.Actor2Geo_Long &&
            event.Actor1Geo_Lat !== 0 &&
            event.Actor2Geo_Lat !== 0 &&
            event.Actor1Geo_Long !== 0 &&
            event.Actor2Geo_Long !== 0;
    };

    const colorButtonHandler = color => setColorFunc(color);

    const memoizedPoints = useMemo(() => {
        if (!loadingEvents && !errorEvents) {
            return events.filter(event => event.ActionGeo_FeatureID !== null &&
                event.ActionGeo_Lat !== 0 &&
                event.ActionGeo_Long !== 0);
        }
        return [];
    }, [events, loadingEvents, errorEvents]);

    const memoizedArcs = useMemo(() => {
        if (!loadingEvents && !errorEvents) {
            return events
                .filter(event =>
                    event.Actor1Geo_Lat !== null && event.Actor2Geo_Lat !== null &&
                    event.Actor1Geo_Long !== null && event.Actor2Geo_Long !== null &&
                    event.Actor1Geo_Lat !== event.Actor2Geo_Lat &&
                    event.Actor1Geo_Long !== event.Actor2Geo_Long &&
                    (event.Actor1Geo_Lat !== 0 || event.Actor1Geo_Long !== 0) &&
                    (event.Actor2Geo_Lat !== 0 || event.Actor2Geo_Long !== 0))
                .map(event => {
                    return {
                        startLat: event.Actor1Geo_Lat,
                        startLng: event.Actor1Geo_Long,
                        endLat: event.Actor2Geo_Lat,
                        endLng: event.Actor2Geo_Long,
                        GoldsteinScale: event.GoldsteinScale,
                        AvgTone: event.AvgTone
                    }
                });
        }
        return [];
    }, [events, loadingEvents, errorEvents]);

    const memoizedCodes = useMemo(() => {
        if (!loadingCodes && !errorCodes) {
            return codes
        }
        return [];
    }, [codes, loadingCodes, errorCodes]);

    return (
        <div>
            <Globe
                globeImageUrl={earthTexture}
                bumpImageUrl={earthBump}
                backgroundImageUrl={skyTexture}
                pointsData={memoizedPoints}
                pointRadius={pointSize}
                pointsTransitionDuration={0}
                pointAltitude={point => point.NumArticles / 400}
                pointLat={point => point.ActionGeo_Lat || 0}
                pointLng={point => point.ActionGeo_Long || 0}
                pointColor={point => colorFuncs[colorFunc](point)}
                onPointClick={(point, event, coords) => {
                    window.open(point.SOURCEURL)
                }}
                onPointHover={point => {
                    if (point) {

                        setTooltip([{
                            lat: point.ActionGeo_Lat,
                            lng: point.ActionGeo_Long,
                            point: point
                        }]);

                        if (arcNonTrivial(point)) {
                            const hoveredPointArc = {
                                startLat: point.Actor1Geo_Lat,
                                startLng: point.Actor1Geo_Long,
                                endLat: point.Actor2Geo_Lat,
                                endLng: point.Actor2Geo_Long
                            };
                            if (hoverArc.length === 0 || !arcsEq(hoverArc[0], hoveredPointArc)) {
                                setHoverArc([hoveredPointArc]);
                            }
                        }
                    } else {
                        setHoverArc([]);
                        setTooltip([]);
                    }
                }}
                onZoom={pov => setPointSize(pov.altitude / 5)}
                arcsData={memoizedArcs}
                arcColor={point =>colorFuncs[colorFunc](point)}
                arcsTransitionDuration={0}
                arcDashAnimateTime={10000}
                arcDashLength={0.15}
                arcDashGap={0.005}
                htmlElementsData={tooltip}
                htmlElement={data => {
                    const element = document.createElement("div");

                    let attribute;
                    const info = { "EventCode": memoizedCodes["eventcodes"][data.point.EventCode] };
                    const fieldMap = { actor: { 1: "Author", 2: "Target" } }

                    for (let i = 1; i <= 2; i++) {
                        for (const field of actorCameoFields) {
                            if (field === "Religion") {
                                for (let j = 1; j <= 2; j++) {
                                    attribute = "Actor" + i + field + j + "Code";
                                    if (data.point[attribute] || data.point[attribute] === 0) {
                                        if (!info[fieldMap["actor"][i]]) info[fieldMap["actor"][i]] = {}
                                        if (!info[fieldMap["actor"][i]][field]) info[fieldMap["actor"][i]][field] = {}
                                        info[fieldMap["actor"][i]][field][j] = memoizedCodes[field.toLowerCase()][data.point[attribute]];
                                    }
                                }
                            }
                            else if (field === "Type") {
                                for (let j = 1; j <= 3; j++) {
                                    attribute = "Actor" + i + field + j + "Code";
                                    if (data.point[attribute] || data.point[attribute] === 0) {
                                        if (!info[fieldMap["actor"][i]]) info[fieldMap["actor"][i]] = {}
                                        if (!info[fieldMap["actor"][i]][field]) info[fieldMap["actor"][i]][field] = {}
                                        info[fieldMap["actor"][i]][field][j] = memoizedCodes[field.toLowerCase()][data.point[attribute]];
                                    }
                                }
                            }
                            else {
                                attribute = "Actor" + i + field + "Code";
                                if (data.point[attribute] || data.point[attribute] === 0) {
                                    if (!info[fieldMap["actor"][i]]) info[fieldMap["actor"][i]] = {}
                                    info[fieldMap["actor"][i]][field] = memoizedCodes[field.toLowerCase()][data.point[attribute]];
                                }
                            }
                        }
                    }

                    let elementString = `
          <div id=hover-tooltip><div><p>Event</p><ul>
          <li>Date: ${data.point.Day.toDateString()}</li>
          <li>Place: ${data.point.ActionGeo_Fullname}</li>
          <li>Event type: ${info.EventCode}</li>
          <li>quadclass: ${quadClasses[data.point.QuadClass]}</li></ul></div>`


                    if (info.Author) {
                        elementString += '<div><p>Author</p><ul>';
                        if (data.point.Actor1Name) elementString += `<li>Name: ${data.point.Actor1Name}</li>`;
                        if (info.Author.Country) elementString += `<li>Country: ${info.Author.Country}</li>`;
                        if (info.Author.Ethnic) elementString += `<li>Ethnicity: ${info.Author.Ethnic}</li>`;
                        if (info.Author.KnownGroup) elementString += `<li>Affiliated group: ${info.Author.KnownGroup}</li>`;
                        if (info.Author.Religion) {
                            elementString += '<li>Affiliated religion: '
                            for (const key in info.Author.Religion) {
                                elementString += info.Author.Religion[key] + ","
                            }
                            elementString += '</li>';
                        }
                        if (info.Author.Type) {
                            elementString += '<li>Type: '
                            for (const key in info.Author.Type) {
                                elementString += info.Author.Type[key] + ","
                            }
                            elementString += '</li>';
                        }
                        elementString += '</ul></div>'
                    }
                    if (info.Target) {
                        elementString += '<div><p>Target</p><ul>';
                        if (data.point.Actor2Name)
                            elementString += `<li>Name: ${data.point.Actor1Name}</li>`;
                        if (info.Target.Country)
                            elementString += `<li>Country: ${info.Target.Country}</li>`;
                        if (info.Target.Ethnic)
                            elementString += `<li>Ethnicity: ${info.Target.Ethnic}</li>`;
                        if (info.Target.KnownGroup)
                            elementString += `<li>Affiliated group: ${info.Target.KnownGroup}</li>`;
                        if (info.Target.Religion) {
                            elementString += '<li>Affiliated religion: '
                            for (const key in info.Target.Religion) {
                                elementString += info.Target.Religion[key] + ","
                            }
                            elementString += '</li>';
                        }
                        if (info.Target.Type) {
                            elementString += '<li>Type: '
                            for (const key in info.Target.Type) {
                                elementString += info.Target.Type[key] + ","
                            }
                            elementString += '</li>';
                        }
                        elementString += '</ul></div>'
                    }

                    elementString += '</div>'

                    element.innerHTML = elementString

                    return element;
                }}
            />

	    <ColorPanel colorHandler={colorButtonHandler} />
        </div>
    );
}

export const ColorPanel = ({colorHandler}) => {

  return (
    <div id="color-panel">
      <p>Color by:</p>
      <button onClick={() => colorHandler("Goldstein")}>
      Goldstein
      </button>
      <button onClick={() => colorHandler("AvgTone")}>
      AvgTone
      </button>
    </div>
  );
};

export default GDELTGlobe;
