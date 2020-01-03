"use strict";
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
        while (_) try {
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var definitions_1 = require("./utils/definitions");
var regexes_1 = __importDefault(require("./utils/regexes"));
exports.Descriptions = {
    date: 'Please specify the date of the election.',
    type: 'election type',
};
var Config = /** @class */ (function () {
    /*
    Private class called from main.js
    Generates new Configuration object to set to this.election
    */
    function Config(data, argsInfo) {
        if (data === void 0) { data = {}; }
        for (var property in data) {
            if (!data.hasOwnProperty(property))
                continue;
            this["_" + property] = data[property];
        }
        for (var property in argsInfo) {
            if (!argsInfo.hasOwnProperty(property))
                continue;
            this[property] = argsInfo[property];
        }
        this.server = argsInfo.server;
        this.Search = argsInfo.Search;
        this.Output = argsInfo.Output;
    }
    Object.defineProperty(Config.prototype, "date", {
        get: function () {
            var _this = this;
            if (this._date)
                return this._date;
            return this._date = (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Output.response({
                                "description": ""
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "system", {
        get: function () {
            var _this = this;
            if (this._system)
                return this._system;
            return this._system = (function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = Object.keys(definitions_1.Systems);
                            return [4 /*yield*/, this.Output.choose({
                                    "type": "electoral system",
                                    "options": Object.values(definitions_1.Systems)
                                })];
                        case 1: return [2 /*return*/, _a[_b.sent()]];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "type", {
        get: function () {
            var _this = this;
            if (this._type)
                return this._type;
            return this._type = (function () { return __awaiter(_this, void 0, void 0, function () {
                var options, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = ["server", "channel"];
                            _a = options;
                            return [4 /*yield*/, this.Output.choose({
                                    options: options,
                                    "type": ""
                                })];
                        case 1: return [2 /*return*/, _a[_b.sent()]];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "elections", {
        get: function () {
            var _this = this;
            if (this._elections)
                return this._elections;
            return this._elections = (function () { return __awaiter(_this, void 0, void 0, function () {
                var error, description, _channels, channels, i, channel, collection, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.type];
                        case 1:
                            if ((_a.sent()) === "server")
                                return [2 /*return*/, this._elections = {
                                        "server": {
                                            "voters": {},
                                            "candidates": {}
                                        }
                                    }];
                            return [4 /*yield*/, this.type];
                        case 2:
                            if (!((_a.sent()) === "channel")) return [3 /*break*/, 9];
                            error = true;
                            _a.label = 3;
                        case 3:
                            if (!error) return [3 /*break*/, 9];
                            if (!(typeof error === "string")) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.Output.onError(error)];
                        case 4:
                            (_a.sent()).delete(30000);
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            description = "Please list the channels or categories containing the channels to hold elections, separated by spaces.";
                            return [4 /*yield*/, this.Output.response({
                                    description: description
                                })];
                        case 6:
                            _channels = (_a.sent())
                                .split(/\s| /g);
                            channels = _channels.map(function (channel) { return _this.Search.channels.get(channel); });
                            for (i = 0; i < channels.length; i++) { //error handling
                                channel = channels[i];
                                if (!channel)
                                    throw "Couldn't find channel **" + _channels[i] + "**.";
                                if (channel.children) { //deal with channel categories
                                    collection = Array.from(channel.children.values());
                                    channels.splice.apply(//get the array of category
                                    channels, __spreadArrays([i, 1], collection)); //exchange the channel in the array with the arrays from the category
                                }
                            }
                            channels = channels.map(function (channel) { return channel.name; });
                            if (channels.length === 0)
                                throw "No applicable channels given.";
                            if (channels.length > 25)
                                throw "Maximum number of elections that can be held at once is 25.";
                            error = false;
                            return [2 /*return*/, this._elections = channels.reduce(function (acc, curr) {
                                    if (typeof curr === "string")
                                        acc[curr] = {
                                            "voters": {},
                                            "candidates": {},
                                        };
                                    return acc;
                                }, {})];
                        case 7:
                            e_1 = _a.sent();
                            if (typeof e_1 === "string")
                                error = e_1;
                            else
                                this.Output.onError(e_1);
                            return [3 /*break*/, 8];
                        case 8: return [3 /*break*/, 3];
                        case 9: return [2 /*return*/];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "criteria", {
        get: function () {
            var _this = this;
            if (this._criteria)
                return this._criteria;
            return this._criteria = (function () { return __awaiter(_this, void 0, void 0, function () {
                var type, criteria, options, index, roleindex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            type = "method of obtaining list of eligible voters.", criteria = ["Everyone in the server", "role", "From all who can see channel " + this.channel];
                            options = [
                                "All server members can vote in this election.",
                                this.type === "channel" ? "There is a role corresponding to the list of eligible voters." : "There are roles corresponding to each channel.",
                                "Everyone who can see the current channel can vote in it."
                            ];
                            return [4 /*yield*/, this.Output.choose({
                                    options: options,
                                    type: type
                                })];
                        case 1:
                            index = _a.sent();
                            if (this.type === "server" || index !== 1)
                                return [2 /*return*/, this._criteria = criteria[index]];
                            return [4 /*yield*/, this.Output.choose({
                                    "options": [
                                        "The role names are identical to the channel names.",
                                        "Let me choose them each time."
                                    ],
                                    "description": "How do these roles correspond to the channels?"
                                })];
                        case 2:
                            roleindex = _a.sent();
                            return [2 /*return*/, ["role-identical", "role-choose"][roleindex]];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "inactives", {
        get: function () {
            var _this = this;
            if (this._inactives)
                return this._inactives;
            return this._inactives = (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Output.confirm({
                                "description": "Allow inactive server members to vote?"
                            }, true)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "dupes", {
        get: function () {
            var _this = this;
            if (this._dupes)
                return this._dupes;
            if (!this.server.roles.dupe)
                return this._dupes = true;
            return this._dupes = (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Output.confirm({
                                "description": "Allow dupe accounts to vote?"
                            }, true)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "messages", {
        get: function () {
            var _this = this;
            if (this._messages)
                return this._messages;
            return this._messages = (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Output.response({
                                "description": "Minimum threshold of messages sent in server to vote (return `0` for any):",
                                "number": true
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "sponsors", {
        get: function () {
            var _this = this;
            if (this._sponsors)
                return this._sponsors;
            return this._sponsors = (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Output.response({
                                "description": "Minimum threshold of sponsors for a candidate to be listed on the ballot\n(return `0` for any; max `20`):",
                                "number": true,
                                "filter": function (m) { return Number(m.content) <= 20; }
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "limit", {
        get: function () {
            var _this = this;
            if (this._limit)
                return this._limit;
            return this._limit = (function () { return __awaiter(_this, void 0, void 0, function () {
                var elections, _a, _b, limit;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = Object).keys;
                            return [4 /*yield*/, this.elections];
                        case 1:
                            elections = _b.apply(_a, [_c.sent()]);
                            if (elections.length === 1)
                                return [2 /*return*/, 1];
                            return [4 /*yield*/, this.Output.response({
                                    "description": "Maximum number of elections permitted to run for\n(return '0' for any; max `" + elections.length + "`):",
                                    "number": true,
                                    "filter": function (m) { return Number(m.content) <= elections.length && 0 <= Number(m.content); }
                                })];
                        case 2:
                            limit = _c.sent();
                            if (limit === 0)
                                limit = elections.length;
                            return [2 /*return*/, limit];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "role", {
        get: function () {
            var _this = this;
            if (this._role)
                return this._role;
            return this._role = (function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, obj, _c, _d, _i, channel, response, _e, _f, _g, _h, role, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0:
                            _b = (_a = regexes_1.default.role).test;
                            return [4 /*yield*/, this.criteria];
                        case 1:
                            if (!_b.apply(_a, [_o.sent()])) return [3 /*break*/, 12];
                            obj = {};
                            _c = [];
                            return [4 /*yield*/, this.elections];
                        case 2:
                            for (_d in _o.sent())
                                _c.push(_d);
                            _i = 0;
                            _o.label = 3;
                        case 3:
                            if (!(_i < _c.length)) return [3 /*break*/, 11];
                            channel = _c[_i];
                            if (!this.elections.hasOwnProperty(channel))
                                return [3 /*break*/, 10];
                            _f = (_e = this.Output).response;
                            _g = {};
                            _h = "description";
                            return [4 /*yield*/, this.criteria];
                        case 4: return [4 /*yield*/, _f.apply(_e, [(_g[_h] = (_o.sent()) === "role-choose" ? "Please write the name of the role for channel **" + channel + "**." : "Please write the name of the role for the list of eligible voters.",
                                    _g)])];
                        case 5:
                            response = _o.sent();
                            role = this.Search.roles.get(response);
                            _o.label = 6;
                        case 6:
                            if (!!role) return [3 /*break*/, 9];
                            this.Output.onError("Couldn't find role " + response + ".");
                            _k = (_j = this.Output).response;
                            _l = {};
                            _m = "description";
                            return [4 /*yield*/, this.criteria];
                        case 7: return [4 /*yield*/, _k.apply(_j, [(_l[_m] = (_o.sent()) === "role-choose" ? "Please write the name of the role for channel **" + channel + "**." : "Please write the name of the role for the list of eligible voters.",
                                    _l)])];
                        case 8:
                            response = _o.sent();
                            role = this.Search.roles.get(response);
                            return [3 /*break*/, 6];
                        case 9:
                            obj[channel] = response;
                            _o.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 3];
                        case 11: return [2 /*return*/, obj];
                        case 12: return [2 /*return*/, undefined];
                    }
                });
            }); })();
        },
        enumerable: true,
        configurable: true
    });
    return Config;
}());
exports.default = Config;
module.exports = Config;
