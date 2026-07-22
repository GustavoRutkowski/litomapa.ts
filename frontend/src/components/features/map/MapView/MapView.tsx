import { useEffect, useRef, useState } from 'react';
import { GeoJsonObject } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import useThreads from '../../../../hooks/useThreads';
import Map from '../../../../utils/Map';
import styles from './MapView.module.scss';
import { ThreadDTO } from '../../../../services/threads.service';

interface IProps {
    geojson?: GeoJsonObject | null;
    height?: string | number;
    className?: string;
    tag?: string;
}

export default function MapView({ geojson, className, tag }: IProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const navigate = useNavigate();
    const { getThreads } = useThreads();
    const [threads, setThreads] = useState<Array<ThreadDTO>>([]);

    useEffect(() => {
        let isMounted = true;

        const loadThreads = async () => {
            const response = await getThreads({ tag: tag?.trim() || undefined });
            if (!isMounted) return;
            setThreads(response.data);
        };

        void loadThreads();
        return () => {
            isMounted = false;
        };
    }, [getThreads, tag]);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        mapRef.current = new Map(containerRef.current, threadId => navigate(`/thread/${threadId}`));

        return () => {
            mapRef.current?.destroy();
            mapRef.current = null;
        };
    }, [navigate]);

    useEffect(() => {
        if (!mapRef.current) return;
        if (!geojson) return;

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
            fitBounds: threads.length > 0,
            filterTag: tag
        });
    }, [tag, threads]);

    return (
        <div
            ref={containerRef}
            className={[styles.container, className].filter(Boolean).join(' ')}
        />
    );
}
