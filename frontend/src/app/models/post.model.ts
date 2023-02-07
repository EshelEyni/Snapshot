import { Comment } from './comment.model';
import { MiniUser } from './user.model'

export interface Post {
  id: number;
  imgUrls: string[];
  by: MiniUser;
  location: Location | null;
  isLikeShown: boolean;
  isCommentShown: boolean;
  likeSum: number;
  comments: Comment[];
  commentSum: number;
  createdAt: Date;
  tags: string[];
};

export interface Location {
  id: number;
  lat: number;
  lng: number;
  name: string;
};

export interface PostCanvasImg {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: string;
  zoom: number;
  filter: string;
};