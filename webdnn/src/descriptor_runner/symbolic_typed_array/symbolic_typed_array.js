"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @protected
 */
function flatten(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        let v = arr[i];
        if (v instanceof Array) {
            result.splice(result.length, 0, flatten(v));
        }
        else {
            result[result.length] = v;
        }
    }
    return result;
}
/**
 * SymbolicTypedArray is wrapper class of buffers used in DNN model.
 */
class SymbolicTypedArray {
    /**
     * toActual:
     *
     * If this buffer view is initialized based on placeholder offset or size and the placeholder is not resolved,
     * the error is thrown.
     */
    /**
     * @param {Allocation} allocation
     * @param {PlaceholderContext} placeholderContext
     * @param {boolean} ignoreOffsetOnActual
     * @protected
     */
    constructor(allocation, placeholderContext, ignoreOffsetOnActual = false) {
        this.ignoreOffsetOnActual = ignoreOffsetOnActual;
        this.allocation = allocation;
        if (this.isDynamic) {
            if (!placeholderContext) {
                throw Error('PlaceholderContext must be required when SymbolicTypedArray is initialized as dynamic buffer view.');
            }
        }
        this.placeholderContext = placeholderContext;
    }
    /**
     * @protected
     */
    setArrayBuffer(arrayBuffer) {
        this.arrayBuffer = arrayBuffer;
    }
    /**
     * @protected
     */
    get name() {
        return this.allocation.name;
    }
    /**
     * @protected
     */
    get isDynamic() {
        return (typeof this.allocation.offset !== 'number' || typeof this.allocation.size !== 'number');
    }
    /**
     * @protected
     */
    get offset() {
        //TODO
        if (this.isDynamic) {
            return this.placeholderContext.resolve(this.allocation.offset);
        }
        else {
            return this.allocation.offset;
        }
    }
    /**
     * The number of elements in this buffer. Actual byte size is `(length * SIZE_OF_FLOAT)`.
     */
    get length() {
        if (this.isDynamic) {
            return this.placeholderContext.resolve(this.allocation.size);
        }
        else {
            return this.allocation.size;
        }
    }
    /**
     * Sets a value or an array of values.
     *
     * @param array A typed or untyped array of values to set.
     * @param offset The index at which the values will be written.
     */
    set(array, offset) {
        return this.toActual().set(flatten(array), offset);
    }
}
exports.SymbolicTypedArray = SymbolicTypedArray;
