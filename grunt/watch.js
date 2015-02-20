module.exports = {
	gruntfile: {
	  files: ['Gruntfile.js'],
	  tasks: ['jshint:gruntfile']
	},
	js: {
	  files: ['src/assets/js/**/*.js'],
	  tasks: ['jshint:src', 'uglify:dev']
	},
	css: {
	  files: ['src/assets/scss/**/*.scss'],
	  tasks: ['compass:dev']
	},
	html: {
	  files: ['src/index.html'],
	  tasks: ['htmlmin:dev']
	},
	php: {
	  files: ['src/process.php'],
	  tasks: ['copy:dev']
	}
};