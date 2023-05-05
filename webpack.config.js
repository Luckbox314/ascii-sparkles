const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: "production",
  // plugins: [
  //   new CopyPlugin({
  //     patterns: [
  //       {from: 'public'}
  //     ]
  //   })
  // ],
};