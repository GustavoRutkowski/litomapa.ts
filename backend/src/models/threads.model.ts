import User from './users.model.js';
import Specie from './species.model.js';

type ThreadAuthor = Pick<User, 'id' | 'username' | 'photo'>;

type Thread = {
    id: number;
    title: string;
    createdAt: string; // Assuming it's stored as a string in UTC format
    coords: {
        latitude: number;
        longitude: number;
    };
    author: ThreadAuthor;
    species: Specie[];
    tags: string[];
};

export default Thread;
