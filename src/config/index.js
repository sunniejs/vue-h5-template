//根据环境引入不同配置 process.env.NODE_ENV
const environment = process.env.NODE_ENV || 'development'
const config = require('./env.' + environment)
module.exports = config
