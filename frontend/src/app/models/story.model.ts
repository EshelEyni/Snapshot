import { MiniUser } from './user.model';

export interface Story {
    id: number;
    createdAt: Date;
    imgUrls: string[];
    by: MiniUser;
    viewedBy: MiniUser[];
    isArchived: boolean;
    isSaved: boolean;
}

export interface StoryImg {
    url: string;
    items: any[];
}