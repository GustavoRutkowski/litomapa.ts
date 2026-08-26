import type User from './users.model.js';

type MessageAuthor = Pick<User, 'id' | 'username' | 'photo'>;

type ReplyingMessage = {
    id: number;
    content: string;
    author: MessageAuthor;
};

type Message = {
    id: number;
    threadId: number;
    content: string;
    createdAt: string;
    attachments: string[];
    author: MessageAuthor;
    replying: ReplyingMessage | null;
};

export default Message;
