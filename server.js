var http = require('http')
var fs = require('fs')
var Canvas = require('canvas')
var clock = require('./clock')
var generator = require('./index')
var app = require("express")()
var Utils = require('./Utils')
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
const gen = generator();
const modelConfig = gen.modelConfig;
const canvasWidth = modelConfig.gan.imageWidth;
const canvasHeight = modelConfig.gan.imageHeight;
app.get("/", async (req, res) => {
    var canvas = Canvas.createCanvas(canvasWidth, canvasWidth)
    var ctx = canvas.getContext('2d')

    try {
        const r = await gen.generateFromHash(hashdata)
        console.log("gen ok", r)
        WebDNN.Image.setImageArrayToCanvas(r, canvasWidth, canvasWidth, canvas, {
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
});

app.get('/base64=*/', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(
        'data:image/png;base64,' + req.params[0]
    )
});

app.get('/text=*/', async function(req, res) {
    var canvas = Canvas.createCanvas(canvasWidth, canvasWidth)
    var ctx = canvas.getContext('2d')
    var data = await Utils.getUint8ArrayFromText(req.params[0])
    try {
        var result = await gen.generateFromHash(data)
        // console.log("gen ok", result)
        WebDNN.Image.setImageArrayToCanvas(result, canvasWidth, canvasWidth, canvas, {
            scale: [127.5, 127.5, 127.5],
            bias: [127.5, 127.5, 127.5],
            color: WebDNN.Image.Color.BGR,
            order: WebDNN.Image.Order.CHW
        })
        console.log(canvas.toDataURL(), "\nsuccess")

    } catch (err) {
        console.log("gen error", err)
    }

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(
        '<img src="' + canvas.toDataURL() + '" />'
    )
});

app.get('/download/text=*/', async function(req, res) {
    var canvas = Canvas.createCanvas(canvasWidth, canvasWidth)
    var ctx = canvas.getContext('2d')
    var data = Utils.getUint8ArrayFromText(req.params[0])
    try {
        const result = await gen.generateFromHash(hashdata)
        console.log("gen ok", result)
        WebDNN.Image.setImageArrayToCanvas(result, canvasWidth, canvasWidth, canvas, {
            scale: [127.5, 127.5, 127.5],
            bias: [127.5, 127.5, 127.5],
            color: WebDNN.Image.Color.BGR,
            order: WebDNN.Image.Order.CHW
        })
        console.log(canvas.toDataURL(), "success")
    } catch (err) {
        console.log("gen error", err)
    }
    var imgData = canvas.toDataURL()
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("image.png", dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          res.send("保存成功！");
        }
    });
});

app.post('/upload', async function(req, res){
    //接收前台POST过来的base64
    var imgData = req.body.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("image.png", dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          res.send("保存成功！");
        }
    });
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
