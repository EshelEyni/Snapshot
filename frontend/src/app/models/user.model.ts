export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    password: string;
    imgUrl: string;
    gender: string;
    phone: string;
    bio: string;
    website: string;
    followersSum: number;
    followingSum: number;
    postSum: number;
    storySum: number;
    currStoryId: number;
    isDarkMode: boolean;
};

export interface MiniUser {
    id: number;
    fullname: string;
    username: string;
    imgUrl: string;
};


export interface UserFilter {
    term: string;
};