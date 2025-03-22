import Globe from 'react-globe.gl';
// import { Event } from '../data/GDELTTypes';
import earthTexture from '../assets/gdelt/8081_earthmap4k.jpg';
import earthBump from '../assets/gdelt/8081_earthbump4k.jpg';
import skyTexture from '../assets/gdelt/stars.jpg';
import useEvents from '../data/useEvents';
import useCodes from '../data/useCodes';
import { decomposeRegions } from './utils';
import * as d3 from 'd3';
import { useState, useMemo, useEffect, useRef } from 'react';

const today = new Date();
const actorCameoEndpoints = ["eventcodes", "country", "ethnic", "knowngroup", "religion", "type"];
const actorCameoFields = ["Country", "Ethnic", "KnownGroup", "Religion", "Type"]
const quadClasses = { 1: "Verbal Cooperation", 2: "Material Cooperation", 3: "Verbal Conflict", 4: "Material Conflict" }

const colorScale = d3.scaleLinear()
    .domain([-10, 10])
    .range([0, 1])
    .clamp(true);

const goldsteinColor = (point: object) => {
    return d3.interpolateHsl("red", "lime")(colorScale(point.GoldsteinScale));
};

const avgToneColor = (point: object) => {
    return d3.interpolateHsl("red", "lime")(colorScale((20/Math.PI)*Math.atan(point.AvgTone/10)));
};

const colorFuncs = { "Goldstein": goldsteinColor, "AvgTone": avgToneColor }

function GDELTGlobe() {

    // Options
    const [useVisible, setUseVisible] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);

    // Parameters
    const [endHour, setEndHour] = useState<number>(0);
    const [startHour, setStartHour] = useState<number>(23);
    const [hoursChanged, setHoursChanged] = useState<boolean>(false);

    const [povLat, setPovLat] = useState<number>(0);
    const [povLng, setPovLng] = useState<number>(0);
    const [povAlt, setPovAlt] = useState<number>(2.5);
    const [moved, setMoved] = useState<boolean>(false);

    useEffect(() => setMoved(true), [povLat, povLng, povAlt]);
    useEffect(() => setHoursChanged(true), [startHour, endHour]);

    const [visible, setVisible] = useState<object[][][]>([]);

    const [queryParams, setQueryParams] = useState<object>({});

    // Data
    const { events, loadingEvents, errorEvents } = useEvents(queryParams);
    const { codes, loadingCodes, errorCodes } = useCodes(actorCameoEndpoints);

    // Display
    const [tooltip, setTooltip] = useState<object[]>([]);
    const [colorFunc, setColorFunc] = useState<string>("Goldstein");
    const [pointSize, setPointSize] = useState<number>(0.25);
    // const [hoverArc, setHoverArc] = useState<object[]>([]);

    const globeRef = useRef();


    const updateVisible = () => {
        if (globeRef.current) {
	    const regions = decomposeRegions(globeRef.current.getScreenCoords,
	          			   globeRef.current.toGlobeCoords,
	          			   10); // sensible values: divisors of 90
                                                  // 2 3 5 6 9 10 15 18 30 45 90
	    return regions;
        }
    };

    useEffect(() => {
        if (load) {
		if (useVisible && moved) setVisible(updateVisible());

		if (hoursChanged || (useVisible && moved))
			setQueryParams({startHour: startHour, endHour: endHour, limits: visible});

		console.log(queryParams)
		setHoursChanged(false);
		setMoved(false);
		setLoad(false);
	}
    }, [load])

    /* const arcsEq = (x: any, y: any) => {
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
    }; */

    const colorButtonHandler = color => setColorFunc(color);

    const memoizedCodes = useMemo(() => {
        if (!loadingCodes && !errorCodes) {
            return codes
        }
        return [];
    }, [codes, loadingCodes, errorCodes]);

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

    return (
        <div>
            <Globe
	    	ref={globeRef}
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
			// Arcs are currently always shown

                        /*if (arcNonTrivial(point)) {
                            const hoveredPointArc = {
                                startLat: point.Actor1Geo_Lat,
                                startLng: point.Actor1Geo_Long,
                                endLat: point.Actor2Geo_Lat,
                                endLng: point.Actor2Geo_Long
                            };
                            if (hoverArc.length === 0 || !arcsEq(hoverArc[0], hoveredPointArc)) {
                                setHoverArc([hoveredPointArc]);
                            }
                        }*/
                    } else {
                        // setHoverArc([]);
                        setTooltip([]);
                    }
                }}
                onZoom={pov => {
			setPointSize(pov.altitude / 5);
			setPovLat(pov.lat);
			setPovLng(pov.lng);
			setPovAlt(pov.altitude);
		}}
                arcsData={memoizedArcs}
                arcColor={point => colorFuncs[colorFunc](point)}
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

	    <ControlPanel colorHandler={colorButtonHandler}
	                  setLoad={setLoad}
			  setUseVisible={setUseVisible}
			  setHoursChanged={setHoursChanged}
	                  endHour={endHour} setEndHour={setEndHour}
			  startHour={startHour} setStartHour={setStartHour} debugRef={globeRef} />
        </div>
    );
}

export const ControlPanel = ({colorHandler, setLoad, setHoursChanged, setUseVisible,
                              endHour, setEndHour, startHour, setStartHour, debugRef}) => {

  useEffect(() => {
      if (startHour <= endHour) setStartHour(endHour+1);
      setHoursChanged(true);
  }, [endHour])

  useEffect(() => {
      if (startHour <= endHour) setEndHour(startHour-1);
      setHoursChanged(true);
  }, [startHour])

  return (
    <div id="control-panel">
      <button onClick={() => console.log(debugRef.current.getCoords(0,90))}>Debug points</button>
      <button onClick={() => setLoad(true)}>Load events</button>
      <div><input type="checkbox" onChange={(props) => setUseVisible(props.target.checked)} /> Load visible only</div>
      <div>
        <div>
          <div>Load from</div>
          <div>to</div>
        </div>
        <div>
          <div><input onChange={(props) => setEndHour(Number.parseInt(props.target.value))} type="range" min={0} max={22} step={1} value={endHour} /> {endHour} hour(s) ago</div>
          <div><input onChange={(props) => setStartHour(Number.parseInt(props.target.value))} type="range" min={1} max={23} step={1} value={startHour} /> {startHour} hour(s) ago.</div>
        </div>
      </div>
      <div>
        Color by: 
        <button onClick={() => colorHandler("Goldstein")}>Goldstein</button>
        <button onClick={() => colorHandler("AvgTone")}>AvgTone</button>
      </div>
    </div>
  );
};

export default GDELTGlobe;
