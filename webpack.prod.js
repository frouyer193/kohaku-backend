const merge = require('webpack-merge');
const common = require('./webpack.common');
const WebpackNodeServerPlugin = require('webpack-node-server-plugin')

module.exports = merge(common, {
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    typeCheck: true
                }
            }
        ]
    }
});