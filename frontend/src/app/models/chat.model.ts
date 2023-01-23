import {  MiniUser } from './user.model';

export interface Chat {
    id: number
    admin: MiniUser;
    members: MiniUser[];
    messages: Message[];
    isGroup: boolean;
    isBlocked: boolean;
    isMuted: boolean;
}

export interface Message {
    id: number
    chatId: number;
    sender: MiniUser;
    text: string;
    createdAt: Date;
    postId?: number;
}