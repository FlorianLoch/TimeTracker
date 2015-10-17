module.exports = {
  createSampleUser: function (userId, cb) {
    User.create({
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "test123",
      id: userId
    }).exec(cb);
  }
}
