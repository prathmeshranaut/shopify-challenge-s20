const sinon = require('sinon');
const expect = require('chai').expect;

const authMiddleware = require('../../middleware/auth');
const jwt = require('jsonwebtoken');


describe('Auth Middleware', () => {
    it('should throw an error when no authorization header is present', function () {
        const req = {
            get: function (name) {
                return null;
            }
        }

        expect(authMiddleware.bind(this, req, {}, () => {
        })).to.throw('Not authenticated.');
    });

    it('should throw an error if the authorization header is one string without bearer', function () {
        const req = {
            get: function (name) {
                return '123';
            }
        };

        expect(authMiddleware.bind(this, req, {}, () => {
        })).to.throw();
    });

    it('should throw an error if the token cannot be verified', function () {
        const req = {
            get: function (name) {
                return 'Bearer 123';
            }
        }

        expect(authMiddleware.bind(this, req, {}, () => {
        })).to.throw();

    });

    it('should yield a userId after decoding the token', function () {
        const req = {
            get: function (name) {
                return 'Bearer 123';
            }
        };

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 1 });

        authMiddleware(req, {}, () => {
        });

        expect(req).to.have.property('userId', 1);
        expect(jwt.verify.called).to.be.true;

        jwt.verify.restore();
    });
});