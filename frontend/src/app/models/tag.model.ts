import { Post } from "./post.model";

export interface Tag {
    id: number;
    name: string;
    postSum:number;
    isFollowing: boolean;
    posts?: Post[];
};