export interface User {
    id: string
    username: string
    fullname: string
    email: string
    password: string
    imgUrl: string
    gender: string
    phone: string
    bio: string
    website: string
    followersSum: number
    followingSum: number
    postSum: number
    currStoryId: string
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