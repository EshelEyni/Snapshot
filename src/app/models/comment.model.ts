import { MiniUser } from './user.model';

export interface Comment {
    _id: string;
    by: MiniUser;
    txt: string;
    at: Date;
    likedBy: MiniUser[];
}
