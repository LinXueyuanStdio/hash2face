"use strict";
/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get canvas rendering context and check whether it is nonnull value.
 *
 * @param {CanvasRenderingContext2D} canvas
 * @protected
 */
function getContext2D(canvas) {
    let context = canvas.getContext('2d');
    if (!context)
        throw Error('CanvasRenderingContext2D initialization failed');
    return context;
}
exports.getContext2D = getContext2D;
