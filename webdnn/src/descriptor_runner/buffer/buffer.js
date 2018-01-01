"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract buffer interface. Read/write transactions are regarded as asynchronous operation.
 *
 * @protected
 */
class Buffer {
    constructor(byteLength, backend) {
        this.byteLength = byteLength;
        this.backend = backend;
    }
}
exports.Buffer = Buffer;
