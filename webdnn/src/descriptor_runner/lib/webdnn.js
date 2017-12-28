"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const descriptor_runner_fallback_1 = require("./descriptor_runner/descriptor_runner_fallback");
const descriptor_runner_webassembly_1 = require("./descriptor_runner/descriptor_runner_webassembly");
const descriptor_runner_webgl_1 = require("./descriptor_runner/descriptor_runner_webgl");
const descriptor_runner_webgpu_1 = require("./descriptor_runner/descriptor_runner_webgpu");
const fetch_1 = require("./fetch");
const Image = require("./image");
exports.Image = Image;
const Math = require("./math");
exports.Math = Math;
/**
 * DEBUG flag for developing WebDNN
 * @private
 */
let configurations = {};
/**
 * get configuration
 * @private
 */
function getConfiguration(key, defaultValue) {
    return key in configurations ? configurations[key] : defaultValue;
}
exports.getConfiguration = getConfiguration;
/**
 * set configuration
 * @private
 */
function setConfiguration(key, value) {
    configurations[key] = value;
}
exports.setConfiguration = setConfiguration;
/**
 * Backend constructor map
 * @private
 */
const descriptorRunners = {
    webgpu: descriptor_runner_webgpu_1.default,
    webgl: descriptor_runner_webgl_1.default,
    webassembly: descriptor_runner_webassembly_1.default,
    fallback: descriptor_runner_fallback_1.default
};
/**
 * Check each computing backend is available or not in this browser.
 * The result will be returned as [[BackendAvailability|`BackendAvailability`]] structure.
 *
 * @returns backend availability
 */
function getBackendAvailability() {
    let status = {
        'webgpu': descriptorRunners['webgpu'].checkAvailability(),
        'webgl': descriptorRunners['webgl'].checkAvailability(),
        'webassembly': descriptorRunners['webassembly'].checkAvailability(),
        'fallback': descriptorRunners['fallback'].checkAvailability(),
    };
    let order = [
        'webgpu', 'webgl', 'webassembly',
        'fallback'
    ].filter(backend => status[backend]);
    return {
        status: status,
        defaultOrder: order
    };
}
exports.getBackendAvailability = getBackendAvailability;
/**
 * Initialize specified backend
 * @private
 */
async function initBackend(backendName, option) {
    if (!(backendName in descriptorRunners))
        throw new Error(`Unknown backend: "${backendName}"`);
    let runner;
    try {
        runner = new descriptorRunners[backendName](option);
        await runner.init();
    }
    catch (ex) {
        console.warn(`Failed to initialize ${backendName} backend: ${ex}`);
        return null;
    }
    return runner;
}
/**
 * Initialize descriptor runner. This function performs follow things.
 *
 * 1. Try to initialize computing backend. WebDNN will try to initialize each backend in order of
 *    the result of [[getBackendAvailability|`getBackendAvailability`]].
 *    If you want to modify this order, specify [[InitOption.backendOrder|`initOption.backendOrder`]] option.
 *
 * 2. Load model data based on initialized backend. Generally, DNN binary data is very large and it takes long time to load.
 *    [[InitOption.progressCallback|`initOption.progressCallback`]] option provides the progress status of loading.
 *
 * ### Examples
 *
 * - Basic usage
 *
 *   ```js
 *   let runner = await WebDNN.load('./model');
 *   ```
 *
 * - With `initOption.progressCallback` option
 *
 *   ```js
 *   let runner = await WebDNN.load('./model', {
 *       progressCallback: (loaded, total) => console.log(`${ (loaded/total*100).toFixed(1) }% Loaded`);
 *   });
 *   ```
 *
 * @param directory URL of directory that contains graph descriptor files (e.g. graph_webgpu.json)
 * @param initOption Initialize option
 * @return DescriptorRunner instance, which is the interface to input/output data and run the model.
 */
async function load(directory, initOption = {}) {
    let { backendOrder = null, backendOptions = {}, cacheStrategy = 'latest', saveCache = true, progressCallback, weightDirectory, transformUrlDelegate } = initOption;
    if (!backendOrder)
        backendOrder = getBackendAvailability().defaultOrder;
    if (typeof backendOrder === 'string')
        backendOrder = [backendOrder];
    backendOrder = backendOrder.slice();
    if (backendOrder.indexOf('fallback') === -1)
        backendOrder.concat(['fallback']);
    fetch_1.registerTransformUrlDelegate((url) => {
        if (weightDirectory) {
            if ((/\.bin/).test(url)) {
                url = url.replace(directory, weightDirectory);
            }
        }
        if (transformUrlDelegate)
            url = transformUrlDelegate(url);
        return url;
    });
    while (backendOrder.length > 0) {
        let backendName = backendOrder.shift();
        let runner = await initBackend(backendName, backendOptions[backendName]);
        if (!runner)
            continue;
        try {
            let descriptor;
            let parameters;
            let fetchedDescriptor;
            let cachedDescriptor;
            switch (cacheStrategy) {
                case 'latest':
                    fetchedDescriptor = await runner.fetchDescriptor(directory).catch(() => null);
                    cachedDescriptor = await runner.restoreCachedDescriptor(directory);
                    if (cachedDescriptor && fetchedDescriptor && cachedDescriptor.converted_at === fetchedDescriptor.converted_at) {
                        descriptor = cachedDescriptor;
                        parameters = await runner.restoreCachedParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                    if (fetchedDescriptor) {
                        descriptor = fetchedDescriptor;
                        parameters = await runner.fetchParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                    if (cachedDescriptor) {
                        descriptor = cachedDescriptor;
                        parameters = await runner.restoreCachedParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                    throw Error('Network error is occurred and no cache is exist.');
                case 'networkOnly':
                    fetchedDescriptor = await runner.fetchDescriptor(directory).catch(() => null);
                    if (fetchedDescriptor) {
                        descriptor = fetchedDescriptor;
                        parameters = await runner.fetchParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                case 'networkFirst':
                    fetchedDescriptor = await runner.fetchDescriptor(directory).catch(() => null);
                    if (fetchedDescriptor) {
                        descriptor = fetchedDescriptor;
                        parameters = await runner.fetchParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                    if (cacheStrategy === 'networkOnly')
                        throw Error('Network error is occurred in "networkOnly" cache strategy');
                    cachedDescriptor = await runner.restoreCachedDescriptor(directory);
                    if (cachedDescriptor) {
                        descriptor = cachedDescriptor;
                        parameters = await runner.restoreCachedParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                    throw Error('Network error is occurred and no cache is exist.');
                case 'cacheOnly':
                case 'cacheFirst':
                    cachedDescriptor = await runner.restoreCachedDescriptor(directory);
                    if (cachedDescriptor) {
                        descriptor = cachedDescriptor;
                        parameters = await runner.restoreCachedParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                    if (cacheStrategy === 'cacheOnly')
                        throw Error('No cache is exist in "cacheOnly" cache strategy');
                    fetchedDescriptor = await runner.fetchDescriptor(directory).catch(() => null);
                    if (fetchedDescriptor) {
                        descriptor = fetchedDescriptor;
                        parameters = await runner.fetchParameters(directory, progressCallback);
                        if (parameters)
                            break;
                    }
                    throw Error('Network error is occurred and no cache is exist.');
                default:
                    throw Error(`"${cacheStrategy}" is not valid cache strategy name: "latest", "networkFirst", "networkOnly", "cacheFirst", "cacheOnly" is available.`);
            }
            await runner.setDescriptorAndParameters(descriptor, parameters);
            if (saveCache) {
                try {
                    await runner.saveCache(directory, descriptor, parameters);
                }
                catch (e) {
                    /* do nothing */
                }
            }
        }
        catch (ex) {
            console.warn(`Model loading failed for ${backendName} backend. Trying next backend: ${ex.message}`);
            continue;
        }
        return runner;
    }
    throw new Error('No backend is available');
}
exports.load = load;
