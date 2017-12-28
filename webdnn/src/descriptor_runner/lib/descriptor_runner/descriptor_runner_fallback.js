"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const get_weight_decoder_1 = require("../decoder/get_weight_decoder");
const fetch_1 = require("../fetch");
const placeholder_1 = require("../placeholder");
const symbolic_float32array_1 = require("../symbolic_typed_array/symbolic_float32array");
const localforage_ = require("../third/localforage.nopromises.min");
const descriptor_runner_1 = require("./descriptor_runner");
const FS = require("q-io/fs");
/**
 * @private
 */
const localforage = localforage_.default;
/**
 * @private
 */
function wait(duration = 10) {
    // let console.log to be displayed, and prevent freeze
    return new Promise(resolve => setTimeout(resolve, duration));
}
/**
 * @protected
 */
class DescriptorRunnerFallback extends descriptor_runner_1.DescriptorRunner {
    constructor() {
        super(...arguments);
        this.backendName = 'fallback';
    }
    static checkAvailability() {
        return true;
    }
    async init() {
        //nothing to do
    }
    async setDescriptorAndParameters(descriptor, parameters) {
        this.setDescriptor(descriptor);
        await this.compile();
        await this.initializeStaticBuffer(parameters);
        if (this.placeholderContext && this.placeholderContext.isResolved)
            await this.initializeDynamicBuffer();
    }
    async fetchDescriptor(directory) {
        this.directory = directory;
        return await FS.read(`.${directory}/graph_${this.backendName}.json`, "r");
        // let res = await webdnnFetch();
        // return res.json();
    }
    async fetchParameters(directory, progressCallback) {
        let res = await fetch_1.default(`${directory}/weight_${this.backendName}.bin`);
        return fetch_1.readArrayBufferProgressively(res, progressCallback);
    }
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    async restoreCachedDescriptor(directory) {
        return localforage.getItem(`${directory}_${this.backendName}_descriptor`).catch(() => null);
    }
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    async restoreCachedParameters(directory, progressCallback) {
        let parameter = await localforage.getItem(`${directory}_${this.backendName}_parameters`).catch(() => null);
        if (parameter && progressCallback)
            progressCallback(parameter.byteLength, parameter.byteLength);
        return parameter;
    }
    /**
     * save cache
     */
    async saveCache(directory, descriptor, parameters) {
        await Promise.all([
            localforage.setItem(`${directory}_${this.backendName}_descriptor`, descriptor),
            localforage.setItem(`${directory}_${this.backendName}_parameters`, parameters)
        ]);
    }
    ;
    setDescriptor(descriptor) {
        this.descriptor = descriptor;
        // reset
        this.placeholderContext = new placeholder_1.default();
        this.placeholderContext.update(descriptor.placeholders);
        this.kernelObj = null;
        this.variableMap = null;
        this.outputViews = null;
        this.inputViews = null;
        this.staticBuffer = null;
        this.dynamicBuffer = null;
    }
    async compile() {
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        await new Promise((resolve) => {
            let script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) {
                script.onreadystatechange = () => {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        resolve();
                    }
                };
            }
            else {
                script.onload = resolve;
            }
            script.src = fetch_1.transformUrl(`${this.directory}/kernels_fallback.js`);
            document.getElementsByTagName("head")[0].appendChild(script);
        });
        this.kernelObj = window.dnn_fallback_kernel; // "window.dnn_fallback_kernel" is defined in "kernels_fallback.js"
    }
    async initializeStaticBuffer(weightRawArray) {
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        let descriptor = this.descriptor;
        let staticBuffer = new Float32Array(descriptor.memory_layout.static.size);
        this.staticBuffer = staticBuffer;
        let variableMap = this.variableMap || new Map();
        this.variableMap = variableMap;
        Object.entries(descriptor.memory_layout.static.allocations)
            .forEach(([name, allocation]) => {
            variableMap.set(name, new Float32Array(staticBuffer.buffer, allocation.offset * Float32Array.BYTES_PER_ELEMENT, allocation.size));
        });
        let decoder = get_weight_decoder_1.default(this.descriptor.weight_encoding);
        staticBuffer.set(await decoder.decode(new Uint8Array(weightRawArray)));
        (await this.getInputViews())
            .filter(view => !view.isDynamic)
            .forEach(view => view.setArrayBuffer(staticBuffer.buffer));
        (await this.getOutputViews())
            .filter(view => !view.isDynamic)
            .forEach(view => view.setArrayBuffer(staticBuffer.buffer));
    }
    async initializeDynamicBuffer() {
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized');
        let descriptor = this.descriptor;
        let placeholderContext = this.placeholderContext;
        let dynamicBuffer = new Float32Array(placeholderContext.resolve(descriptor.memory_layout.dynamic.size));
        this.dynamicBuffer = dynamicBuffer;
        let variableMap = this.variableMap || new Map();
        this.variableMap = variableMap;
        Object.entries(descriptor.memory_layout.dynamic.allocations)
            .forEach(([name, allocation]) => {
            variableMap.set(name, new Float32Array(dynamicBuffer.buffer, placeholderContext.resolve(allocation.offset) * Float32Array.BYTES_PER_ELEMENT, placeholderContext.resolve(allocation.size)));
        });
        (await this.getInputViews())
            .filter(view => view.isDynamic)
            .forEach(view => view.setArrayBuffer(dynamicBuffer.buffer));
        (await this.getOutputViews())
            .filter(view => view.isDynamic)
            .forEach(view => view.setArrayBuffer(dynamicBuffer.buffer));
    }
    async setPlaceholderValue(values) {
        if (!this.placeholderContext)
            throw new Error('placeholderContext is not initialized');
        let placeholderContext = this.placeholderContext;
        placeholderContext.update(values);
        if (!placeholderContext.isResolved)
            return;
        await this.initializeDynamicBuffer();
    }
    async run() {
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.placeholderContext)
            throw new Error('placeholderContext is not initialized');
        if (!this.variableMap)
            throw new Error('Variable map is not initialized');
        if (!this.staticBuffer)
            throw new Error('StaticBuffer map is not initialized');
        if (!this.dynamicBuffer)
            throw new Error('DynamicBuffer map is not initialized');
        if (!this.inputViews || !this.outputViews)
            throw new Error('getInputViews() and getOutputViews() must be called prior to run');
        let variableMap = this.variableMap;
        let placeholderContext = this.placeholderContext;
        let executionInfos = this.descriptor.exec_infos
            .map(executionInfo => placeholderContext.resolve(executionInfo));
        let startDate = Date.now();
        let lastDate = Date.now();
        for (let i = 0; i < executionInfos.length; i++) {
            let currentDate = Date.now();
            if (currentDate - lastDate >= 1000) {
                console.log(`Processed ${i}/${executionInfos.length} kernels in ${currentDate - startDate} ms`);
                lastDate = currentDate;
                await wait();
            }
            let executionInfo = executionInfos[i];
            let inputs = executionInfo.inputs.map((name) => variableMap.get(name));
            let outputs = executionInfo.outputs.map((name) => variableMap.get(name));
            this.kernelObj[executionInfo.entry_func_name](inputs, outputs, executionInfo.call_option);
        }
        console.log(`Processed ${executionInfos.length}/${executionInfos.length} kernels in ${Date.now() - startDate} ms`);
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
        this.inputViews = descriptor.inputs.map(name => {
            let allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            let view = new symbolic_float32array_1.default(allocation, placeholderContext);
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
        this.outputViews = descriptor.outputs.map(name => {
            let allocation = descriptor.memory_layout.static.allocations[name] || descriptor.memory_layout.dynamic.allocations[name];
            let view = new symbolic_float32array_1.default(allocation, placeholderContext);
            return view;
        });
        return this.outputViews;
    }
}
exports.default = DescriptorRunnerFallback;
