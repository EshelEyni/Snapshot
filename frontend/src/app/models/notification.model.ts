import { MiniUser } from './user.model';

export interface Notification {
    id: string;
    type: string;
    by: MiniUser;
    createdAt: Date;
    postImg?: string;
    userId: string;
}
