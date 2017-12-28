"use strict";
/**
 * @module webdnn
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
const dispatch_scheduler_1 = require("./util/dispatch_scheduler");
/**
 * @protected
 */
let transformDelegate = url => url;
/**
 * Transform url generated based on current active backend
 * @param url transformed url
 * @protected
 */
function transformUrl(url) {
    return transformDelegate(url);
}
exports.transformUrl = transformUrl;
/**
 * Register delegate function for transform url.
 * @param delegate Delegate function which will be called with original url, and must return converted url strings.
 * @protected
 */
function registerTransformUrlDelegate(delegate) {
    transformDelegate = delegate;
}
exports.registerTransformUrlDelegate = registerTransformUrlDelegate;
/**
 * Fetch function. WebDNN API use this function instead of original `fetch` function.
 * FIXME
 * @param input Requested url
 * @param init Additional information about webdnnFetch
 * @param init.ignoreCache If true, cache is ignored by appending '?t=(timestamp)' to the end of request url.
 * @returns Response
 * @protected
 */
async function webdnnFetch(input, init) {
    if (typeof input == 'string') {
        input = transformUrl(input) + ((init && init.ignoreCache) ? '?t=' + Date.now() : '');
    }
    else {
        input = Object.assign({}, input, {
            url: transformUrl(input.url) + ((init && init.ignoreCache) ? '?t=' + Date.now() : '')
        });
    }
    let res;
    if (typeof input == 'string' && isXHR2WithBlobSupported()) {
        res = await fetchUsingXHR(input, init && init.progressCallback);
    }
    else {
        res = await fetch(input, init);
    }
    if (!res.ok)
        throw new Error(`Fetch returns status code ${res.status}: ${res.statusText}`);
    return res;
}
exports.default = webdnnFetch;
/**
 * Read `Response.body` stream as ArrayBuffer. This function provide progress information by callback.
 * @param res Response object
 * @param callback Callback function.
 * @returns ArrayBuffer
 * @protected
 */
function readArrayBufferProgressively(res, callback) {
    if (!callback || !res.body)
        return res.arrayBuffer();
    let contentLength = res.headers.get('Content-Length');
    if (!contentLength)
        return res.arrayBuffer();
    const total = parseInt(contentLength);
    let buffer = new Uint8Array(total);
    let loaded = 0;
    let reader = res.body.getReader();
    let callbackScheduler = new dispatch_scheduler_1.default();
    function accumulateLoadedSize(chunk) {
        buffer.set(chunk.value, loaded);
        loaded += chunk.value.length;
        if (callback) {
            callbackScheduler.request(() => callback(loaded, total));
        }
        if (loaded == total) {
            callbackScheduler.forceDispatch();
            return buffer.buffer;
        }
        else {
            return reader.read().then(accumulateLoadedSize);
        }
    }
    return reader.read().then(accumulateLoadedSize);
}
exports.readArrayBufferProgressively = readArrayBufferProgressively;
/**
 * check whether XMLHttpRequest with Blob type is supported or not
 * @protected
 */
function isXHR2WithBlobSupported() {
    if (!window.hasOwnProperty('ProgressEvent') || !window.hasOwnProperty('FormData')) {
        return false;
    }
    let xhr = new XMLHttpRequest();
    if (typeof xhr.responseType === 'string') {
        try {
            xhr.responseType = 'blob';
            return xhr.responseType === 'blob';
        }
        catch (e) {
            return false;
        }
    }
    else {
        return false;
    }
}
/**
 * fetch with XMLHttpRequest
 * @protected
 */
function fetchUsingXHR(url, callback) {
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "blob";
        let callbackScheduler = new dispatch_scheduler_1.default();
        req.onload = function (event) {
            callbackScheduler.forceDispatch();
            let res = new Response(req.response);
            resolve(res);
        };
        req.onprogress = function (event) {
            if (callback) {
                callbackScheduler.request(function () { return callback(event.loaded, event.total); });
            }
        };
        req.onerror = function (event) {
            reject(event);
        };
        req.send(null);
    });
}
