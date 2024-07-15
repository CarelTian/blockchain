const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(query) {
    return new Promise(resolve => rl.question(query + '\n', resolve));
}

function closeReadline() {
    rl.close();
}


module.exports = { ask, closeReadline };
