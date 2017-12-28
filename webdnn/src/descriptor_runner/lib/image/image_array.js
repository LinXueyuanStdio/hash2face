"use strict";
/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("./canvas");
const enums_1 = require("./enums");
const image_data_1 = require("./image_data");
const image_source_1 = require("./image_source");
/**
 * @protected
 */
function flatten(arr) {
    return (arr instanceof Array) ? Array.prototype.concat.apply([], arr.map(arr => flatten(arr))) : arr;
}
/**
 * @protected
 */
function normalizeBiasTuple(arr) {
    if (typeof (arr) == "number") {
        return [arr, arr, arr];
    }
    else {
        if (arr.length == 3) {
            return [arr[0], arr[1], arr[2]];
        }
        else if (arr.length == 1) {
            return [arr[0], arr[0], arr[0]];
        }
        else {
            throw new Error('bias and scale must be scalar number or array of length 1 or 3.');
        }
    }
}
/**
 * Get image array as `{Float32 or Int32}ArrayBufferView` from ImageData object.
 *
 * @returns {ArrayBufferView} buffer with specified type
 * @protected
 */
function getImageArrayFromImageData(imageData, options = {}) {
    let { type = Float32Array, color = enums_1.Color.RGB, order = enums_1.Order.HWC, bias = [0, 0, 0], scale = [1, 1, 1] } = options;
    const bias_n = normalizeBiasTuple(bias);
    const scale_n = normalizeBiasTuple(scale);
    const width = imageData.width;
    const height = imageData.height;
    let data = imageData.data;
    let array;
    let biasR, biasG, biasB;
    let scaleR, scaleG, scaleB;
    switch (color) {
        case enums_1.Color.RGB:
            array = new type(width * height * 3);
            [scaleR, scaleG, scaleB] = scale_n;
            [biasR, biasG, biasB] = bias_n;
            switch (order) {
                case enums_1.Order.HWC:
                    for (let h = 0; h < height; h++) {
                        for (let w = 0; w < width; w++) {
                            array[(h * width + w) * 3 + 0] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(h * width + w) * 3 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 3 + 2] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (let h = 0; h < height; h++) {
                        for (let w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.BGR:
            array = new type(width * height * 3);
            [biasB, biasG, biasR] = bias_n;
            [scaleB, scaleG, scaleR] = scale_n;
            switch (order) {
                case enums_1.Order.HWC:
                    for (let h = 0; h < height; h++) {
                        for (let w = 0; w < width; w++) {
                            array[(h * width + w) * 3 + 0] = (data[(h * width + w) * 4 + 2] - biasR) / scaleR;
                            array[(h * width + w) * 3 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 3 + 2] = (data[(h * width + w) * 4 + 0] - biasB) / scaleB;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (let h = 0; h < height; h++) {
                        for (let w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasR) / scaleR;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasB) / scaleB;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.GREY:
            array = new type(width * height);
            [scaleR, scaleG, scaleB] = scale_n;
            [biasR, biasG, biasB] = bias_n;
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    let r = data[(h * width + w) * 4 + 0];
                    let g = data[(h * width + w) * 4 + 1];
                    let b = data[(h * width + w) * 4 + 2];
                    array[h * width + w] = 0.2126 * (r - biasR) / scaleR + 0.7162 * (g - biasG) / scaleG + 0.0722 * (b - biasB) / scaleB;
                }
            }
            break;
        default:
            throw Error(`Unknown color format: ${color}`);
    }
    return array;
}
exports.getImageArrayFromImageData = getImageArrayFromImageData;
/**
 * Get image array from canvas element as `{Float32 or Int32}ArrayBufferView`.
 *
 * @returns {ImageData} buffer with specified type
 * @protected
 */
function getImageArrayFromCanvas(canvas, options = {}) {
    let { type = Float32Array, color = enums_1.Color.RGB, order = enums_1.Order.HWC, srcX = 0, srcY = 0, srcW = canvas.width, srcH = canvas.height, dstX = 0, dstY = 0, bias = [0, 0, 0], scale = [1, 1, 1] } = options;
    let { dstW = srcW, dstH = srcH } = options;
    let imageData = image_data_1.getImageData(canvas, { srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH });
    return getImageArrayFromImageData(imageData, { type, color, order, bias, scale });
}
exports.getImageArrayFromCanvas = getImageArrayFromCanvas;
/**
 * Get image array from image element as `{Float32 or Int32}ArrayBufferView`.
 *
 * @returns {ImageData} buffer with specified type
 * @protected
 */
function getImageArrayFromDrawable(drawable, options = {}) {
    let srcW, srcH;
    if (drawable instanceof HTMLVideoElement) {
        srcW = drawable.videoWidth;
        srcH = drawable.videoHeight;
    }
    else if (drawable instanceof HTMLImageElement) {
        srcW = drawable.naturalWidth;
        srcH = drawable.naturalHeight;
    }
    else if (drawable instanceof HTMLCanvasElement) {
        return getImageArrayFromCanvas(drawable, options);
    }
    else if (drawable instanceof ImageData) {
        return getImageArrayFromImageData(drawable, options);
    }
    else
        throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof Drawable');
    let { type = Float32Array, color = enums_1.Color.RGB, order = enums_1.Order.HWC, srcX = 0, srcY = 0, dstX = 0, dstY = 0, dstW = srcW, dstH = srcH, bias = [0, 0, 0], scale = [1, 1, 1] } = options;
    let canvas = document.createElement('canvas');
    canvas.width = dstX + dstW;
    canvas.height = dstY + dstH;
    let context = canvas_1.getContext2D(canvas);
    context.drawImage(drawable, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    return getImageArrayFromCanvas(canvas, { type, color, order, bias, scale });
}
exports.getImageArrayFromDrawable = getImageArrayFromDrawable;
/**
 * Create typed array by packing image data from image source with specified options.
 *
 * First, this method loads specified image resource. The behavior of this method depends on the `image` argument.
 *
 * - If `image` is an instance of `string`, it will be regarded as image url, and this method fetches that url.
 *
 * - If `image` is an instance of `HTMLInputElement`, it will be regarded as file inpu,
 *   and this method loads the selected image file.
 *
 * - Otherwise, `image` will be regarded as drawable object.
 *
 * Then, loaded images are packed into typed array based on `options` argument.
 *
 * - The image is cropped based on [[SourceRect|`{srcX, srcY, srcW, srcH}`]].
 *   As default, entire image is used.
 *
 * - The image is resized and translated into [[DestinationRect|`{dstX, dstY, dstW, dstH}`]].
 *   As default, no resize and translation is performed.
 *
 * - [[ImageArrayOption.type|`options.type`]] is the type of packed typed array. As default, Float32Array is used.
 *
 * - [[ImageArrayOption.type|`options.color`]] is the color format of packed typed array. As default, [[Color.RGB|`RGB`]] is used.
 *
 * - [[ImageArrayOption.type|`options.order`]] is the data order of packed typed array. As default, [[Order.HWC|`HWC`]] is used.
 *
 * - [[ImageArrayOption.bias|`options.bias`]] is the bias value.
 *   If specified, this method **subtracts** this value from original pixel value.
 *
 * - [[ImageArrayOption.scale|`options.scale`]] is the scale value. If specified, original pixel values are **divided** by this value.
 *   [[ImageArrayOption.scale|`options.scale`]] and [[ImageArrayOption.bias|`options.bias`]] is used for converting pixel value `x` and
 *   packed value `y` as follows:
 *
 *   - `y = (x - bias) / scale`
 *   - `x = y * scale + bias`
 *
 * ### Examples
 *
 * - Load image of specified url
 *
 *   ```ts
 *   let image = await WebDNN.Image.load('./cat.png');
 *   ```
 *
 * - Load image selected in file input and resize it into 224 x 224
 *
 *   ```ts
 *   let input = document.querySelector('input[type=file]');
 *   let image = await WebDNN.Image.load(input, { dstW: 224, dstH: 224 });
 *   ```
 *
 * - Load image data from canvas, normalize it into range `[-1, 1)`. In this case, normalized value `y` can be
 *   calculated from pixel value `x` as follows: `y = (x - 128) / 128`.
 *
 *   ```ts
 *   let canvas = document.getElementsByTagName('canvas')[0];
 *   let image = await WebDNN.Image.load(canvas, { bias: [128, 128, 128], scale: [128, 128, 128] });
 *   ```
 *
 * @param image please see above descriptions
 * @param options please see above descriptions.
 * @returns Created typed array
 */
async function getImageArray(image, options = {}) {
    if (typeof image === 'string') {
        return getImageArrayFromDrawable(await image_source_1.loadImageByUrl(image), options);
    }
    else if (image instanceof HTMLInputElement) {
        return getImageArrayFromDrawable(await image_source_1.loadImageFromFileInput(image), options);
    }
    else if (image instanceof HTMLCanvasElement) {
        return getImageArrayFromCanvas(image, options);
    }
    else if (image instanceof HTMLImageElement || image instanceof HTMLVideoElement) {
        return getImageArrayFromDrawable(image, options);
        // FIXME: This feature is not supported for all web browsers.
        // } else if (image === null) {
        //     return getImageArrayFromDrawable(await loadImageByDialog(), options);
    }
    else
        throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of string,' +
            ' HTMLInputElement, HTMLCanvasElement, HTMLImageElement, or HTMLVideoElement object');
}
exports.getImageArray = getImageArray;
/**
 * Set image array data into canvas.
 *
 * ### Examples
 *
 * - Show DNN model's result
 *
 *   ```ts
 *   let runner = await WebDNN.load('./model');
 *   let output = runner.getOutputViews()[0];
 *
 *   await runner.run();
 *
 *   WebDNN.Image.setImageArrayToCanvas(output.toActual(), 256, 256, document.getElementById('canvas'))
 *   ```
 *
 * - Generally image generation model's result contains noise pixel at their edge because of convolution's padding.
 *   In follow example, these noise are cut off.
 *
 *   ```ts
 *   WebDNN.Image.setImageArrayToCanvas(output, 256, 256, canvas, {
 *      srcX: 16, srcY: 16, srcH: 256-16*2, srcW: 256-16*2, // Discard both ends 16px
 *      dstW: 256, dstH: 256  // Resize cropped image into original output size.
 *   });
 *   ```
 *
 * @param array array which contains image data
 * @param imageW width of image
 * @param imageH height of image. The length of `array` must be `imageW * imageH * (# of channels)`
 * @param canvas destination canvas
 * @param options please see above descriptions and descriptions in [[webdnn/image.getImageArray|getImageArray()]].
 *                `srcW` and `srcH` is ignored (overwritten by `imageW` and `imageH`).
 */
function setImageArrayToCanvas(array, imageW, imageH, canvas, options = {}) {
    let { color = enums_1.Color.RGB, order = enums_1.Order.HWC, srcX = 0, srcY = 0, dstX = 0, dstY = 0, dstW = canvas.width, dstH = canvas.height, bias = [0, 0, 0], scale = [1, 1, 1] } = options;
    const bias_n = normalizeBiasTuple(bias);
    const scale_n = normalizeBiasTuple(scale);
    let srcW = imageW, srcH = imageH;
    array = flatten(array);
    let data = new Uint8ClampedArray(srcW * srcH * 4);
    let biasR, biasG, biasB;
    let scaleR, scaleG, scaleB;
    switch (color) {
        case enums_1.Color.RGB:
            [biasR, biasG, biasB] = bias_n;
            [scaleR, scaleG, scaleB] = scale_n;
            switch (order) {
                case enums_1.Order.HWC:
                    for (let h = srcY; h < srcY + srcH; h++) {
                        for (let w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 3 + 0] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 3 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 3 + 2] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (let h = srcY; h < srcY + srcH; h++) {
                        for (let w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(0 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(2 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.BGR:
            [biasB, biasG, biasR] = bias_n;
            [scaleB, scaleG, scaleR] = scale_n;
            switch (order) {
                case enums_1.Order.HWC:
                    for (let h = srcY; h < srcY + srcH; h++) {
                        for (let w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 3 + 2] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 3 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 3 + 0] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (let h = srcY; h < srcY + srcH; h++) {
                        for (let w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(2 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(0 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.GREY:
            for (let h = srcY; h < srcY + srcH; h++) {
                for (let w = srcX; w < srcX + srcW; w++) {
                    data[(h * imageW + w) * 4 + 0] =
                        data[(h * imageW + w) * 4 + 1] =
                            data[(h * imageW + w) * 4 + 2] = array[h * imageW + w] * scale[0] + bias[0];
                    data[(h * imageW + w) * 4 + 3] = 255;
                }
            }
            break;
    }
    image_data_1.setImageDataToCanvas(new ImageData(data, srcW, srcH), canvas, { srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH });
}
exports.setImageArrayToCanvas = setImageArrayToCanvas;
