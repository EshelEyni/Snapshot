import { Post } from 'src/app/models/post.model';
import { MiniUser } from './user.model';

export interface Notification {
    id: number;
    type: string;
    by: MiniUser;
    userId: number;
    entityTypeId: number;
    createdAt: Date;
    post?: Post;
}

export interface NotificationsByDate {
    today: { label: string, notifications: Notification[] };
    yesterday: { label: string, notifications: Notification[] };
    thisWeek: { label: string, notifications: Notification[] };
    lastWeek: { label: string, notifications: Notification[] };
    thisMonth: { label: string, notifications: Notification[] };
    earlier: { label: string, notifications: Notification[] };
}