"use strict";
/**
 * @module webdnn/math
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Return indices of the top-K largest elements.
* This implementation is not stable sort.
*
* @param {number[]|Float32Array|Int32Array} arr array
* @param {number} k number of indices
* @returns {number[]} indices of top-K largest samples
*/
function argmax(arr, k = 1) {
    // Top-k Quicksort
    arr = arr.slice();
    let stack = [[0, arr.length]];
    let workspace = [];
    for (let i = 0; i < arr.length; i++)
        workspace[i] = i;
    while (stack.length > 0) {
        let [from, to] = stack.pop(), pivot = arr[to - 1], left = from, right = to - 2, tmp;
        if (from >= to - 1)
            continue;
        while (true) {
            while (arr[left] > pivot && left <= right)
                left++;
            while (arr[right] <= pivot && left <= right)
                right--;
            if (left >= right)
                break;
            tmp = arr[left];
            arr[left] = arr[right];
            arr[right] = tmp;
            tmp = workspace[left];
            workspace[left] = workspace[right];
            workspace[right] = tmp;
        }
        arr[to - 1] = arr[left];
        arr[left] = pivot;
        tmp = workspace[to - 1];
        workspace[to - 1] = workspace[left];
        workspace[left] = tmp;
        // If partial segment contains top-K elements, append it into stack
        stack.push([from, left]); // left (=larger) segment always contains top-K elements
        if (left + 1 < k)
            stack.push([left + 1, to]);
    }
    let result = [];
    for (let i = 0; i < k; i++)
        result.push(workspace[i]);
    return result;
}
exports.argmax = argmax;
/**
 * Return indices of the top-K smallest elements.
 * This implementation is not stable sort.
 *
 * @param {number[]|Float32Array|Int32Array} arr array
 * @param {number} k number of indices
 * @returns {number[]} indices of top-K smallest samples
 */
function argmin(arr, k = 1) {
    // Top-k Quicksort
    arr = arr.slice();
    let stack = [[0, arr.length]];
    let workspace = [];
    for (let i = 0; i < arr.length; i++)
        workspace[i] = i;
    while (stack.length > 0) {
        let [from, to] = stack.pop(), pivot = arr[to - 1], left = from, right = to - 2, tmp;
        if (from >= to - 1)
            continue;
        while (true) {
            while (arr[left] < pivot && left <= right)
                left++;
            while (arr[right] >= pivot && left <= right)
                right--;
            if (left >= right)
                break;
            tmp = arr[left];
            arr[left] = arr[right];
            arr[right] = tmp;
            tmp = workspace[left];
            workspace[left] = workspace[right];
            workspace[right] = tmp;
        }
        arr[to - 1] = arr[left];
        arr[left] = pivot;
        tmp = workspace[to - 1];
        workspace[to - 1] = workspace[left];
        workspace[left] = tmp;
        // If partial segment contains top-K elements, append it into stack
        stack.push([from, left]); // left (=larger) segment always contains top-K elements
        if (left + 1 < k)
            stack.push([left + 1, to]);
    }
    let result = [];
    for (let i = 0; i < k; i++)
        result.push(workspace[i]);
    return result;
}
exports.argmin = argmin;
