"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const weight_decoder_eightbit_1 = require("./weight_decoder_eightbit");
const weight_decoder_raw_1 = require("./weight_decoder_raw");
/**
 * @protected
 */
function getWeightDecoder(name) {
    switch (name) {
        case 'raw':
            return new weight_decoder_raw_1.default();
        case 'eightbit':
            return new weight_decoder_eightbit_1.default();
        default:
            throw new Error('Unknown weight encoding');
    }
}
exports.default = getWeightDecoder;
