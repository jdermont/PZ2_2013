var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    less = require('less-middleware');

app.configure(function() {
    app.set('port', process.env.PORT || 16500);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(less({
        src: __dirname + '/public',
        compress: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));
});
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log("Server listen on port " + app.get('port'));
});

var gameServer = require('./lib/server');
gameServer.listen(server);
