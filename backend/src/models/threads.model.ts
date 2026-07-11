import User from './users.model.js';
import Specie from './species.model.js';
import Tag from './tags.model.js';

type ThreadAuthor = Pick<User, 'id' | 'username' | 'photo'>;

type Thread = {
    id: number;
    title: string;
    author: ThreadAuthor;
    specie: Specie;
    tags: Tag[];
};

export default Thread;
