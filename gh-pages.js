const ghpages = require('gh-pages');

ghpages.publish('build', {
  branch: 'gh-pages',
  repo: 'https://github.com/De-Light-n/podoroj.git',
  dotfiles: true
}, (err) => {
  if (err) console.error(err);
  else console.log('Deployed to GitHub Pages!');
});