"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_webgl_1 = require("../buffer/buffer_webgl");
const get_weight_decoder_1 = require("../decoder/get_weight_decoder");
const fetch_1 = require("../fetch");
const placeholder_1 = require("../placeholder");
const symbolic_float32array_1 = require("../symbolic_typed_array/symbolic_float32array");
const localforage_ = require("../third/localforage.nopromises.min");
const webdnn_1 = require("../webdnn");
const webgl_handler_1 = require("../webgl_handler");
const descriptor_runner_1 = require("./descriptor_runner");
/**
 * @private
 */
const localforage = localforage_.default;
// [x y u v] * [upper-left, lower-left, upper-right, lower-right]
/**
 * @protected
 */
const vertexArray = new Float32Array([
    -1, +1,
    -1, -1,
    +1, +1,
    +1, -1,
]);
/**
 * @protected
 */
class DescriptorRunnerWebGL extends descriptor_runner_1.DescriptorRunner {
    constructor() {
        super(...arguments);
        this.backendName = 'webgl';
    }
    static checkAvailability() {
        return webgl_handler_1.default.checkAvailability();
    }
    async init() {
        if (!DescriptorRunnerWebGL.checkAvailability())
            throw Error('WebGL backend is not supported in this browser.');
        this.handler = webgl_handler_1.default.getInstance();
        let vertexBuffer = this.handler.createArrayBuffer(vertexArray);
        this.handler.bindArrayBuffer(vertexBuffer);
        this.buffers = new Map();
    }
    async fetchDescriptor(directory) {
        let res = await fetch_1.default(`${directory}/graph_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}.json`);
        return res.json();
    }
    async fetchParameters(directory, progressCallback) {
        let res = await fetch_1.default(`${directory}/weight_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}.bin`);
        return fetch_1.readArrayBufferProgressively(res, progressCallback);
    }
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    async restoreCachedDescriptor(directory) {
        return localforage.getItem(`${directory}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_descriptor`).catch(() => null);
    }
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    async restoreCachedParameters(directory, progressCallback) {
        let parameter = await localforage.getItem(`${directory}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_parameters`).catch(() => null);
        if (parameter && progressCallback)
            progressCallback(parameter.byteLength, parameter.byteLength);
        return parameter;
    }
    /**
     * save cache
     */
    async saveCache(directory, descriptor, parameters) {
        await Promise.all([
            localforage.setItem(`${directory}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_descriptor`, descriptor),
            localforage.setItem(`${directory}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_parameters`, parameters)
        ]);
    }
    ;
    async setDescriptorAndParameters(descriptor, parameters) {
        await this.setDescriptor(descriptor);
        await this.compile();
        await this.initializeStaticBuffer(parameters);
        if (this.placeholderContext && this.placeholderContext.isResolved)
            await this.initializeDynamicBuffer();
    }
    async initializeStaticBuffer(weightRawArray) {
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        let descriptor = this.descriptor;
        let decoder = get_weight_decoder_1.default(this.descriptor.weight_encoding);
        let weight = await decoder.decode(new Uint8Array(weightRawArray));
        let buffers = this.buffers;
        let mapping = descriptor.memory_layout.mapping;
        Object.entries(descriptor.memory_layout.static.allocations)
            .forEach(([name, { width, height, size, channel_mode }]) => {
            buffers.set(name, new buffer_webgl_1.default(size * Float32Array.BYTES_PER_ELEMENT, width, height, name, null, channel_mode));
        });
        Object.entries(descriptor.constants_map)
            .forEach(([name, { size, byte_offset }]) => {
            buffers.get(name).array.set(new Float32Array(weight.buffer, byte_offset, size));
        });
        (await this.getInputViews())
            .filter(view => !view.isDynamic)
            .forEach(view => view.setArrayBuffer(buffers.get(mapping[view.name]).getWriteView(0, view.length, Float32Array).buffer));
        (await this.getOutputViews())
            .filter(view => !view.isDynamic)
            .forEach(view => view.setArrayBuffer(buffers.get(mapping[view.name]).getReadView(0, view.length, Float32Array).buffer));
    }
    async initializeDynamicBuffer() {
        if (!this.descriptor)
            throw Error("GraphDescriptor is not loaded.");
        if (!this.placeholderContext)
            throw Error("PlaceholderContext is not initialized.");
        let descriptor = this.descriptor;
        let placeholderContext = this.placeholderContext;
        let buffers = this.buffers;
        let mapping = descriptor.memory_layout.mapping;
        Object.entries(descriptor.memory_layout.dynamic.allocations)
            .forEach(([name, { width, height, size, channel_mode }]) => {
            buffers.set(name, new buffer_webgl_1.default(placeholderContext.resolve(size) * Float32Array.BYTES_PER_ELEMENT, placeholderContext.resolve(width), placeholderContext.resolve(height), name, null, channel_mode));
        });
        (await this.getInputViews())
            .filter(view => view.isDynamic)
            .forEach(view => view.setArrayBuffer(buffers.get(mapping[view.name]).getWriteView(0, placeholderContext.resolve(view.length), Float32Array).buffer));
        (await this.getOutputViews())
            .filter(view => view.isDynamic)
            .forEach(view => view.setArrayBuffer(buffers.get(mapping[view.name]).getReadView(0, placeholderContext.resolve(view.length), Float32Array).buffer));
        this.buildPipeline();
    }
    async setDescriptor(descriptor) {
        this.descriptor = descriptor;
        //reset all datum depend on old descriptor
        this.placeholderContext = new placeholder_1.default(descriptor.placeholders);
    }
    async compile() {
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        let descriptor = this.descriptor;
        this.programs = new Map();
        this.vertexShader = this.handler.createVertexShader(`
            precision highp float;
            attribute vec2 _xy;
            void main() { 
              gl_Position = vec4(_xy, 0, 1); 
            }
        `);
        Object.keys(descriptor.shader_sources)
            .forEach(name => {
            let fragmentShader = this.handler.createFragmentShader(descriptor.shader_sources[name]);
            let program = this.handler.createProgram(this.vertexShader, fragmentShader);
            this.programs.set(name, program);
        });
    }
    async setPlaceholderValue(values) {
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized.');
        let placeholderContext = this.placeholderContext;
        placeholderContext.update(values);
        if (!placeholderContext.isResolved)
            return;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        await this.initializeDynamicBuffer();
        // resolve placeholders in execution info
        if (Object.keys(this.descriptor.placeholders).length > 0)
            throw Error('Currently, WebGL backend doesn\'t support Placeholder feature.');
    }
    getInputViews() {
        if (this.inputViews)
            return this.inputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        let descriptor = this.descriptor;
        let placeholderContext = this.placeholderContext;
        let mapping = this.descriptor.memory_layout.mapping;
        this.inputViews = descriptor.inputs.map(name => {
            let view = new symbolic_float32array_1.default({
                name: name,
                size: this.buffers.get(mapping[name]).length,
                offset: 0
            }, placeholderContext, true);
            return view;
        });
        return this.inputViews;
    }
    getOutputViews() {
        if (this.outputViews)
            return this.outputViews;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        let descriptor = this.descriptor;
        let placeholderContext = this.placeholderContext;
        let mapping = this.descriptor.memory_layout.mapping;
        this.outputViews = descriptor.outputs.map(name => {
            let view = new symbolic_float32array_1.default({
                name: name,
                size: this.buffers.get(mapping[name]).length,
                offset: 0
            }, placeholderContext, true);
            return view;
        });
        return this.outputViews;
    }
    buildPipeline() {
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        if (!this.placeholderContext.isResolved)
            throw new Error(`Not all placeholders are resolved: ${this.placeholderContext}`);
        let gl = this.handler.gl;
        let buffers = this.buffers;
        let mapping = this.descriptor.memory_layout.mapping;
        let referenceCount = new Map();
        this.runtimeInfo = {
            inputs: this.getInputViews().map(view => buffers.get(mapping[view.name])),
            outputs: this.getOutputViews().map(view => buffers.get(mapping[view.name])),
            programs: this.descriptor.exec_infos.map(execInfo => {
                // inputs
                let inputs = execInfo.inputs.map(input => {
                    let buffer = buffers.get(mapping[input.variable_name]);
                    if (!referenceCount.has(buffer))
                        referenceCount.set(buffer, 0);
                    referenceCount.set(buffer, referenceCount.get(buffer) + 1);
                    return {
                        buffer: buffer,
                        uniformIndex: input.value
                    };
                });
                //output
                let output = buffers.get(mapping[execInfo.output]);
                // shader
                let program = this.programs.get(execInfo.shader_name);
                this.handler.useProgram(program);
                // uniforms
                let uniforms = Object.keys(execInfo.uniforms).map(name => {
                    let { type, value } = execInfo.uniforms[name];
                    switch (type) {
                        case 'int':
                            return {
                                func: gl.uniform1i,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'float':
                            return {
                                func: gl.uniform1f,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'vec2':
                            return {
                                func: gl.uniform2fv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'vec3':
                            return {
                                func: gl.uniform3fv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'vec4':
                            return {
                                func: gl.uniform4fv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'ivec2':
                            return {
                                func: gl.uniform2iv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'ivec3':
                            return {
                                func: gl.uniform3iv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'ivec4':
                            return {
                                func: gl.uniform4iv,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        case 'sampler2D':
                            return {
                                func: gl.uniform1i,
                                args: [gl.getUniformLocation(program, name), value]
                            };
                        default:
                            throw TypeError(`Incompatible type for uniform parameter: ${type}`);
                    }
                });
                // attributes
                let xyAttribLoc = gl.getAttribLocation(program, '_xy');
                // run
                return {
                    program: program,
                    frameBuffer: this.handler.createFrameBuffer(),
                    name: execInfo.shader_name,
                    width: output.textureWidth,
                    height: output.textureHeight,
                    inputs: inputs,
                    output: output,
                    xyAttribLoc: xyAttribLoc,
                    uniforms: uniforms,
                    disposable: []
                };
            })
        };
        for (let runtimeProgramInfo of this.runtimeInfo.programs) {
            runtimeProgramInfo.inputs.forEach(({ buffer }) => {
                let count = referenceCount.get(buffer) - 1;
                if (count == 0) {
                    runtimeProgramInfo.disposable.push(buffer);
                }
                referenceCount.set(buffer, count);
            });
        }
    }
    async run() {
        // if (this._running) throw new Error('Calling another run() while running.');
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.inputViews || !this.outputViews)
            throw new Error('getInputViews and getOutputViews must be called prior to run');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        if (!this.placeholderContext.isResolved)
            throw new Error(`Not all placeholders are resolved: ${this.placeholderContext}`);
        let gl = this.handler.gl;
        let runtimeInfo = this.runtimeInfo;
        if (this.runtimeInfo.programs.length > 0) {
            for (let buffer of runtimeInfo.inputs)
                await buffer.syncWriteViews();
            if (webdnn_1.getConfiguration('DEBUG', false)) {
                let records = [];
                let totalElapsedTime = 0;
                for (let runtimeProgramInfo of runtimeInfo.programs) {
                    let start = performance.now();
                    this.handler.bindFrameBuffer(runtimeProgramInfo.frameBuffer, runtimeProgramInfo.width, runtimeProgramInfo.height);
                    // inputs
                    for (let { buffer, uniformIndex } of runtimeProgramInfo.inputs)
                        await buffer.bindToReadTexture(uniformIndex);
                    // output
                    runtimeProgramInfo.output.bindToDrawTexture();
                    // shader
                    this.handler.useProgram(runtimeProgramInfo.program);
                    // uniforms
                    for (let uniform of runtimeProgramInfo.uniforms)
                        uniform.func.apply(gl, uniform.args);
                    // attribute
                    gl.vertexAttribPointer(runtimeProgramInfo.xyAttribLoc, 2, gl.FLOAT, true, 8, 0);
                    gl.enableVertexAttribArray(runtimeProgramInfo.xyAttribLoc);
                    // run
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexArray.length / 2);
                    await this.handler.waitForComplete();
                    let elapsedTime = performance.now() - start;
                    totalElapsedTime += elapsedTime;
                    let xs = [];
                    for (let { buffer } of runtimeProgramInfo.inputs) {
                        buffer.unbindFromReadTexture();
                        await buffer.syncReadViews();
                        xs.push(buffer.array.slice());
                    }
                    runtimeProgramInfo.output.unbindFromDrawTexture();
                    await runtimeProgramInfo.output.syncReadViews();
                    let y = runtimeProgramInfo.output.array.slice();
                    records.push({
                        'Kernel': runtimeProgramInfo.name,
                        'Elapsed time [ms]': elapsedTime,
                        'xs': xs,
                        'y': y
                    });
                }
                let summary = Array.from(Object.values(records.reduce((summary, record) => {
                    if (!(record['Kernel'] in summary)) {
                        summary[record['Kernel']] = {
                            'Kernel': record['Kernel'],
                            'Count': 0,
                            'Elapsed time [ms]': 0,
                        };
                    }
                    summary[record['Kernel']]['Count']++;
                    summary[record['Kernel']]['Elapsed time [ms]'] += record['Elapsed time [ms]'];
                    return summary;
                }, {})));
                summary.forEach(record => record['Ratio [%]'] = (record['Elapsed time [ms]'] / totalElapsedTime).toFixed(2));
                console.table(records);
                console.table(summary);
            }
            else {
                for (let runtimeProgramInfo of runtimeInfo.programs) {
                    this.handler.bindFrameBuffer(runtimeProgramInfo.frameBuffer, runtimeProgramInfo.width, runtimeProgramInfo.height);
                    // inputs
                    for (let { buffer, uniformIndex } of runtimeProgramInfo.inputs)
                        await buffer.bindToReadTexture(uniformIndex);
                    // output
                    runtimeProgramInfo.output.bindToDrawTexture();
                    // shader
                    this.handler.useProgram(runtimeProgramInfo.program);
                    // uniforms
                    for (let uniform of runtimeProgramInfo.uniforms)
                        uniform.func.apply(gl, uniform.args);
                    // attribute
                    gl.vertexAttribPointer(runtimeProgramInfo.xyAttribLoc, 2, gl.FLOAT, true, 8, 0);
                    gl.enableVertexAttribArray(runtimeProgramInfo.xyAttribLoc);
                    // run
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexArray.length / 2);
                    // release buffers and binding
                    // for (let buffer of runtimeProgramInfo.disposable) buffer.releaseGPUMemory();
                    for (let { buffer } of runtimeProgramInfo.inputs)
                        buffer.unbindFromReadTexture();
                    runtimeProgramInfo.output.unbindFromDrawTexture();
                }
            }
            for (let buffer of runtimeInfo.outputs)
                await buffer.syncReadViews();
        }
    }
}
exports.default = DescriptorRunnerWebGL;
