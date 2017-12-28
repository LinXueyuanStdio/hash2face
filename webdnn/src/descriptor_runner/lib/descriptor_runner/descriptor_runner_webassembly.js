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
const fsfetch = require("q-io/fs");

// global.Worker = require('webworker-threads').Worker
const Worker = require('webworker-threads').Worker
const Promise = require('bluebird');

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}


/**
 * @private
 */
const localforage = localforage_.default;
/**
 * @protected
 */
class DescriptorRunnerWebassembly extends descriptor_runner_1.DescriptorRunner {
    constructor() {
        super();
        this.backendName = 'webassembly';
        this.worker_promise_reject_func = null;
        this.worker_initial_error = null;
        if (typeof Worker === 'undefined')
            throw new Error('WebWorker is needed for WebAssembly backend');
        if (typeof WebAssembly !== 'object') {
            console.warn('WebAssembly is not supported on this browser, trying to use asm.js code');
        }
    }
    static checkAvailability() {
        return true;
        return 'Worker' in window;
    }
    init() {
        if (!DescriptorRunnerWebassembly.checkAvailability())
            throw Error('WebAssembly backend is not supported in this browser.');
        //nothing to do
        return Promise.resolve();
    }
    async setDescriptorAndParameters(descriptor, parameters) {
        this.descriptor = descriptor;
        this.placeholderContext = new placeholder_1.default(this.descriptor.placeholders);
        // for browsers which does not support wasm, try asm.js code
        let kernel_backend = typeof WebAssembly === 'object' ? 'webassembly' : 'asmjs';
        let worker_entry_js_path = `./models/Bouvardia128_8bit/kernels_webassembly.js`;
        worker_entry_js_path = fetch_1.transformUrl(worker_entry_js_path);
        this.worker_entry_js_path = worker_entry_js_path;
        await this.compile();
        await this.loadWeights(new Uint8Array(parameters));
        //assign buffer to input/output buffer view
        (await this.getInputViews())
            .filter(view => !view.isDynamic)
            .forEach(view => view.setArrayBuffer((new Float32Array(view.length)).buffer));
        (await this.getOutputViews())
            .filter(view => !view.isDynamic)
            .forEach(view => view.setArrayBuffer((new Float32Array(view.length)).buffer));
    }
    /**
     * Fetch graph descriptor from specified directory.
     *
     * @param directory directory where descriptor is contained.
     * You can also provide URL of other domain like this.
     *
     * ```javascript
     * await runner.load('://my.other.domain.com/my_model');
     * ```
     *
     * However sometimes it can't because of Cross-Origin-Resource-Security policy.
     *
     * @protected
     */
    async fetchDescriptor(directory) {
        this.directory = directory;
        let res = await fsfetch.read("./models/Bouvardia128_8bit/graph_webassembly.json", "r");
        // console.log(res);
        return JSON.parse(res);
        // let res = await fetch_1.default(`${directory}/graph_${this.backendName}.json`);
        // return res.json();
    }
    /**
     * Fetch parameter files from specified directory.
     *
     * @param directory directory where descriptor is contained.
     * You can also provide URL of other domain like this.
     *
     * ```javascript
     * await runner.load('://my.other.domain.com/my_model');
     * ```
     *
     * However sometimes it can't because of Cross-Origin-Resource-Security policy.
     *
     * @param progressCallback callback which is called to notice the loading is progressing.
     * @protected
     */
    async fetchParameters(directory, progressCallback) {
        let weight_url = `${directory}/weight_${this.backendName}.bin`;
        var weight_fetch = await fsfetch.read(`./models/Bouvardia128_8bit/weight_webassembly.bin`, "b");
        
        return toArrayBuffer(weight_fetch);//str2ab(weight_fetch);
        // let weight_fetch = await fetch_1.default(weight_url);
        // return fetch_1.readArrayBufferProgressively(weight_fetch, progressCallback);
    }
    /**
     * Load cached descriptor from WebStorage
     * @protected
     */
    async restoreCachedDescriptor(directory) {
        this.directory = directory;
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
    async setPlaceholderValue(values) {
        if (!this.placeholderContext)
            throw new Error('PlaceholderContext is not initialized.');
        let placeholderContext = this.placeholderContext;
        placeholderContext.update(values);
        if (!placeholderContext.isResolved)
            return;
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        let descriptor = this.descriptor;
        let unresolvedValueLists = descriptor.unresolved_value_lists;
        let metaBufferFillList = [];
        for (let kernel_order = 0; kernel_order < unresolvedValueLists.length; kernel_order++) {
            let unresolvedValueList = unresolvedValueLists[kernel_order];
            unresolvedValueList.forEach((offset_placeholder) => {
                let resolved_value = placeholderContext.resolve(offset_placeholder.placeholder);
                metaBufferFillList.push(kernel_order, offset_placeholder.offset, resolved_value);
            });
        }
        (await this.getInputViews())
            .filter(view => view.isDynamic)
            .forEach(view => view.setArrayBuffer((new Float32Array(view.length)).buffer));
        (await this.getOutputViews())
            .filter(view => view.isDynamic)
            .forEach(view => view.setArrayBuffer((new Float32Array(view.length)).buffer));
        let dynamicBufferSize = this.placeholderContext.resolve(this.descriptor.memory_layout.dynamic.size);
        await this.setPlaceholderValueWorker(dynamicBufferSize, new Int32Array(metaBufferFillList));
    }
    setPlaceholderValueWorker(dynamicBufferSize, metaBufferFillArray) {
        if (!this.worker)
            throw Error("Worker is not initialized");
        let worker = this.worker;
        return new Promise((resolve, reject) => {
            worker.onmessage = (event) => {
                if (event.data === 0) {
                    resolve();
                }
                else {
                    console.log(event.data);
                    worker.terminate();
                    reject(new Error(event.data));
                }
            };
            worker.postMessage({ type: 'set_dynamic_buffer', size: dynamicBufferSize, data: metaBufferFillArray });
        });
    }
    compile() {
        let worker = new Worker(this.worker_entry_js_path);
        worker.onerror = (event) => {
            console.error(event);
            // console.error('Worker Exception: ' + event.message);
            if (this.worker_promise_reject_func) {
                this.worker_promise_reject_func(event);
            }
            else {
                this.worker_initial_error = event;
            }
        };
        let promise = new Promise((resolve, reject) => {
            // occurs when this.worker_entry_js_path is 404
            if (this.worker_initial_error)
                return reject(this.worker_initial_error);
            this.worker_promise_reject_func = reject;
            worker.onmessage = (event) => {
                if (event.data === 0) {
                    resolve();
                }
                else {
                    console.error(event.data);
                    worker.terminate();
                    reject(new Error(event.data));
                }
            };
        });
        this.worker = worker;
        return promise;
    }
    async loadWeights(weightsData) {
        this.worker = new Worker();
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.worker)
            throw new Error('Worker is not initialized');
        let decoder = get_weight_decoder_1.default(this.descriptor.weight_encoding);
        let weight_data = await decoder.decode(weightsData);
        let worker = this.worker;
        let promise = new Promise((resolve, reject) => {
            this.worker_promise_reject_func = reject;
            worker.onmessage = (event) => {
                if (event.data === 0) {
                    resolve();
                }
                else {
                    console.log(event.data);
                    worker.terminate();
                    reject(new Error(event.data));
                }
            };
            worker.postMessage({ type: 'weight', data: weight_data }, [weight_data.buffer]);
        });
        return promise;
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
            let view = new symbolic_float32array_1.default(allocation, placeholderContext, true);
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
            // buffer for SymbolicFloat32Array is dedicated for IO, since computation is performed on separate memory space.
            let view = new symbolic_float32array_1.default(allocation, placeholderContext, true);
            return view;
        });
        return this.outputViews;
    }
    async run() {
        // if (this._running) throw new Error('Calling another run() while running.');
        if (!this.descriptor)
            throw new Error('Descriptor is not loaded');
        if (!this.inputViews || !this.outputViews)
            throw new Error('getInputViews and getOutputViews must be called prior to run');
        if (!this.worker)
            throw new Error('Worker is not initialized');
        let descriptor = this.descriptor;
        let worker = this.worker;
        let inputViews = this.inputViews;
        let outputViews = this.outputViews;
        let promise = new Promise((resolve, reject) => {
            // TODO: better way not to generate function on every run
            this.worker_promise_reject_func = reject;
            worker.onmessage = (event) => {
                if (Array.isArray(event.data)) {
                    for (let i = 0; i < event.data.length; i++) {
                        outputViews[i].set(event.data[i]);
                    }
                    resolve();
                }
                else {
                    console.log(event.data);
                    worker.terminate();
                    reject(new Error(event.data));
                }
            };
            let allocations = [descriptor.memory_layout.static.allocations, descriptor.memory_layout.dynamic.allocations];
            let inputs = [];
            for (let i = 0; i < descriptor.inputs.length; i++) {
                for (let allocation_space = 0; allocation_space < 2; allocation_space++) {
                    let var_alloc = allocations[allocation_space][descriptor.inputs[i]];
                    if (var_alloc) {
                        let symAb = inputViews[i];
                        inputs.push({
                            space: allocation_space,
                            offset: symAb.offset,
                            size: symAb.length,
                            data: symAb.toActual()
                        });
                        break;
                    }
                }
            }
            let outputs = [];
            for (let i = 0; i < descriptor.outputs.length; i++) {
                for (let allocation_space = 0; allocation_space < 2; allocation_space++) {
                    let var_alloc = allocations[allocation_space][descriptor.outputs[i]];
                    if (var_alloc) {
                        let symAb = outputViews[i];
                        outputs.push({ space: allocation_space, offset: symAb.offset, size: symAb.length });
                        break;
                    }
                }
            }
            worker.postMessage({ type: 'run', inputs: inputs, outputs: outputs });
        });
        return promise;
    }
}
exports.default = DescriptorRunnerWebassembly;
