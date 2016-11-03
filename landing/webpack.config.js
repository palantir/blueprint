var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const SRC  = path.resolve("./src");
const DEST = path.resolve("./dist");
const NAME = "blueprint-landing.js";

module.exports = {
  entry: [
    `${SRC}/index.tsx`,
  ],

  output: {
    path: DEST,
    filename: NAME,
  },

  resolve: {
    extensions: ["", ".js", ".ts", ".tsx"],
  },

  ts: {
    compilerOptions: { declaration: false },
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        include: SRC,
      }, {
        test: /\.s[ac]ss$/,
        loader: ExtractTextPlugin.extract("style", "css!postcss!sass"),
        include: SRC,
      }, {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file?name=fonts/[name].[ext]',
      }, {
        test: /resources\/img\/.*\.(svg|png)$/,
        loader: 'file?name=fonts/[name].[ext]',
      }, {
        test: /\.json$/,
        loader: 'json'
      }
    ],
  },

  plugins: [
    new ExtractTextPlugin(NAME.replace(/\.js$/, ".css")),
  ]
};
