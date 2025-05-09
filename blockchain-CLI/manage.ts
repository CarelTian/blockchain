/**
 * @fileoverview Description of the file's purpose
 * @author Reynor Lou
 * @version 1.1.0
 * @date 2024-7-18
 */

const fs = require('fs');
const path = require('path');
const BN=require('bn.js');
const {Web3} = require('web3');
const {connectDB,closeDB}=require('./db.ts');
const utils=require('./utils.ts');
const { Command } = require('commander');
const program = new Command();
require('dotenv').config({ path: './config.env' });

console.log('-------------------- Intellectual property rights management----------------------')

async function VerifyIP(){
    console.log("-------------- waitlist----------------");
    const rl=utils.openReadline();
    let sql = 'SELECT * FROM waitlist';
    let db=connectDB();
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('Select error: ', err);
            return;
        }
        if(result.length==0){
            console.log("wait list is empty");
            closeDB(db);
            utils.closeReadline(rl);
            return;
        }
        console.log(result);
    });
    const id= await utils.ask("Select the id you want to process",rl);
    const ret= await utils.ask("Do you approve it? (yes/no)",rl);
    sql = 'SELECT * FROM waitlist WHERE id=(?)';
    const result = await new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Select error: ', err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
    if(ret=="yes"){
        const category=result[0]['category'];
        const name=result[0]['name'];
        const description=result[0]['des'];
        const owner=result[0]['address'];
        const filename=result[0]["filename"];
        //7.29 update
       // const md5=utils.getMD5(filename);
        const md5=result[0]["md5"];
        const timestamp = Math.floor(Date.now() / 1000);
        let receipt=await utils.registerIP(category,name,description,owner,md5,timestamp);
        console.log(receipt);
    //    const event = receipt.events.IPRegistered;
    //     const IP_id=event.returnValeus.id;
        sql = 'INSERT INTO IP(IP_id,category,path,name,description,owner,lessee,md5,timestamp) VALUES (?,?,?,?,?,?,?,?,?)';
        db.query(sql,[id,category,filename,name,description,owner,owner,md5,timestamp,(err,result)=>{
            if (err) {
                console.error('Insert error: ', err);
                return;
            }
        }])
        sql = 'delete FROM waitlist WHERE id=(?)'
        db.query(sql,[id],(err,result)=>{
            if (err) {
                console.error('Select error: ', err);
            }
        });
    }else if(ret=="no"){
        sql = 'delete FROM waitlist WHERE id=(?)'
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Select error: ', err);
            }
        });
        console.log("process successfully");
    }
    closeDB(db);
    utils.closeReadline(rl);
}

async function getManagerIP_(id) {
    const ret=await utils.getIP(id);
    console.log(ret);
}

async function setTransaction_(address) {
    const ret=await utils.setTransaction(address);
    console.log(ret);
}
async function setIPCore_(address) {
     const ret =await utils.setIPCore(address);
    console.log(ret);
}

async function invalidIP_(id) {
    const ret=await utils.invalidateIP(id);
    console.log(ret);
}

async function restoreIP_(id) {
    const ret=await utils.restoreIP(id);
    console.log(ret);
}

async function getBalance_() {
    const ret=await utils.getBalance();
    console.log(ret);
}

async function payContract_(ETH) {
    const ret=await utils.payContract(ETH);
    console.log(ret);
}

program
    .command('verifyIP')
    .description('Execute VerifyIP')
    .action(VerifyIP);
program
    .command('getIP <id>')
    .description('Execute GetIP')
    .action(getManagerIP_);
program
    .command('setTxAddress <address>')
    .description('Set transaction contract Address for IPcore contract')
    .action(setTransaction_);
program
    .command('invalidateIP <id>')
    .description('invalidate an IP that can not be transfered')
    .action(invalidIP_);
program
    .command('restoreIP <id>')
    .description('retore an IP')
    .action(restoreIP_);
program
    .command('setCoreAddress <address>')
    .description('Set IPcore address for transaction contract')
    .action(setIPCore_);
program
    .command('getBalance')
    .description('get balance of contract')
    .action(getBalance_);
program
    .command('payContract <ETH>')
    .description('pay to contract')
    .action(payContract_);
program.parse(process.argv);
