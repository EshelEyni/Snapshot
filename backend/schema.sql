CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER NOT NULL UNIQUE,
    "name" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "posts" (
    "id" INTEGER NOT NULL UNIQUE,
    "user_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key("user_id") references "users"("id")
);

CREATE TABLE IF NOT EXISTS "posts_images" (
    "id" INTEGER NOT NULL UNIQUE,
    "post_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("post_id") references "posts"("id")
);

CREATE TABLE IF NOT EXISTS "comments" (
    "id" INTEGER NOT NULL UNIQUE,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "likes" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT) foreign key ("post_id") references "posts"("id") foreign key("user_id") references "users"("id")
);