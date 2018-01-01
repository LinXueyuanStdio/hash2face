var Config = require('./Config')
var Utils = require('./Utils')
// var WebDNN = require('./modules/webdnn/webdnn')

global.navigator = {
    userAgent: "nodejs",
}

global.Worker = require('./fakeWorker').Worker

global.window = global


var WebDNN = require('./webdnn/src/descriptor_runner/lib/webdnn')

class GAN {

    constructor(modelConfig, options) {
        this.runner = null;
        this.currentNoise = null;
        this.input = null;
        this.modelConfig = modelConfig;
        this.options = options || {};
    }

    async getWeightFilePrefix() {
        var country = await Utils.getCountry();

        var servers = this.modelConfig.gan.modelServers.filter(server => server.country === country);
        if (servers.length === 0) {
            servers = this.modelConfig.gan.modelServers.filter(server => !server.country);
        }

        var index = Math.floor(Math.random() * servers.length);
        var modelPath = Config.modelCompression ? this.modelConfig.gan.model + '_8bit' : this.modelConfig.gan.model;
        return 'http://' + (servers[index].host || servers[index]) + modelPath;
    }

    getBackendOrder() {
        // let order = ['webgpu', 'webassembly'];
        // // let state = store.getState();
        // // if (!state.generatorConfig.webglDisabled) {
        // //     order.splice(1, 0, 'webgl')
        // // }

        // return order[1];
        return "webassembly";
    }

    static getWebglTextureSize() {
        try {
            let gl = document.createElement('canvas').getContext('webgl');
            return gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }
        catch (err) {
            return null;
        }
    }

    async init(onInitProgress) {
        var modelPath = Config.modelCompression ? this.modelConfig.gan.model + '_8bit' : this.modelConfig.gan.model;
        this.runner = await WebDNN.load(modelPath, {
            progressCallback: onInitProgress,
            weightDirectory: "./models", // await this.getWeightFilePrefix(),
            backendOrder: this.getBackendOrder()
        });
    }

    async run(label, noise) {
        await this.init();
        this.currentNoise = noise || Array.apply(null, { length: this.modelConfig.gan.noiseLength }).map(() => Utils.randomNormal());
        let input = this.currentNoise.concat(label);
        this.currentInput = input;
        this.runner.getInputViews()[0].set(input);
        await this.runner.run();
        let output = this.runner.getOutputViews()[0].toActual().slice();
        return output;
    }

    getBackendName() {
        return this.runner.backendName;
    }

    getCurrentNoise() {
        return this.currentNoise;
    }

    getCurrentInput() {
        return this.currentInput;
    }
}

function gan(modelConfig, options) {
    return new GAN(modelConfig, options);
}

module.exports = gan;
