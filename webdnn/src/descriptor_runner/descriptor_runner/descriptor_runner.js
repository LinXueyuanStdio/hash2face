"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `DescriptorRunner` provides interface to execute DNN model and access input and output buffers.
 */
class DescriptorRunner {
    constructor() {
        /**
         * For Developer:
         *
         * `DescriptorRunner` executes computation based on `GraphDescriptor`.
         *
         * Typically, DescriptorRunner takes 3 steps to execute DNN model.
         *
         * 1. Initialize static configurations
         *
         *    Initialize things independent from runtime configuration.
         *
         *      - `init()`
         *      - `load()`
         *
         * 2. Initialize dynamic configurations
         *
         *    Initialize things depend on runtime configuration such as batch size, input image size, etc.
         *
         *      - `setPlaceholderValue()`
         *      - `getInputViews()`
         *      - `getOutputViews()`
         *
         * 3. Execute the model
         *
         *      - `run()`
         *
         * You need to do step 1 and 2 only once. We recommend to call `WebDNN.prepareAll()` instead
         * to call `GraphDescriptor#load()` directly. In that method, all procedures in step 1 and 2 are performed.
         */
        /**
         * descriptor
         * @type {null}
         */
        this.descriptor = null;
    }
    /**
     * Return `true` if this backend is available in this environment.
     * @returns {boolean}
     */
    static checkAvailability() {
        return false;
    }
}
exports.DescriptorRunner = DescriptorRunner;
