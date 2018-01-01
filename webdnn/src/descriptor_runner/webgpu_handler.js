"use strict";
///<reference path="./webgpu.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
const buffer_webgpu_1 = require("./buffer/buffer_webgpu");
/**
 * @private
 */
let instance;
/**
 * @protected
 */
class WebGPUHandler {
    /**
     * WebGPUHandler is singleton class and instantiate directly is forbidden (constructor is hidden).
     *
     * Since the number of GPU contexts may be limited, the handler is used as a singleton
     * and only one context is shared among multiple runners.
     */
    constructor() {
        this.pipelineStates = new Map();
        if (!exports.IS_WEBGPU_SUPPORTED)
            throw new Error('This browser does not support WebGPU');
        let context;
        try {
            context = document.createElement('canvas').getContext('webgpu');
        }
        catch (err) {
            throw new Error(`During initializing WebGPURenderingContext, unexpected error is occurred: ${err.message}`);
        }
        if (!context)
            throw new Error('WebGPURenderingContext initialization failed');
        this.context = context;
        this.commandQueue = context.createCommandQueue();
        this.loadKernel('kernel void sync(){}', 'basic');
    }
    static getInstance() {
        if (!instance)
            instance = new WebGPUHandler();
        return instance;
    }
    createBuffer(arrayBuffer) {
        return this.context.createBuffer(arrayBuffer);
    }
    loadKernel(librarySource, namespace = '') {
        let library = this.context.createLibrary(librarySource);
        for (let name of library.functionNames) {
            let kernelFunction = library.functionWithName(name);
            let pipelineStates = this.context.createComputePipelineState(kernelFunction);
            this.pipelineStates.set(namespace + '.' + name, pipelineStates);
        }
    }
    createCommandBuffer() {
        return this.commandQueue.createCommandBuffer();
    }
    getPipelineStateByName(name) {
        let state = this.pipelineStates.get(name);
        if (!state) {
            throw TypeError(`Kernel function "${name}" is not loaded.`);
        }
        return state;
    }
    executeSinglePipelineState(name, threadgroupsPerGrid, threadsPerThreadgroup, buffers, getCompletedPromise) {
        let commandBuffer = this.commandBuffer || (this.commandBuffer = this.createCommandBuffer());
        let commandEncoder = commandBuffer.createComputeCommandEncoder();
        commandEncoder.setComputePipelineState(this.getPipelineStateByName(name));
        for (let i = 0; i < buffers.length; i++) {
            let buffer = buffers[i];
            let wgbuf;
            if (buffer instanceof buffer_webgpu_1.default) {
                wgbuf = buffer.buffer;
            }
            else {
                // cannot perform (buffer instanceof WebGPUBuffer) currently
                wgbuf = buffer;
            }
            commandEncoder.setBuffer(wgbuf, 0, i);
        }
        commandEncoder.dispatch(threadgroupsPerGrid, threadsPerThreadgroup);
        commandEncoder.endEncoding();
        let promise = null;
        if (getCompletedPromise) {
            promise = commandBuffer.completed;
        }
        this.commandBuffer = null;
        commandBuffer.commit();
        return promise;
    }
    async sync() {
        let commandBuffer = this.createCommandBuffer();
        let commandEncoder = commandBuffer.createComputeCommandEncoder();
        commandEncoder.setComputePipelineState(this.getPipelineStateByName('basic.sync'));
        commandEncoder.dispatch({
            width: 1,
            height: 1,
            depth: 1
        }, {
            width: 1,
            height: 1,
            depth: 1
        });
        commandEncoder.endEncoding();
        let promise = commandBuffer.completed;
        commandBuffer.commit();
        return promise;
    }
}
exports.default = WebGPUHandler;
/**
 * Flag whether WebGPU is supported or not
 * @protected
 */
exports.IS_WEBGPU_SUPPORTED = 'WebGPURenderingContext' in window && 'WebGPUComputeCommandEncoder' in window;
