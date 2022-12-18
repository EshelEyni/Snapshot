const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const http = require('http').createServer(app)

const userRoutes = require('./api/user/user.routes')
const postRoutes = require('./api/post/post.routes')
const savedPostRoutes = require('./api/savedPost/savedPost.routes.js')
const authRoutes = require('./api/auth/auth.routes')
const commentRoutes = require('./api/comment/comment.routes')
const tagRoutes = require('./api/tag/tag.routes.js')
const loactionRoutes = require('./api/location/location.routes')
const notificationRoutes = require('./api/notification/notification.routes')
const storyRoutes = require('./api/story/story.routes')
const likeRoutes = require('./api/like/like.routes')
const followerRoutes = require('./api/followers/followers.routes')
const followingRoutes = require('./api/following/following.routes')

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

// cors
if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:4200', 'http://localhost:4200'],
        credentials: true
    }
    app.use(cors(corsOptions))
}


app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/tag', tagRoutes)
app.use('/api/location', loactionRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/story', storyRoutes)
app.use('/api/like', likeRoutes)
app.use('/api/followers', followerRoutes)
app.use('/api/following', followingRoutes)
app.use('/api/save-post', savedPostRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service.js');
// const { fstat } = require('fs');
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})