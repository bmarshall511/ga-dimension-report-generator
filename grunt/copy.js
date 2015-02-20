module.exports = {
    dev: {
      files: [
          {expand: true, cwd: 'src/lib/', src: ['**'], dest: 'dev/lib/'},
          {src: ['src/process.php'], dest: 'dev/process.php'},
          {src: ['src/googlecert.p12'], dest: 'dev/googlecert.p12'}
        ]
    },
    dist: {
      files: [
        {expand: true, cwd: 'src/lib/', src: ['**'], dest: 'dist/lib/'},
        {src: ['src/process.php'], dest: 'dist/process.php'},
        {src: ['src/googlecert.p12'], dest: 'dist/googlecert.p12'}
      ]
    }
};