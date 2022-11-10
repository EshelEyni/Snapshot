import { miniUser } from './user.model';

export interface Post {
    _id: string;
    txt: string;
    imgUrl: string;
    by: miniUser;
    location: Location;
    likedBy: miniUser[];
    commentsIds: string[];
    createdAt: Date;
    tags: string[];
}

export interface Location {
    lat: number;
    lng: number;
    name: string;
}