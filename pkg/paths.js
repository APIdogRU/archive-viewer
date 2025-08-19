const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATIC = path.resolve(ROOT, 'dist');

module.exports = {
    ROOT,
    STATIC,
};
