const logger = require('../services/logger.service')

async function requireAuth(req, res, next) {
  if (!req?.cookies?.loginToken) {
    logger.warn('Not Authenticated')
    return res.status(401).send('Not Authenticated')
  }
  next()
}

module.exports = {
  requireAuth,
}