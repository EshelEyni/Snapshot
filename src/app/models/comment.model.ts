import { MiniUser } from './user.model';

export interface Comment {
    id: string;
    by: MiniUser;
    txt: string;
    at: Date;
    likedBy: MiniUser[];
}
