module.exports = {
	dev: {
	  options: {
	    removeComments: false,
	    collapseWhitespace: false
	  },
	  files: {
	      'dev/index.html': 'src/index.html'
	  }
	},
	dist: {
	  options: {
	      removeComments: true,
	      collapseWhitespace: true
	  },
	  files: {
	  	'dist/index.html': 'src/index.html'
	  }
	}
};