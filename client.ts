const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
const BN=require('bn.js');
const {creatDB,closeDB}=require('./db.ts');
const {ask,closeReadline}=require('./utils.ts');
const { Command } = require('commander');
const program = new Command();
require('dotenv').config({ path: './db.env' });

const contractAdd=

console.log('-------------------- Intellectual property rights management----------------------')

async function applyIP(){
    const address= await ask('Input your address: ');
    const category= await ask('Input your category: ');
    const path= await ask('Input your IP path: ');
    const name= await ask('Input your IP name: ');
    const des =await ask('Any describes?: ');
    const sql = 'INSERT INTO waitlist(address,category,filename,name,des) VALUES (?,?,?,?,?)';
    let db=creatDB();
    db.query(sql,[address,category,path,name,des,(err,result)=>{
        if (err) {
            console.error('Insert error: ', err);
            return;
        }
    }])
    closeDB(db);
    closeReadline();
    console.log("Submit to waitlist successfully")
}



function test(){
    console.log("Hi");
}
program
    .command('applyIP')
    .description('Execute applyIP')
    .action(applyIP);
program
    .command('test')
    .description('Execute test')
    .action(test);
program.parse(process.argv);
