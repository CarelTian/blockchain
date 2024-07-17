const readline = require('readline');
const crypto = require('crypto');
const fs = require('fs');

async function registerIP(category,name,description,owner,md5,timestam){
    
}





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

function getMD5(filepath){
    const data = fs.readFileSync(filepath);
    const hash = crypto.createHash('md5').update(data).digest('hex');
    return hash;
}
module.exports = { ask, closeReadline,getMD5 };
