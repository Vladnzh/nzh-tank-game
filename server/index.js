const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config')();


const host = process.env.NODE_APP_HOST || 'localhost';
const port = process.env.NODE_APP_PORT || 3003;
const dir = path.join(__dirname, '..');
const compiler = webpack(config);

const app = express();
app.use(express.static(dir));

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: { colors: true },
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
}));

app.use(webpackHotMiddleware(compiler, {
    log: console.log,
}));

app.listen(port, err => {
    if (err) {
        console.error(err);
    }
    console.info(`==> Open http://${host}:${port} in a browser to view the app.`);
});
