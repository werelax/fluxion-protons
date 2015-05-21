var path = require('path');

module.exports = {
  name: 'development',
  // entry: ['webpack/hot/dev-server', './src/app.js'],  // for dev. server
  entry: './src/app.js',                              // for deployment
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  plugins: [],
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'}
    ]
  }
};
