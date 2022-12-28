import { MiniUser } from './user.model';

export interface Story {
    id: number;
    createdAt: Date;
    imgUrls: StoryImg[];
    by: MiniUser;
    watchedBy: MiniUser[];
}

export interface StoryImg {
    url: string;
    items: any[];
}