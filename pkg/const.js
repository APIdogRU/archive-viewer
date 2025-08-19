const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const tokenPath = path.resolve(cwd, 'token.txt');

if (!fs.existsSync(tokenPath)) {
    throw new Error(`Expected file ${tokenPath} to exists and contains valid token`);
}

const accessToken = fs.readFileSync(tokenPath, 'utf-8').trim();

module.exports = {
    accessToken,
};
