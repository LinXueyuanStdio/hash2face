"use strict";
/**
 * @module webdnn/image
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Don't Remove This comment block */
/**
 * The data order
 */
var Order;
(function (Order) {
    /** `[Channel, Height, Width]` format */
    Order[Order["CHW"] = 0] = "CHW";
    /** `[Height, Width, Channel]` format */
    Order[Order["HWC"] = 1] = "HWC";
})(Order = exports.Order || (exports.Order = {}));
/**
 * The color format
 */
var Color;
(function (Color) {
    /** RGB format */
    Color[Color["RGB"] = 0] = "RGB";
    /** BGR format */
    Color[Color["BGR"] = 1] = "BGR";
    /** grey scale */
    Color[Color["GREY"] = 2] = "GREY";
})(Color = exports.Color || (exports.Color = {}));
