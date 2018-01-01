var http = require('http')
var Canvas = require('canvas')
var clock = require('./clock')
var generator = require('./index')
var app = require("express")()
var WebDNN = require('./webdnn/src/descriptor_runner/lib/webdnn')

var PORT = process.env.PORT || 4000

const hashdata = new Uint8Array([
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
    154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
    154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169
]) //length is 267  [0, 255)

app.get("/", async (req, res) => {
    var canvas = Canvas.createCanvas(128, 128)
    var ctx = canvas.getContext('2d')

    try {
        const r = await generator().generateFromHash(hashdata)
        console.log("gen ok", r)
        WebDNN.Image.setImageArrayToCanvas(r, 128, 128, canvas, {
            scale: [127.5, 127.5, 127.5],
            bias: [127.5, 127.5, 127.5],
            color: WebDNN.Image.Color.BGR,
            order: WebDNN.Image.Order.CHW
        })
        console.log(canvas.toDataURL(), "success")
    } catch (err) {
        console.log("gen error", err)
    }

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(
        '<img src="' + canvas.toDataURL() + '" />'
    )
})


app.get('/base64=*/', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(
        'data:image/png;base64,' + req.params[0]
    )
});

app.get('/text=*/', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(
        'data:image/png;base64,' + req.params[0]
    )
});

app.listen(PORT)

// http.createServer(function (req, res) {
//     console.log(req.url)


    // clock(ctx)

    // try {
    //     const r = generator().generateFromHash(hashdata).buffer
    // } catch (err) {
    //     console.log("gen error", err)
    // }

    // console.log(r)
    // res.writeHead(200, { 'Content-Type': 'text/html' })
    // res.end("bye")
    // res.end(
    //     //'<meta http-equiv="refresh" content="1;" />' +
    //     '<img src="' + canvas.toDataURL() + '" />'
    // )


// }).listen(PORT)

console.log('Server started on port ',PORT);
