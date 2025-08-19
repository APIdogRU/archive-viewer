const { exec } = require('child_process');

function open(target) {
    let opener;

    switch (process.platform) {
        case 'darwin':
            opener = 'open';
            break;

        case 'win32':
            opener = 'start ""';
            break;

        default:
            opener = 'xdg-open';
            break;
    }

    return new Promise((resolve, reject) => {
        exec(`${opener} "${escape(target)}"`, err =>{
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

function escape(s) {
    return s.replace(/"/, '\\\"');
}

module.exports = { open };
