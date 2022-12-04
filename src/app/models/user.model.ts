export interface User {
    id: string
    username: string
    fullname: string
    gender: string
    email: string
    phone: string
    password: string
    bio: string
    website: string
    imgUrl: string
    followers: MiniUser[]
    following: MiniUser[]
    createdPostsIds: string[]
    savedPostsIds: string[]
    savedStoriesIds: string[]
    recentSearches: any[]
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