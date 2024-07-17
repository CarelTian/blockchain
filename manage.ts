const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');
const BN=require('bn.js');
const {creatDB,closeDB}=require('./db.ts');
const {ask,closeReadline,getMD5}=require('./utils.ts');
const { Command } = require('commander');
const program = new Command();
require('dotenv').config({ path: './db.env' });

const contractAdd=

console.log('-------------------- Intellectual property rights management----------------------')

async function VerifyIP(){
    console.log("-------------- waitlist----------------");
    let sql = 'SELECT * FROM waitlist';
    let db=creatDB();
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('Select error: ', err);
            return;
        }
        console.log(result);
    });
    const id= await ask("Select the id you want to process");
    const ret= await ask("Do you approve it? (yes/no)");
    sql = 'SELECT * FROM waitlist WHERE id=(?)';
    db.query(sql,[id],(err,result)=>{
        if (err) {
            console.error('Select error: ', err);
            return;
        }
        if(ret=="yes"){
            const filename=result[0]["filename"];
            const md5=getMD5(filename);
            const timestamp = Math.floor(Date.now() / 1000);
            
        }

    });


    closeDB(db);
    closeReadline();
}
function MD5(filepath){
    console.log(getMD5(filepath));
}

function test(){
    console.log("Hi");
}
program
    .command('VerifyIP')
    .description('Execute VerifyIP')
    .action(VerifyIP);
program
    .command('test')
    .description('Execute test')
    .action(test);
program
    .command('md5')
    .description('Execute test')
program.parse(process.argv);
