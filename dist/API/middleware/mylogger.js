"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    console.log('\n::::::authorization::::::');
    console.log(req.headers.authorization);
    console.log('\n::::::req.query::::::');
    console.log(req.query);
    console.log('\n::::::req.body::::::');
    console.log(req.body);
    console.log('\n::::::req.params::::::');
    console.log(req.params);
    console.log('\n::::::req.cookies::::::');
    console.log(req.cookies);
    console.log('\n::::::requested url::::::');
    console.log(req.originalUrl);
    next();
};
