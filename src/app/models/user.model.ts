export interface User {
    _id: string
    username: string
    fullname: string
    email: string
    password: string
    imgUrl: string
    followers: MiniUser[]
    following: MiniUser[]
    savedPostsIds: string[]
    savedStoriesIds: string[]
}

export interface MiniUser {
    _id: string
    fullname: string,
    username: string,
    imgUrl: string
}


export interface UserFilter {
    term: string
}