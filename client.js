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
var Web3 = require('web3').Web3;
var fs = require('fs');
var path = require('path');
var BN = require('bn.js');
var _a = require('./db.ts'), connectDB = _a.connectDB, closeDB = _a.closeDB;
var utils = require('./utils.ts');
var Command = require('commander').Command;
var program = new Command();
require('dotenv').config({ path: './config.env' });
console.log('-------------------- Intellectual property rights management----------------------');
function applyIP() {
    return __awaiter(this, void 0, void 0, function () {
        var rl, address, category, path, name, des, sql, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rl = utils.openReadline();
                    return [4 /*yield*/, utils.ask('Input your address: ', rl)];
                case 1:
                    address = _a.sent();
                    return [4 /*yield*/, utils.ask('Input your category: ', rl)];
                case 2:
                    category = _a.sent();
                    return [4 /*yield*/, utils.ask('Input your IP path: ', rl)];
                case 3:
                    path = _a.sent();
                    return [4 /*yield*/, utils.ask('Input your IP name: ', rl)];
                case 4:
                    name = _a.sent();
                    return [4 /*yield*/, utils.ask('Any describes?: ', rl)];
                case 5:
                    des = _a.sent();
                    sql = 'INSERT INTO waitlist(address,category,filename,name,des) VALUES (?,?,?,?,?)';
                    db = connectDB();
                    db.query(sql, [address, category, path, name, des, function (err, result) {
                            if (err) {
                                console.error('Insert error: ', err);
                                return;
                            }
                        }]);
                    closeDB(db);
                    utils.closeReadline(rl);
                    console.log("Submit to waitlist successfully");
                    return [2 /*return*/];
            }
        });
    });
}
function sell_(id, price, address, privKey) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.sellIP(id, price, address, privKey)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function withdraw_(id, address, privKey) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.withdraw(id, address, privKey)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function transfer_(id, price, address, privKey) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.transfer(id, price, address, privKey)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function leaseIP_(id, price, leaseEndTimestamp, address, privKey) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.leaseIP(id, price, leaseEndTimestamp, address, privKey)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function recycleIP_(id, address, privKey) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.withdraw(id, address, privKey)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function lease_(id, price, address, privKey) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.transfer(id, price, address, privKey)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
function getIP_(id) {
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
function getPrice_(id) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.getPrice(id)];
                case 1:
                    ret = _a.sent();
                    console.log(ret);
                    return [2 /*return*/];
            }
        });
    });
}
program
    .command('applyIP')
    .description('Execute applyIP')
    .action(applyIP);
program
    .command('getIP <id>')
    .description('get IP')
    .action(getIP_);
program
    .command('sell <id> <price> <address> <privKey>')
    .description('sell IP')
    .action(sell_);
program
    .command('withdraw <id> <address> <privKey>')
    .description('withdraw IP')
    .action(withdraw_);
program
    .command('transfer <id> <price> <address> <privKey>')
    .description('transfer IP')
    .action(transfer_);
program
    .command('leaseIP <id> <price> <leaseEndTimestamp> <address> <privKey>')
    .description('lease IP')
    .action(sell_);
program
    .command('recycleIP <id> <address> <privKey>')
    .description('recycle IP')
    .action(withdraw_);
program
    .command('lease <id> <price> <address> <privKey>')
    .description('lease IP')
    .action(lease_);
program
    .command('getPrice <id>')
    .description('buy IP')
    .action(getPrice_);
program.parse(process.argv);
