import { MiniUser } from './user.model';

export interface Story {
    id: string;
    imgUrls: StoryImg[];
    by: MiniUser;
    watchedBy: MiniUser[];
    createdAt: Date;
}

export interface StoryImg {
    url: string;
    items: any[];
}