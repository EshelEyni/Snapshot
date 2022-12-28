import { MiniUser } from './user.model';

export interface Comment {
    id: number;
    postId: number;
    by: MiniUser;
    text: string;
    createdAt: Date;
    isOriginalText: boolean;
    likedBy: MiniUser[];
}
