export interface User {
    id: string
    username: string
    fullname: string
    email: string
    password: string
    imgUrl: string
    followers: MiniUser[]
    following: MiniUser[]
    createdPostsIds: string[]
    savedPostsIds: string[]
    savedStoriesIds: string[]
}

export interface MiniUser {
    id: string
    fullname: string,
    username: string,
    imgUrl: string
}


export interface UserFilter {
    term: string
}