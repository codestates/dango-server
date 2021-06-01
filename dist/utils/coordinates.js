"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const solveMapWidth = (arr) => {
    const PI = Math.PI;
    const Radius = 6378.1 * 1000;
    const [from, to] = arr;
    const delta = (Math.abs(from - to) * PI) / 180;
    return delta * Radius;
};
exports.default = solveMapWidth;
// http://www.movable-type.co.uk/scripts/latlong-vincenty.html : for detail
