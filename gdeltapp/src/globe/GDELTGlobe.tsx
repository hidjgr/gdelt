import Globe from 'react-globe.gl';
import { Event } from '../data/GDELTTypes';
import earthTexture from '../assets/gdelt/8081_earthmap4k.jpg';
import earthBump from '../assets/gdelt/8081_earthbump4k.jpg';
import skyTexture from '../assets/gdelt/stars.jpg';
import useEvents from '../data/useEvents';
import { useEffect, useState, useMemo } from 'react';

const today = new Date();

function GDELTGlobe() {
    // Data variables
    const { events, loading, error } = useEvents(today, today);
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

    // Memoize points data to avoid recalculating unless `events`, `loading`, or `error` changes
    const memoizedPoints = useMemo(() => {
        if (!loading && !error) {
            return events.filter(event => event.ActionGeo_FeatureID !== null);
        }
        return [];
    }, [events, loading, error]);

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
                            url: point.SOURCEURL,
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
                    element.innerHTML = `
                    <div class=hover-tooltip>
                        <div>Event ID: ${data.url}</div>
                        <div>Location: ${data.lat}, ${data.lng}</div>
			<p>${JSON.stringify(data.point)}</p>
                    </div>`;
                    return element;
                }}
            />

        </div>
    );
}

export default GDELTGlobe;
