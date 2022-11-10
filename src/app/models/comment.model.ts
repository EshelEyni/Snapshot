import { miniUser } from './user.model';

export interface Comment {
    _id: string;
    by: miniUser;
    txt: string;
    at: Date;
    likedBy: miniUser[];
}
