CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER NOT NULL UNIQUE,
    "user_name" TEXT NOT NULL UNIQUE,
    "full_name" TEXT NOT NULL,
    "img_url" TEXT,
    "bio" TEXT,
    "gender" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "posts" (
    "id" INTEGER NOT NULL UNIQUE,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "likes" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "posts_images" (
    "id" INTEGER NOT NULL UNIQUE,
    "post_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("post_id") references "posts"("id")
);

CREATE TABLE IF NOT EXISTS "posts_liked_by"(
    "id" INTEGER NOT NULL UNIQUE,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("post_id") references "posts"("id") foreign key ("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "comments" (
    "id" INTEGER NOT NULL UNIQUE,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "likes" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("post_id") references "posts"("id") foreign key("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "comments_liked_by"(
    "id" INTEGER NOT NULL UNIQUE,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("comment_id") references "comments"("id") foreign key ("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "followers" (
    "id" INTEGER NOT NULL UNIQUE,
    "following_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL UNIQUE,
    "user_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("following_id") references "users"("id") foreign key ("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "following" (
    "id" INTEGER NOT NULL UNIQUE,
    "follower_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL UNIQUE,
    "user_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("follower_id") references "users"("id") foreign key ("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "recent_searches" (
    "id" INTEGER NOT NULL UNIQUE,
    "searcher_id" INTEGER NOT NULL,
    "search_term" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("searcher_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "saved_posts" (
    "id" INTEGER NOT NULL UNIQUE,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("user_id") references "users"("id") foreign key ("post_id") references "posts"("id")
);

CREATE TABLE IF NOT EXISTS "tags" (
    "id" INTEGER NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "posts_tags" (
    "id" INTEGER NOT NULL UNIQUE,
    "post_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("post_id") references "posts"("id") foreign key ("tag_id") references "tags"("id")
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
    "user_id" INTEGER NOT NULL,
    "by_user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "post_img" TEXT,
    "created_at" TIMESTAMP NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("user_id") references "users"("id") foreign key ("by_user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "stories" (
    "id" INTEGER NOT NULL UNIQUE,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "story_img" (
    "id" INTEGER NOT NULL UNIQUE,
    "story_id" INTEGER NOT NULL,
    "img_url" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("story_id") references "stories"("id")
);

CREATE TABLE IF NOT EXISTS "story_views" (
    "id" INTEGER NOT NULL UNIQUE,
    "story_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("story_id") references "stories"("id") foreign key ("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "stories_liked_by"(
    "id" INTEGER NOT NULL UNIQUE,
    "story_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("story_id") references "stories"("id") foreign key ("user_id") references "users"("id")
);