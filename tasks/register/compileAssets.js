module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'less:dev',
		'sass:dev',
		'copy:dev',
		'jade:dev',
		'coffee:dev'
	]);
};
