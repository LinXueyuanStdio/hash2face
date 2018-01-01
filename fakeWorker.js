
class Worker {
  constructor(file) {
    const {
      emitter,
      postMessage,
      onmessage,
      run,
    } = require(file)

    emitter.on("message", (data) => {
      this.onmessage && this.onmessage({data})
    })

    this.workerOnMessage = onmessage

    // setImmediate(run)
    setTimeout(run, 1000)
  }

  postMessage(data) {
    this.workerOnMessage({
      data,
    })
  }
}

// const worker = new Worker("/Users/howard/src/hash2face/models/Bouvardia128_8bit/kernels_webassembly.js")
// worker.onmessage = (event) => {
//   console.log(event)
// }

module.exports = {
  Worker
}

// console.log("emitter", worker)
