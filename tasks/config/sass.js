module.exports = function(grunt) {
    grunt.config.set('sass', {
      dev: {
        files: [{
          expand: true,
          cwd: 'assets/webapp/styles/',
          src: ['importer.scss'],
          dest: '.tmp/public/webapp/styles/',
          ext: '.css'
        }]
      }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
};
