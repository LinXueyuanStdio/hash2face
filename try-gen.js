global.navigator = {
  userAgent: "nodejs",
}

global.Worker = require('./fakeWorker').Worker

global.window = global

var generator = require('./index')

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
  154, 152, 251, 47, 13, 59, 4, 25, 89, 250, 140, 169, 120, 34, 240, 210, 147,
])

var WebDNN = require('./webdnn/src/descriptor_runner/lib/webdnn')

var Config = require('./Config')

var Canvas = require('canvas')

async function main() {
  console.log(WebDNN.Image)
  const gen = generator()

  console.log(gen.currentModel)
  console.log(gen.modelConfig)

  const modelConfig = gen.modelConfig

  const result = await gen.generateFromHash(hashdata)

  const canvasWidth = modelConfig.gan.imageWidth;
  const canvasHeight = modelConfig.gan.imageHeight;

  const canvas = Canvas.createCanvas(canvasHeight, canvasWidth)

  // const result = data.buffer

  WebDNN.Image.setImageArrayToCanvas(result, canvasWidth, canvasHeight, canvas, {
      scale: [127.5, 127.5, 127.5],
      bias: [127.5, 127.5, 127.5],
      color: WebDNN.Image.Color.BGR,
      order: WebDNN.Image.Order.CHW
  })

  console.log(canvas.toDataURL())

  // console.log("result", r.buffer)
}

main().catch((err) => {
  console.log("err", err)
})
