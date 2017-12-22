var fs = require('fs')
var path = require('path')
var Canvas = require('canvas')
var Config = require('./Config')
var Utils = require('./Utils')
var GAN = require('./GAN')
// var inflate = require('./modules/webdnn/inflate.min')
var WebDNN = require('./modules/webdnn/webdnn')

class Generator {
    constructor(gan, modelConfig) {
        this.state = {
            gan: {
                loadingProgress: 0,
                isReady: false,
                isRunning: false,
                isCanceled: false,
                isError: false
            },
            mode: 'normal',
        };
        this.ganDict = {};
        this.currentModel = Config.defaultModel;
        this.disableWebgl = false;
        this.gan = gan || GAN(Config.modelConfig[this.currentModel])
        this.modelConfig = modelConfig || this.getModelConfig()
        
    }

    getModelConfig() {
        return Config.modelConfig[this.currentModel];
    }

    setModel(modelName = this.currentModel, disableWebgl = this.disableWebgl) {
        return new Promise((resolve, reject) => {
            var keyName = modelName + (disableWebgl ? '_nowebgl' : '');

            if (!this.ganDict[keyName]) {
                var gan = GAN(Config.modelConfig[modelName]);
                var state = {
                    loadingProgress: 0,
                    isReady: false,
                    isRunning: false,
                    isCanceled: false,
                    isError: false
                };
                this.ganDict[keyName] = {
                    gan: gan,
                    state: state
                };
            }
            else {
                resolve();
            }
            this.gan = this.ganDict[keyName].gan;
        });
    }

    async init() {
        try {
            await this.setModel();
        }
        catch (err) {
            console.log(err);
        }
    }
    // 随机生成 配置数组
    // getOptionValuesFromRandom(originalOptionInputs) {
    //     var optionInputs = window.$.extend(true, {}, originalOptionInputs);
    //     this.getModelConfig().options.forEach(option => {
    //         var optionInput = optionInputs[option.key];

    //         if (!optionInput || optionInput.random) {
    //             optionInput = optionInputs[option.key] = { random: true };

    //             if (option.type === 'multiple') {
    //                 var value = Array.apply(null, { length: option.options.length }).fill(-1);
    //                 if (option.isIndependent) {
    //                     for (var j = 0; j < option.options.length; j++) {
    //                         value[j] = Math.random() < option.prob[j] ? 1 : -1;
    //                     }
    //                 }
    //                 else {
    //                     var random = Math.random();
    //                     for (j = 0; j < option.options.length; j++) {
    //                         if (random < option.prob[j]) {
    //                             value[j] = 1;
    //                             break;
    //                         }
    //                         else {
    //                             random -= option.prob[j];
    //                         }
    //                     }
    //                 }
    //                 optionInput.value = value;
    //             }
    //             else if (option.type === 'continuous') {
    //                 var min = option.samplingMin || option.min;
    //                 var max = option.samplingMax || option.max;
    //                 optionInput.value = Math.floor(Math.random() * ((max - min) / option.step + 1)) * option.step + min;
    //             }
    //             else {
    //                 optionInput.value = Math.random() < option.prob ? 1 : -1;
    //             }
    //         }
    //     });

    //     if (!optionInputs.noise || optionInputs.noise.random) {
    //         var value = [];
    //         optionInputs.noise = { random: true, value: value };
    //         Array.apply(null, { length: this.getModelConfig().gan.noiseLength }).map(() => Utils.randomNormal((u, v) => value.push([u, v])));
    //         console.log(optionInputs.noise);
    //     }

    //     return optionInputs;
    // }
    // 根据 hash 生成 配置数组
    getOptionValuesFromHash(originalOptionInputs, hash) {
        var optionInputs = originalOptionInputs;
        var rate = 0;
        this.getModelConfig().options.forEach(option => {
            var optionInput = optionInputs[option.key];
            optionInput = optionInputs[option.key] = { random: false };

            if (option.type === 'multiple') {
                var value = Array.apply(null, { length: option.options.length }).fill(-1);
                if (option.isIndependent) {
                    for (var j = 0; j < option.options.length; j++) {
                        rate = this.getRate(hash, option.key, option.options.length);
                        value[j] = rate < option.prob[j] ? 1 : -1;
                    }
                }
                else {
                    rate = this.getRate(hash, option.key, option.options.length);
                    for (j = 0; j < option.options.length; j++) {
                        if (rate < option.prob[j]) {
                            value[j] = 1;
                            break;
                        }
                        else {
                            rate -= option.prob[j];
                        }
                    }
                }
                optionInput.value = value;
            }
            else if (option.type === 'continuous') {
                var min = option.samplingMin || option.min;
                var max = option.samplingMax || option.max;
                rate = this.getRate(hash, option.key, 1);
                optionInput.value = Math.floor(rate * ((max - min) / option.step + 1)) * option.step + min;
            }
            else {
                rate = this.getRate(hash, option.key, 1);
                optionInput.value = rate < option.prob ? 1 : -1;
            }

        });

        var value = [];
        optionInputs.noise = { random: false, value: value };
        Array.apply(null, { length: this.getModelConfig().gan.noiseLength })
            .map((currentValue, index, arr) => this.hashNormal((u, v) => value.push([u, v]), hash, index));

        return optionInputs;
    }

    getLabel(optionInputs) {
        var label = Array.apply(null, { length: this.getModelConfig().gan.labelLength });
        console.log("label", label);
        this.getModelConfig().options.forEach(option => {
            var optionInput = optionInputs[option.key];

            if (option.type === 'multiple') {
                optionInput.value.forEach((value, index) => {
                    label[option.offset + index] = value;
                });
            }
            else {
                label[option.offset] = optionInput.value;
            }
        });
        return label;
    }

    getNoise(optionInputs) {
        var noise = optionInputs.noise.value.map(([u, v]) => Utils.uniformToNormal(u, v));
        return noise;
    }

    /**
     * 将hash转成“数”
     * @param hash 是一个 ArrayBuffer，会转成 Uint8Array, Uint8Array 长度 >= 267(=11+128+128), 每位数在[0, 255]之间
     * @param option_key 配置项
     * @param index 在hash上配置项对应的位置，一个位置产生一个[0,1)的浮点数，作为“随机数”
     * 
     * @return 配置项在hash上对应位置产生的[0,1)的浮点数，作为“随机数”
     */
    getRate(hash, option_key, index) {
        var hashUint8Arr = new Uint8Array(hash);
        switch (option_key) {
            case "hair_color":
                return 1 - hashUint8Arr[0] / 256;
            case "eye_color":
                return 1 - hashUint8Arr[1] / 256;
            case "hair_style":
                return 1 - hashUint8Arr[2] / 256;
            case "dark_skin":
                return 1 - hashUint8Arr[3] / 256;
            case "blush":
                return 1 - hashUint8Arr[4] / 256;
            case "smile":
                return 1 - hashUint8Arr[5] / 256;
            case "open_mouth":
                return 1 - hashUint8Arr[6] / 256;
            case "hat":
                return 1 - hashUint8Arr[7] / 256;
            case "ribbon":
                return 1 - hashUint8Arr[8] / 256;
            case "glasses":
                return 1 - hashUint8Arr[9] / 256;
            case "year":
                return 1 - hashUint8Arr[10] / 256;
            case "noise":
                return 1 - hashUint8Arr[11 + index] / 256;
            default:
                break;
        }
        return NaN;
    }
    /**
     * 把两个[0, 1)浮点数转成一个浮点数
     * @param {*} ref 函数ref(u, v);
     * @param {*} hash ArrayBuffer，会转成 Uint8Array
     * @param {*} index 配置项在hash上对应的位置
     */
    hashNormal(ref, hash, index) {
        var u = 1 - this.getRate(hash, 'noise', index);
        var v = 1 - this.getRate(hash, 'noise', index + this.getModelConfig().gan.noiseLength);
        if (typeof ref === 'function') {
            ref(u, v);
        }
        return Utils.uniformToNormal(u, v);
    }

    /**
     * 根据hash生成图象
     * @param hash 是 ArrayBuffer
     * label:
     *     [1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1]
     *     0-34:-1 or 1, 35:0~1, length:36
     * noise:
     *     0-127:-3~3(根据utils 的 norm)
     * @return result float32Array，可转成图象
     */
    async generateFromHash(hash) {
        // if (this.gan.getBackendName() === 'webgl') {
        //     await Utils.promiseTimeout(100, true); // XXX: wait for components to refresh
        // }

        var optionInputs = this.getOptionValuesFromHash(this.getModelConfig(), hash);
        var label = this.getLabel(optionInputs);
        var noise = this.getNoise(optionInputs);
        
        var result = await this.gan.run(label, noise); 

        console.log("label", label);
        console.log("noise", noise);
        console.log("result", result);
        return result;
    }

}

function generator(GAN, modelConfig) {
    return new Generator(GAN, modelConfig)
}

module.exports = generator










/*
function getModelConfig() {
    Config.modelConfig[Config.currentModel];
}

// 输入的hash是一个ArrayBuffer
function getRate(hash, option_key, index) {
    var hashUint8Arr = new Uint8Array(hash);
    switch (option_key) {
        case "hair_color":
            return 1 - hashUint8Arr[0] / 256;
        case "eye_color":
            return 1 - hashUint8Arr[1] / 256;
        case "hair_style":
            return 1 - hashUint8Arr[2] / 256;
        case "dark_skin":
            return 1 - hashUint8Arr[3] / 256;
        case "blush":
            return 1 - hashUint8Arr[4] / 256;
        case "smile":
            return 1 - hashUint8Arr[5] / 256;
        case "open_mouth":
            return 1 - hashUint8Arr[6] / 256;
        case "hat":
            return 1 - hashUint8Arr[7] / 256;
        case "ribbon":
            return 1 - hashUint8Arr[8] / 256;
        case "glasses":
            return 1 - hashUint8Arr[9] / 256;
        case "year":
            return 1 - hashUint8Arr[10] / 256;
        case "noise":
            return 1 - hashUint8Arr[11 + index] / 256;
        default:
            break;
    }
    return NaN;
}

function hashNormal(ref, hash, index) {
    var u = 1 - getRate(hash, 'noise', index);
    var v = 1 - getRate(hash, 'noise', index + getModelConfig().gan.noiseLength);
    if (typeof ref === 'function') {
        ref(u, v);
    }
    return Utils.uniformToNormal(u, v);
}

function getOptionValuesFromHash(originalOptionInputs, hash) {
    var optionInputs = window.$.extend(true, {}, originalOptionInputs);
    var rate = 0;
    getModelConfig().options.forEach(option => {
        var optionInput = optionInputs[option.key];
        optionInput = optionInputs[option.key] = { random: false };

        if (option.type === 'multiple') {
            var value = Array.apply(null, { length: option.options.length }).fill(-1);
            if (option.isIndependent) {
                for (var j = 0; j < option.options.length; j++) {
                    rate = getRate(hash, option.key, option.options.length);
                    value[j] = rate < option.prob[j] ? 1 : -1;
                }
            }
            else {
                rate = getRate(hash, option.key, option.options.length);
                for (j = 0; j < option.options.length; j++) {
                    if (rate < option.prob[j]) {
                        value[j] = 1;
                        break;
                    }
                    else {
                        rate -= option.prob[j];
                    }
                }
            }
            optionInput.value = value;
        }
        else if (option.type === 'continuous') {
            var min = option.samplingMin || option.min;
            var max = option.samplingMax || option.max;
            rate = getRate(hash, option.key, 1);
            optionInput.value = Math.floor(rate * ((max - min) / option.step + 1)) * option.step + min;
        }
        else {
            rate = getRate(hash, option.key, 1);
            optionInput.value = rate < option.prob ? 1 : -1;
        }

    });

    var value = [];
    optionInputs.noise = { random: false, value: value };
    Array.apply(null, { length: getModelConfig().gan.noiseLength })
        .map((currentValue, index, arr) => hashNormal((u, v) => value.push([u, v]), hash, index));

    return optionInputs;
}
function getLabel(optionInputs) {
    var label = Array.apply(null, { length: getModelConfig().gan.labelLength });
    getModelConfig().options.forEach(option => {
        var optionInput = optionInputs[option.key];

        if (option.type === 'multiple') {
            optionInput.value.forEach((value, index) => {
                label[option.offset + index] = value;
            });
        }
        else {
            label[option.offset] = optionInput.value;
        }
    });
    return label;
}

function getNoise(optionInputs) {
    var noise = optionInputs.noise.value.map(([u, v]) => Utils.uniformToNormal(u, v));
    return noise;
}

function generateFromHash(hash) {
    var optionInputs = getOptionValuesFromHash(getModelConfig().options, hash);
    var label = getLabel(optionInputs);
    var noise = getNoise(optionInputs);
    console.log(label);
    console.log(noise);
    var result = await gan.run(label, noise);
    console.log(result);
}*/