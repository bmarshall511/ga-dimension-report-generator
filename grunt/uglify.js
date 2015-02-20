var scripts = [
	'src/assets/js/typeahead.jquery.js',
	'src/assets/js/loading-bar.js',
	'src/assets/js/config.js',
	'src/assets/js/app.js'
];

module.exports = {
	dev: {
		options: {
    	beautify: true,
      mangle: false,
      compress: false
    },
    files: {
    	'dev/assets/js/app.js': scripts
    }
	},
	dist: {
		options: {
      mangle: false,
    },
    files: {
    	'dist/assets/js/app.js': scripts
    }
	}
};