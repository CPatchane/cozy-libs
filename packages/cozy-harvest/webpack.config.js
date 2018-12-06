var path = require('path')

module.exports = {
  resolve: {
    extensions: ['.jsx', '.js', '.json', '.css'],
    // linked package will still be see as a node_modules package
    symlinks: false
  },
  entry: path.resolve(__dirname, './src/index.jsx'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['cozy-app']
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
}
