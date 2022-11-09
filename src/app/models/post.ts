import { miniUser } from './user';

export interface Post {
    _id: string;
    txt: string;
    imgUrl: string;
    by: miniUser;
    location: Location;
    likedBy: miniUser[];
    comments: Comment[];
    createdAt: Date;
    tags: string[];
}

export interface Location {
    lat: number;
    lng: number;
    name: string;
}

export interface Comment {
    _id: string;
    by: miniUser;
    txt: string;
    at: Date;
    likedBy: miniUser[];
}
