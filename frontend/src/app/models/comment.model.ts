import { MiniUser } from './user.model';

export interface Comment {
    id: string;
    postId: string;
    by: MiniUser;
    text: string;
    createdAt: Date;
    isOriginalText: boolean;
    likedBy: MiniUser[];
}
