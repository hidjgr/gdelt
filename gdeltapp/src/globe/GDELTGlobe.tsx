import Globe from 'react-globe.gl';
import { Event } from '../data/GDELTTypes';
import earthTexture from '../assets/gdelt/8081_earthmap4k.jpg';
import earthBump from '../assets/gdelt/8081_earthbump4k.jpg';
import skyTexture from '../assets/gdelt/stars.jpg';
import useEvents from '../data/useEvents';
import useCodes from '../data/useCodes';
import { useState, useMemo } from 'react';

const today = new Date();
const cameo = ["country", "ethnic", "knowngroup", "religion", "type"];
const cameoFields = ["Country", "Ethnic", "KnownGroup", "Religion", "Type"]

function GDELTGlobe() {
  // Data variables
  const { events, loadingEvents, errorEvents } = useEvents(today, today);
  const { codes, loadingCodes, errorCodes } = useCodes(cameo);
  const [tooltip, setTooltip] = useState<object[]>([]);
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

  const memoizedPoints = useMemo(() => {
    if (!loadingEvents && !errorEvents) {
      return events.filter(event => event.ActionGeo_FeatureID !== null &&
        event.ActionGeo_Lat !== 0 &&
        event.ActionGeo_Long !== 0);
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
        pointAltitude={0.01}
        pointLat={point => point.ActionGeo_Lat || 0}
        pointLng={point => point.ActionGeo_Long || 0}
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
        arcsData={hoverArc}
        arcsTransitionDuration={0}
        htmlElementsData={tooltip}
        htmlElement={data => {
          const element = document.createElement("div");

          let attribute;
          const info = {};
          const fieldMap = { actor: { 1: "Author", 2: "Target" } }

          for (let i = 1; i <= 2; i++) {
            for (const field of cameoFields) {
              if (field === "Religion") {
                for (let j = 1; j <= 2; j++) {
                  attribute = "Actor" + i + field + j + "Code";
                  if (data.point[attribute] || data.point[attribute] === 0) {
                    if (!info[fieldMap["actor"][i]]) info[fieldMap["actor"][i]] = {}
                    if (!info[fieldMap["actor"][i]][field]) info[fieldMap["actor"][i]][field] = {}
                    info[fieldMap["actor"][i]][field][j] = codes[field.toLowerCase()][data.point[attribute]];
                  }
                }
              }
              else if (field === "Type") {
                for (let j = 1; j <= 3; j++) {
                  attribute = "Actor" + i + field + j + "Code";
                  if (data.point[attribute] || data.point[attribute] === 0) {
                    if (!info[fieldMap["actor"][i]]) info[fieldMap["actor"][i]] = {}
                    if (!info[fieldMap["actor"][i]][field]) info[fieldMap["actor"][i]][field] = {}
                    info[fieldMap["actor"][i]][field][j] = codes[field.toLowerCase()][data.point[attribute]];
                  }
                }
              }
              else {
                attribute = "Actor" + i + field + "Code";
                if (data.point[attribute] || data.point[attribute] === 0) {
                  if (!info[fieldMap["actor"][i]]) info[fieldMap["actor"][i]] = {}
                  info[fieldMap["actor"][i]][field] = codes[field.toLowerCase()][data.point[attribute]];
                }
              }
            }
          }

          let elementString = `
        <div class=hover-tooltip><div><p>Event</p><ul>
        <li>Date: ${data.point.Day}</li>
                    <li>Place: ${data.point.ActionGeo_Fullname}</li>
                    <li>${data.point.NumArticles}</li>
                    <li>avg tone: ${data.point.AvgTone}</li>
                    <li>goldstein: ${data.point.GoldsteinScale}</li>
                    <li>quadclass: ${data.point.QuadClass}</li></ul></div>`


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

    </div>
  );
}

export default GDELTGlobe;
