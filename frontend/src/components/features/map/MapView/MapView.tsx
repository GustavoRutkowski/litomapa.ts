import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import useThreads from '../../../../hooks/useThreads';
import Map from '../../../../map/Map';
import styles from './MapView.module.scss';

type GeoJSONLike = Record<string, unknown> | null;

interface MapViewProps {
    geojson?: GeoJSONLike;
    height?: string | number;
    className?: string;
}

const DEFAULT_RS_GEOJSON: GeoJSONLike = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-33.75, -57.7],
                        [-29.2, -57.7],
                        [-29.2, -49.6],
                        [-33.75, -49.6],
                        [-33.75, -57.7]
                    ]
                ]
            }
        }
    ]
};

export default function MapView({
    geojson = DEFAULT_RS_GEOJSON,
    height = '480px',
    className
}: MapViewProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const { getThreads } = useThreads();
    const [threads, setThreads] = useState<
        Array<{ id: number; latitude: number; longitude: number }>
    >([]);

    useEffect(() => {
        let isMounted = true;

        const loadThreads = async () => {
            const response = await getThreads({ limit: 50 });
            if (!isMounted) return;
            setThreads(response.data);
        };

        void loadThreads();

        return () => {
            isMounted = false;
        };
    }, [getThreads]);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        mapRef.current = new Map(containerRef.current);

        return () => {
            mapRef.current?.destroy();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        mapRef.current.renderGeoJSON(geojson, {
            fitBounds: true,
            style: {
                color: '#2563eb',
                weight: 1.5,
                fillColor: '#60a5fa',
                fillOpacity: 0.2
            }
        });
    }, [geojson]);

    useEffect(() => {
        if (!mapRef.current) return;

        mapRef.current.renderThreads(threads, {
            fitBounds: threads.length > 0
        });
    }, [threads]);

    return (
        <div
            ref={containerRef}
            className={[styles.container, className].filter(Boolean).join(' ')}
            style={{ width: '100%', height, minHeight: height }}
        />
    );
}
