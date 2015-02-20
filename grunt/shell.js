module.exports = {
    clean: {
      command: [
        'sudo rm -rf dev/*',
        'sudo rm -rf dist/*',
      ].join('&&')
    },
    push: {
    	command: [
        'git add --all',
        'git commit -m "Updates"',
        'git push origin master'
      ].join('&&')
    }
};