const jws = require('jws');
const JWT = require('condor-jwt').JWT;
const jwksClient = require('jwks-rsa');

const errors = {
  'PARAMETERS_REQUIRED': 'options.jwksUri is required',
  'ERROR_REQUESTING_KEYS': 'Error requesting public keys',
  'ERROR_INTROSPECTING_TOKEN': 'Error introspecting token'
};

class JWTKeycloak extends JWT {
  constructor(options) {
    if (!options || !options.jwksUri) {
      throw new Error(errors.PARAMETERS_REQUIRED);
    }
    const defaultOptions = { 'minTimeBetweenJwksRequests': 10000 };
    const opt = Object.assign({}, defaultOptions, options);
    super(opt);
    this.publicKeys = {};
    this.jwksClient = jwksClient({
      cache: true,
      cacheMaxEntries: 5, // Default value
      cacheMaxAge: 120000, // Default value
      jwksUri: options.jwksUri
    });
  }

  getToken(context) {
    const tokenString = this._getTokenString(context);
    const decoded = jws.decode(tokenString);
    if (!decoded || !decoded.payload || !decoded.payload.iss) {
      return null;
    }
    return this._getPublicKey(decoded.header.kid)
      .then((publicKey) => {
        if (!publicKey) {
          return null;
        }
        this.options.secretOrPublicKey = publicKey;
        return super.getToken(context);
      });
  }

  _getPublicKey(kid) {

    if (this.publicKeys[kid]) {
      return this.publicKeys[kid];
    }

    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(kid, (err, key) => {
        if (err) {
          console.error(errors.ERROR_REQUESTING_KEYS, e);
          reject(null);
        }

        resolve(key.publicKey || key.rsaPublicKey);

      });
    });
  }

  _getTokenString(context) {
    const tokenString = context.metadata.get('authorization')[0];
    if (!tokenString) {
      return null;
    }
    return tokenString.replace('Bearer ', '');
  }
}

module.exports = JWTKeycloak;
