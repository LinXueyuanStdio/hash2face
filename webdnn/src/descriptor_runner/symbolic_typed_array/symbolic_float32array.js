"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
const symbolic_typed_array_1 = require("./symbolic_typed_array");
/**
 * @protected
 */
class SymbolicFloat32Array extends symbolic_typed_array_1.SymbolicTypedArray {
    toActual() {
        if (!this.arrayBuffer) {
            throw new Error('Internal buffer for this variable is not set. DescriptorRunner.setPlaceholderValue() have to be called before calling this function.');
        }
        return new Float32Array(this.arrayBuffer, this.ignoreOffsetOnActual ? 0 : this.offset * Float32Array.BYTES_PER_ELEMENT, this.length);
    }
}
exports.default = SymbolicFloat32Array;
