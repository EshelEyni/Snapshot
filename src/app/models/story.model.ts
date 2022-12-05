import { MiniUser } from './user.model';

export interface Story {
    id: string;
    imgUrls: string[];
    by: MiniUser;
    watchedBy: MiniUser[];
    createdAt: Date;
}
