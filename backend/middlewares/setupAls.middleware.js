const authService = require('../api/auth/auth.service')
const asyncLocalStorage = require('../services/als.service')

async function setupAsyncLocalStorage(req, res, next) {
  const storage = {}
  asyncLocalStorage.run(storage, async () => {
    const alsStore = asyncLocalStorage.getStore()
    if (!req.cookies.loginToken) return await next()
    const loggedinUser = await authService.validateToken(req.cookies.loginToken)
    if (loggedinUser) {
      alsStore.loggedinUser = loggedinUser // we can now easily expose the current user in the log
    }
    await next()
  })
}

module.exports = setupAsyncLocalStorage