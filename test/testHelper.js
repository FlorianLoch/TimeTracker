module.exports = {
  createSampleUser: function (userId, cb) {
    User.findOrCreate({
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "test123",
      id: userId
    }).exec(cb);
  }
}
