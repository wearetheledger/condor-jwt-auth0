const JWTauth0 = require('./lib/jwt-auth0');

exports = module.exports = (options) => {
  return new JWTauth0(options).getMiddleware();
};

exports.JWTauth0 = JWTauth0;
