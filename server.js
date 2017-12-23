var http = require('http')
var Canvas = require('canvas')

var clock = require('./clock')
var generator = require('./index')
global.navigator = {
    userAgent: "node 8",
}

global.Worker = require('webworker-threads').Worker

global.window = global
// global.navigator = {
//     userAgent: 'node.js'
// };

var PORT = process.env.PORT || 4000
http.createServer(function (req, res) {
    var canvas = Canvas.createCanvas(320, 320)
    var ctx = canvas.getContext('2d')
    clock(ctx)
    r = generator().generateFromHash(new Uint8Array([154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
        154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,]).buffer
    )
    // console.log(r)
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(
        //'<meta http-equiv="refresh" content="1;" />' +
        '<img src="' + canvas.toDataURL() + '" />'
    )
}).listen(PORT, function () {
    console.log('Server started on port ',PORT);
})