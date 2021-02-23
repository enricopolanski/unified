"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: better types
exports.default = (o) => {
    let u = o;
    return (u !== null &&
        u.constructor !== null &&
        typeof u.constructor.isBuffer === 'function' &&
        u.constructor.isBuffer(u));
};
