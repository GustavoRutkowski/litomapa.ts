import L from 'leaflet';

type Thread = {
    id: number;
    longitude: number;
    latitude: number;
    tags?: Array<{ name: string }>;
};

type GeoJSONLike = Record<string, unknown> | null;

export default class Map {
    private readonly map: L.Map;
    private readonly markerLayer: L.LayerGroup;
    private readonly geoJsonLayer: L.LayerGroup;

    // Cria uma nova instância do mapa Leaflet dentro do elemento HTML passado.
    // Exemplo: const mapa = new Map(document.getElementById('mapa')!);
    constructor(container: HTMLElement) {
        this.map = L.map(container, {
            zoomControl: true,
            scrollWheelZoom: true
        });

        this.markerLayer = L.layerGroup().addTo(this.map);
        this.geoJsonLayer = L.layerGroup().addTo(this.map);

        this.configureBaseMap();
        this.configureBounds();
    }

    // Configura o tile layer base do mapa, usando o OpenStreetMap.
    private configureBaseMap(): void {
        this.map.setView([-29.9, -53.5], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
    }

    // Limita a visualização do mapa à extensão geográfica do Rio Grande do Sul.
    private configureBounds(): void {
        const rsBounds = L.latLngBounds(
            [-33.8, -57.7], // Sudoeste
            [-27.0, -49.6] // Nordeste
        );

        this.map.setMaxBounds(rsBounds);
        this.map.setMinZoom(6);
        this.map.fitBounds(rsBounds);
    }

    private getMarkerStyle(thread: Thread, filterTag?: string): L.CircleMarkerOptions {
        const normalizedFilter = filterTag?.trim().toUpperCase();
        const tagNames = (thread.tags ?? []).map(tag => tag.name.toUpperCase());

        if (normalizedFilter === 'MIGRATION' || tagNames.includes('MIGRATION')) {
            return {
                radius: 7,
                color: '#9e2f79',
                fillColor: '#d946ef',
                fillOpacity: 0.9,
                weight: 2
            };
        }

        if (normalizedFilter === 'INVASIVE_SPECIES' || tagNames.includes('INVASIVE_SPECIES')) {
            return {
                radius: 7,
                color: '#f57600',
                fillColor: '#fb923c',
                fillOpacity: 0.9,
                weight: 2
            };
        }

        if (normalizedFilter === 'REPORT' || tagNames.includes('REPORT')) {
            return {
                radius: 7,
                color: '#d9480f',
                fillColor: '#f97316',
                fillOpacity: 0.9,
                weight: 2
            };
        }

        return {
            radius: 7,
            color: '#2563eb',
            fillColor: '#60a5fa',
            fillOpacity: 0.85,
            weight: 2
        };
    }

    // Cria um marcador visual para uma thread, usando lat/long como coordenadas.
    private createMarker(thread: Thread, filterTag?: string): L.CircleMarker {
        const marker = L.circleMarker(
            [thread.latitude, thread.longitude],
            this.getMarkerStyle(thread, filterTag)
        );

        marker.bindTooltip(`Thread #${thread.id}`);
        return marker;
    }

    // Renderiza uma lista de threads no mapa.
    // Passe as threads com latitude/longitude e, opcionalmente, desative o ajuste automático de zoom com { fitBounds: false }.
    public renderThreads(
        threads: Thread[],
        options?: {
            fitBounds?: boolean;
            filterTag?: string;
        }
    ): void {
        this.clear();

        const points = threads.filter(
            thread => Number.isFinite(thread.latitude) && Number.isFinite(thread.longitude)
        );

        if (points.length === 0) return;

        const bounds = L.latLngBounds(
            points.map(thread => [thread.latitude, thread.longitude] as L.LatLngExpression)
        );

        for (const thread of points) {
            this.createMarker(thread, options?.filterTag).addTo(this.markerLayer);
        }

        if (options?.fitBounds ?? true) {
            this.map.fitBounds(bounds, {
                padding: [24, 24]
            });
        }
    }

    public renderGeoJSON(
        geojson: GeoJSONLike,
        options?: {
            fitBounds?: boolean;
            style?: L.PathOptions;
        }
    ): void {
        this.geoJsonLayer.clearLayers();

        if (!geojson) return;

        const layer = L.geoJSON(geojson as unknown as GeoJSON.GeoJsonObject, {
            style: options?.style ?? {
                color: '#1d4ed8',
                weight: 1,
                fillColor: '#93c5fd',
                fillOpacity: 0.25
            }
        });

        layer.addTo(this.geoJsonLayer);

        if (options?.fitBounds ?? true) {
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
                this.map.fitBounds(bounds, {
                    padding: [24, 24]
                });
            }
        }
    }

    public clearGeoJSON(): void {
        this.geoJsonLayer.clearLayers();
    }

    // Remove todos os marcadores atualmente exibidos no mapa.
    public clear(): void {
        this.markerLayer.clearLayers();
    }

    // Libera o mapa e limpa os elementos associados quando ele não for mais necessário.
    public destroy(): void {
        this.markerLayer.clearLayers();
        this.geoJsonLayer.clearLayers();
        this.map.remove();
    }
}
