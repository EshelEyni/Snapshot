import { MiniUser } from './user.model';

export interface Post {
    id: string;
    txt: string;
    imgUrls: string[];
    by: MiniUser;
    location: Location;
    likedBy: MiniUser[];
    commentsIds: string[];
    createdAt: Date;
    tags: string[];
}

export interface Location {
    lat: number;
    lng: number;
    name: string;
}