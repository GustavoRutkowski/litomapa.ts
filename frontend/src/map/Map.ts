import L from 'leaflet';

type Thread = {
    id: number;
    longitude: number;
    latitude: number;
};

export default class Map {
    private readonly map: L.Map;
    private readonly markerLayer: L.LayerGroup;

    // Cria uma nova instância do mapa Leaflet dentro do elemento HTML passado.
    // Exemplo: const mapa = new Map(document.getElementById('mapa')!);
    constructor(container: HTMLElement) {
        this.map = L.map(container, {
            zoomControl: true,
            scrollWheelZoom: true
        });

        this.markerLayer = L.layerGroup().addTo(this.map);

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

    // Cria um marcador visual para uma thread, usando lat/long como coordenadas.
    private createMarker(thread: Thread): L.CircleMarker {
        const marker = L.circleMarker([thread.latitude, thread.longitude], {
            radius: 7,
            color: '#2563eb',
            fillColor: '#60a5fa',
            fillOpacity: 0.85,
            weight: 2
        });

        marker.bindTooltip(`Thread #${thread.id}`);
        return marker;
    }

    // Renderiza uma lista de threads no mapa.
    // Passe as threads com latitude/longitude e, opcionalmente, desative o ajuste automático de zoom com { fitBounds: false }.
    public renderThreads(
        threads: Thread[],
        options?: {
            fitBounds?: boolean;
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
            this.createMarker(thread).addTo(this.markerLayer);
        }

        if (options?.fitBounds ?? true) {
            this.map.fitBounds(bounds, {
                padding: [24, 24]
            });
        }
    }

    // Remove todos os marcadores atualmente exibidos no mapa.
    public clear(): void {
        this.markerLayer.clearLayers();
    }

    // Libera o mapa e limpa os elementos associados quando ele não for mais necessário.
    public destroy(): void {
        this.markerLayer.clearLayers();
        this.map.remove();
    }
}
