"use strict";
/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("./canvas");
/**
 * @protected
 */
function getImageDataFromCanvas(canvas, options = {}) {
    let { srcX = 0, srcY = 0, srcW = canvas.width, srcH = canvas.height, dstX = 0, dstY = 0 } = options;
    let { dstW = srcW, dstH = srcH } = options;
    let imageData = canvas_1.getContext2D(canvas).getImageData(srcX, srcY, srcW, srcH);
    if (dstX !== 0 || dstY !== 0 || srcW !== dstW || srcH !== dstH) {
        imageData = cropAndResizeImageData(imageData, { dstX, dstY, dstW, dstH });
    }
    return imageData;
}
exports.getImageDataFromCanvas = getImageDataFromCanvas;
/**
 * @protected
 */
function getImageDataFromDrawable(drawable, options = {}) {
    let srcW, srcH;
    if (drawable instanceof HTMLVideoElement) {
        srcW = drawable.videoWidth;
        srcH = drawable.videoHeight;
    }
    else if (drawable instanceof HTMLImageElement) {
        srcW = drawable.naturalWidth;
        srcH = drawable.naturalHeight;
    }
    else
        throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof HTMLVideoElement or HTMLImageElement');
    let { srcX = 0, srcY = 0, dstX = 0, dstY = 0, dstW = srcW, dstH = srcH } = options;
    let canvas = document.createElement('canvas');
    canvas.width = dstX + dstW;
    canvas.height = dstY + dstH;
    let context = canvas_1.getContext2D(canvas);
    context.drawImage(drawable, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    return context.getImageData(0, 0, dstX + dstW, dstY + dstH);
}
exports.getImageDataFromDrawable = getImageDataFromDrawable;
/**
 * Source rectangle of source image is cropped and then copied into destination rectangle of new image data
 *
 * @param {ImageData} src
 * @param {SourceRect & DestinationRect} options
 * @returns {ImageData}
 * @protected
 */
function cropAndResizeImageData(src, options = {}) {
    let { srcX = 0, srcY = 0, srcW = src.width, srcH = src.height, dstX = 0, dstY = 0 } = options;
    let { dstW = srcW, dstH = srcH } = options;
    let canvas1 = document.createElement('canvas');
    canvas1.width = srcW;
    canvas1.height = srcH;
    let context1 = canvas_1.getContext2D(canvas1);
    context1.putImageData(src, -srcX, -srcY);
    let canvas2 = document.createElement('canvas');
    canvas2.width = dstX + dstW;
    canvas2.height = dstY + dstH;
    let context2 = canvas_1.getContext2D(canvas2);
    context2.drawImage(canvas1, 0, 0, srcW, srcH, dstX, dstY, dstW, dstH);
    return context2.getImageData(0, 0, dstX + dstW, dstY + dstH);
}
/**
 * Return canvas `ImageData` object with specified scale.
 *
 * @param {HTMLCanvasElement | HTMLVideoElement | HTMLImageElement} image
 * @param [options] Options
 * @param {number} [options.srcX=0] left position of input clipping rect
 * @param {number} [options.srcY=0] top position of input clipping rect
 * @param {number} [options.srcW=canvas.width] width of input clipping rect
 * @param {number} [options.srcH=canvas.height] height of input clipping rect
 * @param {number} [options.dstW=options.srcW] width of output
 * @param {number} [options.dstH=options.srcH] height of output
 * @returns {ImageData}
 * @protected
 */
function getImageData(image, options = {}) {
    if (image instanceof HTMLCanvasElement) {
        return getImageDataFromCanvas(image, options);
    }
    else if (image instanceof HTMLVideoElement || image instanceof HTMLImageElement) {
        return getImageDataFromDrawable(image, options);
    }
    else
        throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of HTMLCanvasElement, HTMLVideoElement, or HTMLImageElement');
}
exports.getImageData = getImageData;
/**
 * @protected
 */
function setImageDataToCanvas(imageData, canvas, options = {}) {
    let { srcX = 0, srcY = 0, srcW = imageData.width, srcH = imageData.height, dstX = 0, dstY = 0 } = options;
    let { dstW = srcW, dstH = srcH } = options;
    if (srcX !== 0 || srcY !== 0 || srcW !== dstW || srcH !== dstH) {
        imageData = cropAndResizeImageData(imageData, { srcX, srcY, srcW, srcH, dstW, dstH });
    }
    canvas_1.getContext2D(canvas).putImageData(imageData, dstX, dstY);
}
exports.setImageDataToCanvas = setImageDataToCanvas;
