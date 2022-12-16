CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER NOT NULL UNIQUE,
    "username" TEXT NOT NULL UNIQUE,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imgUrl" TEXT,
    "gender" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "followersSum" INTEGER NOT NULL,
    "followingSum" INTEGER NOT NULL,
    "postSum" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "posts" (
    "id" INTEGER NOT NULL UNIQUE,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "likeSum" INTEGER NOT NULL,
    "commentSum" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "postsImgs" (
    "id" INTEGER NOT NULL UNIQUE,
    "postId" INTEGER NOT NULL,
    "imgUrl" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("postId") references "posts"("id")
);

CREATE TABLE IF NOT EXISTS "postsLikedBy"(
    "id" INTEGER NOT NULL UNIQUE,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("postId") references "posts"("id") foreign key ("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "comments" (
    "id" INTEGER NOT NULL UNIQUE,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "likes" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("postId") references "posts"("id") foreign key("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "commentsLikedBy"(
    "id" INTEGER NOT NULL UNIQUE,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("commentId") references "comments"("id") foreign key ("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "followers" (
    "id" INTEGER NOT NULL UNIQUE,
    "followingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL UNIQUE,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("followingId") references "users"("id") foreign key ("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "following" (
    "id" INTEGER NOT NULL UNIQUE,
    "followerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL UNIQUE,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("followerId") references "users"("id") foreign key ("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "recentSearches" (
    "id" INTEGER NOT NULL UNIQUE,
    "searcherId" INTEGER NOT NULL,
    "searchTerm" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("searcherId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "savedPosts" (
    "id" INTEGER NOT NULL UNIQUE,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("userId") references "users"("id") foreign key ("postId") references "posts"("id")
);

CREATE TABLE IF NOT EXISTS "tags" (
    "id" INTEGER NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "postTags" (
    "id" INTEGER NOT NULL UNIQUE,
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("postId") references "posts"("id") foreign key ("tagId") references "tags"("id")
);

CREATE TABLE IF NOT EXISTS "locations" (
    "id" INTEGER NOT NULL UNIQUE,
    "lat" INTEGER NOT NULL,
    "lng" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" INTEGER NOT NULL UNIQUE,
    "userId" INTEGER NOT NULL,
    "byUserId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "postImg" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("userId") references "users"("id") foreign key ("byUserId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "stories" (
    "id" INTEGER NOT NULL UNIQUE,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "storyImg" (
    "id" INTEGER NOT NULL UNIQUE,
    "storyId" INTEGER NOT NULL,
    "imgUrl" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("storyId") references "stories"("id")
);

CREATE TABLE IF NOT EXISTS "storyViews" (
    "id" INTEGER NOT NULL UNIQUE,
    "storyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("storyId") references "stories"("id") foreign key ("userId") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "storiesLikedBy"(
    "id" INTEGER NOT NULL UNIQUE,
    "storyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("storyId") references "stories"("id") foreign key ("userId") references "users"("id")
);