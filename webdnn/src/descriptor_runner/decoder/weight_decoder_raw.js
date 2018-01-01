"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @protected
 */
class WeightDecoderRaw {
    async decode(data) {
        return new Float32Array(data.buffer, data.byteOffset, data.byteLength / 4);
    }
}
exports.default = WeightDecoderRaw;
