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
