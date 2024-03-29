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
const followTagRoutes = require('./api/follow-tag/follow-tag.routes')
const loactionRoutes = require('./api/location/location.routes')
const notificationRoutes = require('./api/notification/notification.routes')
const storyRoutes = require('./api/story/story.routes')
const likeRoutes = require('./api/like/like.routes')
const followRoutes = require('./api/follow/follow.routes.js')
const searchRoutes = require('./api/search/search.routes')
const chatRoutes = require('./api/chat/chat.routes.js')
const messageRoutes = require('./api/message/message.routes.js')

const storyArchiveService = require('./services/story-archive.service.js')
const { setupSocketAPI } = require('./services/socket.service')

// Express App Config 
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))


const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

// cors
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:4200', 'http://localhost:4200'],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/tag', tagRoutes)
app.use('/api/follow-tag', followTagRoutes)
app.use('/api/location', loactionRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/story', storyRoutes)
app.use('/api/like', likeRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/save-post', savedPostRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
setupSocketAPI(http)


app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

setInterval(() => {
    storyArchiveService.setStoryArchive();
}, 1000 * 60 * 60 * 24);

const logger = require('./services/logger.service.js');

const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})