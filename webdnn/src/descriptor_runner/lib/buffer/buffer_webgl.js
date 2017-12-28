"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_handler_1 = require("../webgl_handler");
const buffer_1 = require("./buffer");
/**
 * @protected
 */
class BufferWebGL extends buffer_1.Buffer {
    constructor(byteLength, textureWidth, textureHeight, name, array, channelMode) {
        super(byteLength, 'webgl');
        this._texture = null;
        this.readTextureUnitIndices = [];
        this.isBoundToDrawFrameBuffer = false;
        this.handler = webgl_handler_1.default.getInstance();
        this.name = name;
        this.channelMode = channelMode;
        switch (channelMode) {
            case 'RGBA':
                this.elementsPerPixel = 4;
                break;
            case 'R':
                this.elementsPerPixel = 1;
                break;
            default:
                throw Error('Unknown channel mode');
        }
        if (webgl_handler_1.isWebGL2(this.handler.gl)) {
            switch (channelMode) {
                case 'RGBA':
                    this.textureFormat = this.handler.gl.RGBA;
                    this.textureInternalFormat = this.handler.gl.RGBA32F;
                    this.pixelStride = 4;
                    break;
                case 'R':
                    this.textureFormat = this.handler.gl.RED;
                    this.textureInternalFormat = this.handler.gl.R32F;
                    this.pixelStride = 1;
                    break;
                default:
                    throw Error('Unknown channel mode');
            }
        }
        else {
            // In WebGL1, always RGBA channel mode is specified. If R channel mode is specified in graph descriptor,
            // other 3 channels are not used.
            this.textureFormat = this.handler.gl.RGBA;
            this.textureInternalFormat = this.handler.gl.RGBA;
            this.pixelStride = 4;
        }
        if (this.pixelStride < this.elementsPerPixel)
            throw Error('elementsPerPixel must be smaller than pixelStride');
        this.array = array || new Float32Array(this.length);
        this.textureWidth = textureWidth;
        this.textureHeight = textureHeight;
    }
    get texture() {
        return this._texture;
    }
    get length() {
        return this.byteLength / Float32Array.BYTES_PER_ELEMENT;
    }
    /**
     * Write contents onto specified position synchronously.
     *
     * @param {ArrayBufferView} src contents source buffer
     * @param {number} offset position where contents are written on
     */
    async write(src, offset) {
        this.array.set(src, offset);
        await this.syncWriteViews();
    }
    /**
     * Read contents from specified position synchronously.
     *
     * @param {Float32ArrayConstructor | Int32ArrayConstructor} dst buffer where contents are written on
     * @param {number} offset position where contents are read from
     * @param {length} length contents length
     */
    async read(dst, offset = 0, length) {
        if (dst !== Float32Array)
            throw new Error('Currently, only Float32Array is supported for parameter \'dst\'.');
        await this.syncReadViews();
        new Float32Array(this.array.buffer, offset * Float32Array.BYTES_PER_ELEMENT, length);
    }
    getWriteView(offset, length, type) {
        return new type(this.array.buffer, offset * type.BYTES_PER_ELEMENT, length);
    }
    ;
    getReadView(offset, length, type) {
        return new type(this.array.buffer, offset * type.BYTES_PER_ELEMENT, length);
    }
    /**
     * Sync buffered data into memory.
     *
     * @see Buffer#getWriteView
     */
    async syncWriteViews() {
        let gl = this.handler.gl;
        if (!this.texture)
            this.allocateTexture();
        let tmp = this.pack(this.array);
        if (tmp.length != this.textureWidth * this.textureHeight * this.pixelStride) {
            let tmp2 = new Float32Array(this.textureWidth * this.textureHeight * this.elementsPerPixel);
            tmp2.set(tmp, 0);
            tmp = tmp2;
        }
        await this.bindToReadTexture(9); //TODO: texture unit 9 is always available?
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.textureWidth, this.textureHeight, this.textureFormat, gl.FLOAT, tmp);
        this.unbindFromReadTexture();
    }
    /**
     * Sync memory data into buffer view.
     *
     * @see Buffer#getReadView
     */
    async syncReadViews() {
        let gl = this.handler.gl;
        // FIXME(Kiikurage): more readable code
        const ELEMENT_PER_PIXEL = 4;
        const FORMAT = gl.RGBA;
        let tmp = new Float32Array(this.textureWidth * this.textureHeight * ELEMENT_PER_PIXEL);
        this.bindToDrawTexture();
        gl.readPixels(0, 0, this.textureWidth, this.textureHeight, FORMAT, gl.FLOAT, tmp);
        this.unbindFromDrawTexture();
        tmp = this.unpack(tmp);
        this.array.set(tmp.slice(0, this.length), 0);
    }
    async bindToReadTexture(unit) {
        if (this.isBoundToDrawFrameBuffer)
            throw Error('This buffer is already registered as draw buffer. ' +
                'You may forgot to unbind the binding while previous operations.');
        let gl = this.handler.gl;
        if (!this.texture) {
            this.allocateTexture();
            await this.syncWriteViews();
        }
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        this.readTextureUnitIndices.push(unit);
    }
    unbindFromReadTexture() {
        let gl = this.handler.gl;
        for (let unit of this.readTextureUnitIndices) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.readTextureUnitIndices = [];
    }
    bindToDrawTexture() {
        if (this.readTextureUnitIndices.length > 0)
            throw Error('This buffer is already registered as read buffer. ' +
                'You cannot bind a texture as both read and draw texture buffer at same time.');
        if (this.isBoundToDrawFrameBuffer)
            throw Error('This buffer is already registered as draw buffer. ' +
                'You may forgot to unbind the binding while previous operations.');
        let gl = this.handler.gl;
        if (!this.texture)
            this.allocateTexture();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        this.isBoundToDrawFrameBuffer = true;
    }
    unbindFromDrawTexture() {
        if (!this.isBoundToDrawFrameBuffer)
            return;
        let gl = this.handler.gl;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
        this.isBoundToDrawFrameBuffer = false;
    }
    pack(array) {
        let elementStride = this.pixelStride / this.elementsPerPixel;
        if (elementStride === 1) {
            return new Float32Array(array);
        }
        else {
            let result = new Float32Array(array.length * elementStride);
            for (let i = 0; i < array.length; i++)
                result[i * elementStride] = array[i];
            return result;
        }
    }
    unpack(array) {
        // FIXME(Kiikurage): more readable code
        const PIXEL_STRIDE = 4;
        let elementStride = PIXEL_STRIDE / this.elementsPerPixel;
        if (elementStride === 1) {
            return new Float32Array(array);
        }
        else {
            let result = new Float32Array(array.length / elementStride);
            for (let i = 0; i < array.length / elementStride; i++)
                result[i] = array[i * elementStride];
            return result;
        }
    }
    allocateTexture() {
        if (this.texture)
            throw Error('Texture is already allocated.');
        this._texture = this.handler.createTexture(this.textureWidth, this.textureHeight, this.textureInternalFormat, this.textureFormat);
    }
}
exports.default = BufferWebGL;
