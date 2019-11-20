module.exports = {
  healthcheck: {
    get: async (req, res, next) => {
      return res.json({ status: 'UP' })
    }
  }
}
