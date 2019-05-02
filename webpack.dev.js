const merge = require('webpack-merge');
const common = require('./webpack.common');
const WebpackNodeServerPlugin = require('webpack-node-server-plugin')

module.exports = merge(common, {
    devtool: 'inline-source-map',
    watch: true,
    plugins: [
        // ### uncomment if you don't want to use nodemon ###
        new WebpackNodeServerPlugin()
    ]
});