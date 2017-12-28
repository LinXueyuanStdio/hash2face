"use strict";
/**
 * @module webdnn/image
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Don't Remove This comment block */
/**
 * Load image of specified url
 *
 * @param {string} url the image url
 * @returns {Promise<HTMLImageElement>} image element
 */
async function loadImageByUrl(url) {
    let image = document.createElement('img');
    return new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
    })
        .then(() => image);
}
exports.loadImageByUrl = loadImageByUrl;
/* istanbul ignore next */
/**
 * Load image file selected in `<input type="file">` element.
 *
 * @param {HTMLInputElement} input the `<input type="file">` element
 * @returns {Promise<HTMLImageElement>} image element
 */
async function loadImageFromFileInput(input) {
    let files = input.files;
    if (!files || files.length == 0)
        throw new Error('No file is selected');
    let url = URL.createObjectURL(files[0]);
    return loadImageByUrl(url);
}
exports.loadImageFromFileInput = loadImageFromFileInput;
/* istanbul ignore next */
/**
 * Load image selected in file picker dialog
 *
 * Currently, web specification not supported the case if the dialog is canceled and no file is selected. In this case,
 * the returned promise will never be resolved.
 *
 * @returns {Promise<HTMLImageElement>} image element
 * @protected
 */
async function loadImageByDialog() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    return new Promise((resolve) => {
        input.onchange = () => resolve(loadImageFromFileInput(input));
        input.click();
    });
}
exports.loadImageByDialog = loadImageByDialog;
