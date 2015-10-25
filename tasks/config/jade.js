module.exports = function(grunt) {
    grunt.config.set('jade', {
      dev: {
        options: {
          pretty: false
        },
        files: [ {
          cwd: "assets/",
          src: "**/*.jade",
          dest: ".tmp/public/",
          expand: true,
          ext: ".html"
        } ]
      }
    });

    grunt.loadNpmTasks('grunt-contrib-jade');
};
