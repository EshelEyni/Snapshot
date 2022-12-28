import { MiniUser } from './user.model';

export interface Notification {
    id: number;
    type: string;
    by: MiniUser;
    createdAt: Date;
    postImg?: string;
    userId: number;
}
