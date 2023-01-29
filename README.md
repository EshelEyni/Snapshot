<h1 align="center"> Snapshot - An awesome Instagram clone </h1>

<p> Welcome to Snapshot! A fully-featured Instagram clone built entirely from scratch with Angular, Node.js, and SQL. This project is an excellent demonstration of my ability to design, develop and deploy a responsive, beautiful and fully-functional app using Object-Oriented Programming, SQL queries and a variety of other technologies. Snapshot is a complete social media platform that includes all the core features you would expect from an Instagram clone, such as user authentication, image uploads, likes, comments, and more. The user interface is designed to be intuitive, easy to use, and responsive, and the back-end is built to handle large amounts of data and traffic. The codebase is well-organized, easy to understand and customize, making it an ideal starting point for anyone looking to build their own social media application.<p>

<p>Snapshot is a personal project that I, the author, have built from scratch with the exception of the initial stages where I received invaluable assistance from my friend Tal to help me get started. As the project progressed, I received further technical support from my brother Oren in building the backend and API for the SQL database. Although I am the main developer of the project, I couldn't have done it without their contributions. Their support and expertise were integral in bringing Snapshot to life and I am grateful for their help in making this project a reality.</p>

 You can check it out [here ](https://snapshot-zzha.onrender.com/#/).

![Main board image](screenshots/home-page.png)

### Table of Contents
- [Snapshot Description](#snapshot-description)
- [Application Features](#application-features)
- [Technologies](#technologies)
- [Getting started:](#getting-started)
- [Deployment](#deployment)
- [Showcase](#showcase)
- [Author](#author)
- [Contributors](#contributors)

## Snapshot Description
Snapshot is a picture-based social network app. In contrast to other social networks, the emphasis in Snapshot is on pictures - as the old saying goes, "one picture is worth a million words." This is the core concept that Snapshot is built around, with inspiration from Instagram.
In Snapshot, you can upload a post, with at least one photo required to be attached to it. The photos can be customized with a crop tool and color filters. Other users can like or comment on your post, and your network grows with the engagement.
Snapshot also supports Stories, meaning you can upload a picture, customize it with text, drawing, or stickers, and it will be uploaded and available for viewing on the site for 24 hours. After 24 hours, the story will be archived, but you can still attach it to your profile at your personal profile page, and it will be saved as a highlight to your profile.
In Snapshot, the message page allows you to create chat rooms with one or more users. You can send private messages that will only be viewed by the other members of the chat room. This feature allows for a more personal and direct form of communication within the app. You can create a community or a small group of friends, or even establish a personal one-on-one chat room to connect with a specific user. The message page provides a platform for users to build relationships and engage with others within the app.

## Application Features
 - Creating posts: Users can upload pictures and add captions to create new posts. Users are required to attach at least one photo to the post. The photos can be customized with a crop tool and color filters.
 - Commenting: Users can leave comments on other users' posts. This feature allows users to engage with the content and start conversations.
 - Likes: Users can like other users' posts. This feature allows users to show appreciation for the content and support for the user who posted it.
 - Hashtags: Users can add hashtags to their posts, making it easier for others to discover content related to a specific topic. Hashtags also make it easier for users to find and follow content that interests them.
 - Location tagging: Users can tag their location when posting a picture or story. This feature allows users to share where they are and what they are doing, and also allows other users to discover content from a specific location.
 - Stories: Users can upload a picture, customize it with text, drawing or stickers, and it will be uploaded and available for viewing on the site for 24 hours. After 24 hours the story will be archived, but you can still attach it to your profile at your personal profile page, and it will be saved as a highlight to your profile.
 - User profiles: Users can personalize their profiles by adding a bio, a profile picture, and a cover photo. This feature allows users to express themselves and showcase their personal brand.
 - Search function: Users can search for other users, hashtags, and specific posts. This feature makes it easy for users to find and follow content and people that interest them.
 - Push notifications: Users will receive notifications when someone likes, comments or messages them. This feature keeps users engaged and informed about the activity on their posts.
 - Message page: As a social network Snapshot has a message page where you can chat with other users online, and create personal relationships.
 - Direct messaging: Users can send private messages to other users. This feature enables users to communicate with each other in a more intimate setting.
 - Responsive design: The site is optimized for all screen sizes and devices, allowing users to access and use the app on any device.
 - Dark mode: The dark mode feature on Snapshot allows users to switch to a darker color scheme on the app, reducing eye strain and making it easier to use in low-light environments. It also provides a sleek and modern aesthetic for users who prefer a darker theme.

 
## Technologies
- SQLite3
- Express
- Node.js
- Rest API
- Angular
- Sass
    
## Getting started:

* Clone the repository
* Run the following commands to run the backend:

    $ cd backend
    $ npm i
    $ npm run dev

* Run the following commands to run the frontend:

```
$ cd frontend
$ npm i
$ ng serve
```

## Deployment

In the `frontend` diretory, execute: `ng build`

Copy the `dist/build` directory to the backend's `public` diretory and push that to your production server.


## Showcase

### Home page
The landing page in which the user can view his and followers posts and stories.

![Homepage image](screenshots/home-page.png)

In Dark mode.
![Homepage image](screenshots/home-page-dark-mode.png)

### Story page
In the Story page, the user and watch and scroll through his and his followed users stories.

![Story page image](screenshots/story-page.png)

### Search modal
The Search modal, where you can search for users and hashtags from the data base.

![Search modal image](screenshots/search-modal.png)

### Explore page
The Explore page, where you can scroll through random posts from users you don't follow.

![Explore page image](screenshots/explore-page.png)

### Messages page
In the messages page, the user can create chat rooms with other users.

![Messages page image](screenshots/message-page.png)

### Notifications modal
The Notifications modal, is where all of the user push notifications are stored.

![Notifications modal image](screenshots/notification-modal.png)

### Create post modal
In the create post modal, the user can upload and customize his post.

![Create post modal image](screenshots/create-post-modal.png)

### Profile Page
The profile page contains the user created posts, post he saved for later views, followers and followed lists.

![Profile page image](screenshots/profile-page.png)

### Some mobile!
Just a taste of the mobile experience. We used different **mixins**, **conditional rendering**, and the **"mobile first"** approach. 

<img src="screenshots/mobile-home-page" width="25%" style="float: left"/><img src="screenshots/mobile-message-page.png" width="25%" style="float: left;"/><img src="screenshots/mobile-story-page.png" width="25%" style="float: left;"/><img src="screenshots/mobile-profile-edit.png" width="25%" style="float: left;"/>

### Author
 - [Eshel Eyni](https://github.com/EshelEyni)

 ### Contributors
 - [Tal Elmaliach Hemo](https://github.com/TalElmaliachHemo)
 - [Oren Eini](https://github.com/ayende)
