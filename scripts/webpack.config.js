const path = require('path');

module.exports = {
  entry: './dist/literate_kotlin_post.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lkt.bundle.js'
  }
};