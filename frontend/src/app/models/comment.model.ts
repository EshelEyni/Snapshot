import { MiniUser } from './user.model';

export interface Comment {
    isLiked: boolean;
    id: number;
    postId: number;
    by: MiniUser;
    text: string;
    createdAt: Date;
    isOriginalText: boolean;
    likeSum: number;
    mentions?: { userId: number, username: string }[];
};