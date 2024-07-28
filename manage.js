/**
 * @fileoverview Description of the file's purpose
 * @author Reynor Lou
 * @version 1.1.0
 * @date 2024-7-18
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
var path = require('path');
var BN = require('bn.js');
var Web3 = require('web3').Web3;
var _a = require('./db.ts'), connectDB = _a.connectDB, closeDB = _a.closeDB;
var utils = require('./utils.ts');
var Command = require('commander').Command;
var program = new Command();
require('dotenv').config({ path: './config.env' });
console.log('-------------------- Intellectual property rights management----------------------');
function VerifyIP() {
    return __awaiter(this, void 0, void 0, function () {
        var rl, sql, db, id, ret, result, category, name_1, description, owner, filename, md5, timestamp, receipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("-------------- waitlist----------------");
                    rl = utils.openReadline();
                    sql = 'SELECT * FROM waitlist';
                    db = connectDB();
                    db.query(sql, function (err, result) {
                        if (err) {
                            console.error('Select error: ', err);
                            return;
                        }
                        if (result.length == 0) {
                            console.log("wait list is empty");
                            closeDB(db);
                            utils.closeReadline(rl);
                            return;
                        }
                        console.log(result);
                    });
                    return [4 /*yield*/, utils.ask("Select the id you want to process", rl)];
                case 1:
                    id = _a.sent();
                    return [4 /*yield*/, utils.ask("Do you approve it? (yes/no)", rl)];
                case 2:
                    ret = _a.sent();
                    sql = 'SELECT * FROM waitlist WHERE id=(?)';
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.query(sql, [id], function (err, result) {
                                if (err) {
                                    console.error('Select error: ', err);
                                    reject(err);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        })];
                case 3:
                    result = _a.sent();
                    if (!(ret == "yes")) return [3 /*break*/, 5];
                    category = result[0]['category'];
                    name_1 = result[0]['name'];
                    description = result[0]['des'];
                    owner = result[0]['address'];
                    filename = result[0]["filename"];
                    md5 = utils.getMD5(filename);
                    timestamp = Math.floor(Date.now() / 1000);
                    return [4 /*yield*/, utils.registerIP(category, name_1, description, owner, md5, timestamp)];
                case 4:
                    receipt = _a.sent();
                    console.log(receipt);
                    // const event = receipt.events.IPRegistered;
                    //const IP_id=event.returnValeus.id;
                    // sql = 'INSERT INTO IP(IP_id,category,name,description,owner,lessee,md5,timestamp) VALUES (?,?,?,?,?,?,?,?)';
                    // db.query(sql,[IP_id,category,path,name,description,owner,owner,md5,timestamp,(err,result)=>{
                    //     if (err) {
                    //         console.error('Insert error: ', err);
                    //         return;
                    //     }
                    // }])
                    sql = 'delete FROM waitlist WHERE id=(?)';
                    db.query(sql, [id], function (err, result) {
                        if (err) {
                            console.error('Select error: ', err);
                        }
                    });
                    return [3 /*break*/, 6];
                case 5:
                    if (ret == "no") {
                        sql = 'delete FROM waitlist WHERE id=(?)';
                        db.query(sql, [id], function (err, result) {
                            if (err) {
                                console.error('Select error: ', err);
                            }
                        });
                        console.log("process successfully");
                    }
                    _a.label = 6;
                case 6:
                    closeDB(db);
                    utils.closeReadline(rl);
                    return [2 /*return*/];
            }
        });
    });
}
function getManagerIP_(id) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.getIP(id)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function setTransaction_(address) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.setTransaction(address)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function setIPCore_(address) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.setIPCore(address)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function invalidIP_(id) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.invalidateIP(id)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function restoreIP_(id) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.restoreIP(id)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function getBalance_() {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.getBalance()];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function payContract_(ETH) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.payContract(ETH)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
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
