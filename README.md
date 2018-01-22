# condor-jwt-auth0

This module lets you authenticate GRPC calls using JSON Web Tokens (**JWTs**) created by [Auth0](http://www.auth0.com/) in your [Condor](https://github.com/devsu/condor-framework) GRPC services.

**Condor** is a [GRPC Framework for node](https://github.com/devsu/condor-framework).

## Features

This module extends [condor-jwt](https://github.com/devsu/condor-jwt) and offers additional features for integration with keycloak:

- Handles public key rotation retrieval
- Allows live token validation (using introspection)
- Multi-tenancy support, by allowing multiple realms


## How to use

The JWT middleware decodes and verifies a JsonWebToken passed in the `authorization` header. If the token is valid, `context.token` will be set with the JSON object decoded to be used by later middleware for authorization and access control. (See [condor-authorize](https://github.com/devsu/condor-authorize))

```js
const Condor = require('condor-framework');
const jwt = require('condor-jwt-auth0');
const Greeter = require('./greeter');

const options = {
  'jwksUri': 'https://sandrino.auth0.com/.well-known/jwks.json',
};

const app = new Condor()
  .addService('./protos/greeter.proto', 'myapp.Greeter', new Greeter())
  .use(jwt(options))
  // middleware below this line is only reached if JWT token is valid
  .use((context, next) => {
    console.log('valid token found: ', context.token);
    next();
  })
  .start();
```

## Options

Allows all the options of the [condor-jwt](https://github.com/devsu/condor-jwt) module. And also:

| Option                     | Description                                                                               | Default |
|----------------------------|-------------------------------------------------------------------------------------------|---------|
| jwksUri                        | The authorization server jwksUri. E.g. `https://sandrino.auth0.com/.well-known/jwks.json`. Required.                |         |

Additionaly, you can send any option of the [verify](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) method of the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken). Such options will be used to verify the token.




