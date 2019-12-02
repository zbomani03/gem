const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/server.ts',
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  mode: 'development',
  plugins: [
    new webpack.EnvironmentPlugin(['WAREHOUSE_API_URL', 'AGSTUDIO_API_URL'])
  ],
  name: 'server',
  resolveLoader: {
    modules: ['./node_modules']
  },
  resolve: {
    modules: ['./node_modules'],
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build')
  },
  target: "node",
  node: {
    __dirname: false
  }
};
