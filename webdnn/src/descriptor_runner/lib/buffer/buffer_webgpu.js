"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const webgpu_handler_1 = require("../webgpu_handler");
const buffer_1 = require("./buffer");
/**
 * @protected
 */
class BufferWebGPU extends buffer_1.Buffer {
    constructor(byteLength) {
        super(byteLength, 'webgpu');
        if (byteLength == 0) {
            byteLength = 4; //0 length buffer causes error
        }
        this.handler = webgpu_handler_1.default.getInstance();
        this.buffer = this.handler.createBuffer(new Uint8Array(byteLength));
        this.bufferView = new Uint8Array(this.buffer.contents);
    }
    // async: there may be platforms synchronization is needed before writing
    async write(src, dst_offset) {
        await this.handler.sync();
        let viewSameType = new src.constructor(this.bufferView.buffer);
        viewSameType.set(src, dst_offset);
    }
    async read(dst, src_offset = 0, length) {
        if (!dst)
            throw new Error('dst cannot be null');
        await this.handler.sync();
        if (this.byteLength === 0)
            return;
        let dstConstructor = dst.constructor;
        let viewSameType = new dstConstructor(this.bufferView.buffer, this.bufferView.byteOffset + src_offset * dstConstructor.BYTES_PER_ELEMENT, length);
        dst.set(viewSameType);
        return;
    }
    getWriteView(offset, length, type) {
        return new type(this.bufferView.buffer, this.bufferView.byteOffset + offset * type.BYTES_PER_ELEMENT, length);
    }
    getReadView(offset, length, type) {
        return new type(this.bufferView.buffer, this.bufferView.byteOffset + offset * type.BYTES_PER_ELEMENT, length);
    }
    async syncWriteViews() {
        // no sync needed
    }
    async syncReadViews() {
        // if the user awaits promise from final kernel execution, this function call is not needed.
        await this.handler.sync();
    }
}
exports.default = BufferWebGPU;
