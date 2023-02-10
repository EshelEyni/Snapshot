import { MiniUser } from './user.model';

export interface Story {
    id: number;
    createdAt: Date;
    imgUrls: string[];
    by: MiniUser;
    isArchived: boolean;
    isSaved: boolean;
    highlightTitle: string | null;
    highlightCover: number | null;
};

export interface StoryImg {
    url: string;
    items: any[];
};