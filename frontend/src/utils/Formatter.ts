import defaultPictureUrl from '@/assets/default-picture.png';
import Api from './Api';

interface INominatimResponse {
    address: {
        road?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
    };
}

const nominatim = new Api('https://nominatim.openstreetmap.org');

export default class Formatter {
    static formatPicture(picture: string | null | undefined): string {
        if (!picture) return defaultPictureUrl;
        return `/api/uploads/${picture}`;
    }

    static relativeDateFrom(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const SECOND = 1000;
        const MINUTE = SECOND * 60;

        const minutes = Math.floor(diff / MINUTE);

        if (minutes <= 0) return 'Agora mesmo';
        if (minutes === 1) return 'há 1 minuto';
        if (minutes < 60) return `há ${minutes} minutos`;

        const hours = Math.floor(minutes / 60);

        if (hours === 1) return 'há 1 hora';
        if (hours < 24) return `há ${hours} horas`;

        const days = Math.floor(hours / 24);

        if (days === 1) return 'há 1 dia';
        if (days < 7) return `há ${days} dias`;

        const weeks = Math.floor(days / 7);

        if (weeks === 1) return 'há 1 semana';
        if (weeks < 5) return `há ${weeks} semanas`;

        const months = Math.floor(days / 30);

        if (months === 1) return 'há 1 mês';
        if (months < 12) return `há ${months} meses`;

        const years = Math.floor(days / 365);

        if (years === 1) return 'há 1 ano';
        return `há ${years} anos`;
    }

    static async addressFrom(lat: number, lon: number): Promise<string> {
        const response = await nominatim.get<INominatimResponse>('/reverse', {
            query: { format: 'jsonv2', lat, lon }
        });

        const { address } = response;

        return [
            address.road,
            address.suburb,
            address.city ?? address.town ?? address.village,
            address.state
        ]
            .filter(Boolean)
            .join(' • ');
    }
}
