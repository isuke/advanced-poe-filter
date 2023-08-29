import path from "path"

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default {
  entry: path.resolve(`${__dirname}/src/index.js`),
  output: {
    path: path.resolve(`${__dirname}/lib/`),
    filename: "advanced-poe-filter.umd.js",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
}
