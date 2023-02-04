const logger = require('../services/logger.service')
const authService = require('../api/auth/auth.service')
async function requireAuth(req, res, next) {
  let loginToken = req?.cookies?.loginToken;

  if (!loginToken) {
    logger.warn('Not Authenticated')
    return res.status(401).send('Not Authenticated')
  }
  const loggedinUser = await authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) {
    logger.warn('Bad auth token')
    return res.status(401).send('Bad auth token')
  }
  req.loggedinUser = loggedinUser
  next()
}

module.exports = {
  requireAuth,
} 