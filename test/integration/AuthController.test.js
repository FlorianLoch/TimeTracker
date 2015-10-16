var request = require('supertest');

describe('AuthController', function() {

  describe("signup()", function () {
    it("shall create a new user account", function (done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send({
          email: "me@example.com",
          firstName: "Karl",
          lastName: "Napp",
          password: "1234"
        })
        .expect(201, done);
    });

    it("shall NOT create a new user account when information is missing", function (done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send({
          email: "me2@example.com",
          firstName: "Karl",
          password: "1234"
        })
        .expect(400, done);
    });
  });

});
