module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: /src/
            },
            {
                test: /\.(css)$/,
                loader: 'raw-loader',
                include: /src/
            }
        ]
    },
    devtool: false
};