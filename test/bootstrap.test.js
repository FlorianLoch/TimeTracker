var sails;

before(function(done) {
  sails = new (require('sails').Sails)();

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  sails.lift({
    //connection: "testMemoryDb"
  }, function(err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
