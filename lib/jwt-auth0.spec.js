const nock = require('nock');
const TokenHelper = require('simple-bearer-token-test-helper');
const ContextHelper = require('condor-context-test-helper');
const JWT = require('condor-jwt').JWT;
const JWTAuth0 = require('./jwt-auth0');

describe('JwtAuth0', () => {
  let jwyAuth0, tokenHelper, contextHelper, options, scope, baseUrl,
    jwksUri, realm, realmPath, certs, iss, certsPath, introspectPath;

  beforeEach(() => {
    baseUrl = 'http://localhost:8080';
    jwksUri = `${baseUrl}/auth`;
    realm = 'demo';
    realmPath = `auth/realms/${realm}`;
    options = { jwksUri, realm, 'minTimeBetweenJwksRequests': 0 };
    tokenHelper = new TokenHelper();
    iss = `${jwksUri}/realms/${realm}`;
    tokenHelper.setupValidToken({ 'payload': { iss } });
    certs = { 'keys': [tokenHelper.jwk] };
    contextHelper = new ContextHelper();
    contextHelper.setupValidContext(tokenHelper.tokenString);
    certsPath = `/${realmPath}/protocol/openid-connect/certs`;
    introspectPath = `/${realmPath}/protocol/openid-connect/token/introspect`;
  });

  it('must extend JWT class', () => {
    jwyAuth0 = new JWTAuth0(options);
    expect(jwyAuth0 instanceof JWT).toBeTruthy();
  });

  describe('constructor()', () => {
    describe('no options', () => {
      it('must fail with error', () => {
        expect(() => {
          jwyAuth0 = new JWTAuth0();
        }).toThrowError('options.jwksUri is required');
      });
    });

    describe('options.jwksUri is required', () => {
      beforeEach(() => {
        delete options.jwksUri;
      });
      it('must fail with error', () => {
        expect(() => {
          jwyAuth0 = new JWTAuth0(options);
        }).toThrowError('options.jwksUri is required');
      });
    });
  });

  describe('getToken()', () => {
    beforeEach(() => {
      nock.cleanAll();
      scope = nock(baseUrl).get(certsPath).reply(200, certs);
    });

  });

});
