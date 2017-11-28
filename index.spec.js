const proxyquire = require('proxyquire');
const Spy = require('jasmine-spy');
const index = require('./index');
const JWTauth0 = require('./lib/jwt-auth0');

describe('module', () => {
  it('should expose JWTauth0() method', () => {
    expect(index).toEqual(jasmine.any(Function));
  });

  it('should expose the JWT class', () => {
    expect(index.JWTauth0).toEqual(JWTauth0);
  });

  describe('jwtauth0()', () => {
    let fakeIndex, JWTauth0Stub, options, middleware, constructorCount;
    beforeEach(() => {
      constructorCount = 0;
      options = { 'foo': 'bar' };
      JWTauth0Stub = class {
        constructor(opt) {
          expect(opt).toEqual(options);
          constructorCount++;
        }
      };
      middleware = Spy.resolve();
      JWTauth0Stub.prototype.getMiddleware = Spy.returnValue(middleware);
      fakeIndex = proxyquire('./index', { './lib/jwt-auth0': JWTauth0Stub });
    });

    it('should create JWT instance with the options and return its middleware', () => {
      const actualMiddleware = fakeIndex(options);
      expect(constructorCount).toEqual(1);
      expect(actualMiddleware).toEqual(middleware);
    });
  });
});
