"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Main = require('./main');
var Voters = /** @class */ (function (_super) {
    __extends(Voters, _super);
    function Voters() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Voters.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var election_1, instance, _a, _b, array, e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        election_1 = this.election, instance = void 0;
                        return [4 /*yield*/, this.Permissions.state('election.register', this)];
                    case 1:
                        _a = (_c.sent());
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.Permissions.state('election.voting', this)];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        if (!(_a))
                            throw 'Registering for voters has not yet begun on server ' + this.guild.name + '.';
                        _b = this.channel.name !== this.server.channels.bot;
                        if (!_b) return [3 /*break*/, 5];
                        return [4 /*yield*/, !this.Permissions.role('owner', this)];
                    case 4:
                        _b = (_c.sent());
                        _c.label = 5;
                    case 5:
                        if (_b)
                            throw 'Wrong channel to use this command. Requires: #spam channel.';
                        if (!Object.keys(election_1.elections).length === 0)
                            throw 'No elections registered. Use `' + this.server.prefixes.generic + 'election config` to register a new election.';
                        if (!(this.args.length === 2)) return [3 /*break*/, 6];
                        if (!election_1.elections.hasOwnProperty(this.args[1]))
                            throw 'Couldn\'t find matching election from name **' + this.args[1] + '**.';
                        instance = this.args[1];
                        return [3 /*break*/, 10];
                    case 6:
                        if (!(Object.keys(election_1.elections).length === 1)) return [3 /*break*/, 7];
                        instance = Object.keys(election_1.elections)[0];
                        return [3 /*break*/, 10];
                    case 7:
                        if (!(election_1.type === 'channel')) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.Output.response({
                                description: 'Please state the election for which you would like to view the voting list.',
                                filter: function (m) { return election_1.elections.hasOwnProperty(m.content); }
                            })];
                    case 8:
                        instance = _c.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        instance = '';
                        _c.label = 10;
                    case 10:
                        if (!instance)
                            throw 'Couldn\'t find matching election. Use `' + this.server.prefixes.generic + 'election config` to configure elections.';
                        array = Object.keys(election_1.elections[instance].voters);
                        this.Output.sender(new Embed()
                            .setTitle("Eligble voters for election " + (election_1.type === 'channel' ? '#' : '') + instance.toProperCase())
                            .setDescription(array.map(function (id) { return _this.Search.users.get(id).tag || '\u200B'; }).join('\n'))
                            .setFooter("Found " + array.length + " eligible voters."));
                        return [3 /*break*/, 12];
                    case 11:
                        e_1 = _c.sent();
                        if (e_1)
                            this.Output.onError(e_1);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Voters.prototype.generate = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var embed, votingBegun, election, registered, _i, _a, _b, name_1, data, voters, voted;
            return __generator(this, function (_c) {
                try {
                    embed = new Embed();
                    votingBegun = this.Permissions.state('election.voting', this);
                    election = this.election;
                    registered = false;
                    for (_i = 0, _a = Object.entries(election.elections || {}); _i < _a.length; _i++) {
                        _b = _a[_i], name_1 = _b[0], data = _b[1];
                        voters = Object.keys(data.voters);
                        voted = Object.values(data.voters).filter(function (array) { return array[0]; });
                        if (voters.length > 0)
                            registered = true;
                        embed.addField((election.type === 'channel' ? '#' : '') + name_1, voters.length + ' voters ' + (votingBegun ? '(' + voted.length + ' voted)' : ''), true);
                    }
                    embed.setTitle("Voters for upcoming " + (election.type ? election.type + ' ' : '') + "election" + (embed.fields.length > 1 ? 's' : '') + " on " + this.guild.name)
                        .setFooter(registered ? "Use '" + this.server.prefixes.generic + "voters get' to view individual voters for an election. '" + this.server.prefixes.generic + "h " + this.server.prefixes.generic + "voters' for more info." : "Use '" + this.server.prefixes.generic + "voters register' to register voters for the elections.")
                        .setDescription(embed.fields.length === 0 ? 'No upcoming elections found.' : '');
                    msg ? this.Output.editor(embed, msg) : this.Output.sender(embed);
                }
                catch (e) {
                    if (e)
                        this.Output.onError(e);
                }
                return [2 /*return*/];
            });
        });
    };
    Voters.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msg, data, election, e_2, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (this.server.states.election.register === true)
                            throw 'Voters have already been registered!';
                        return [4 /*yield*/, this.Output.generic('Finding eligible voters... ')];
                    case 1:
                        msg = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        data = {}, election = this.election;
                        return [4 /*yield*/, Voters['by' + election.type.toProperCase()](election, this)];
                    case 3:
                        data = _a.sent();
                        return [4 /*yield*/, Voters.filter(data, msg, this)];
                    case 4:
                        data = _a.sent();
                        this.election = data;
                        this.generate(msg);
                        this.server.states.election.register = true;
                        this.server.states.election.candidates = true;
                        DataManager.setServer(this.server);
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        if (msg)
                            msg.delete();
                        throw e_2;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_3 = _a.sent();
                        if (e_3)
                            this.Output.onError(e_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Voters.prototype.deregister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var election, _i, _a, key;
            return __generator(this, function (_b) {
                try {
                    if (this.server.states.election.register !== true)
                        throw 'Voters have not yet been registered!';
                    election = this.election;
                    for (_i = 0, _a = Object.keys(election.elections); _i < _a.length; _i++) {
                        key = _a[_i];
                        if (this.args.length === 0 || this.args.inArray(key))
                            election.elections[key] = {
                                voters: {},
                                candidates: {}
                            };
                    }
                    this.generate();
                    this.election = election;
                    this.server.states.election.register = false;
                    this.server.states.election.candidates = false;
                    DataManager.setServer(this.server);
                }
                catch (e) {
                    if (e)
                        this.Output.onError(e);
                }
                return [2 /*return*/];
            });
        });
    };
    Voters.byServer = function (data, argsInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, response, role, emsg, _a, _b, _c, channel, e_4;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        collection = void 0;
                        if (!data.criteria.includes('server')) return [3 /*break*/, 1];
                        collection = argsInfo.guild.members;
                        return [3 /*break*/, 7];
                    case 1:
                        if (!data.criteria.includes('role')) return [3 /*break*/, 6];
                        response = data.role.server;
                        role = argsInfo.Search.roles.get(response);
                        _d.label = 2;
                    case 2:
                        if (!!role) return [3 /*break*/, 5];
                        emsg = argsInfo.Output.onError('Couldn\'t find role **' + response + '&**.');
                        _b = (_a = argsInfo.Output).response;
                        _c = {};
                        return [4 /*yield*/, argsInfo.criteria];
                    case 3: return [4 /*yield*/, _b.apply(_a, [(_c.description = (_d.sent()) === 'role-choose' ? 'Please write the name of the role to find eligible members.' : 'Please write the name of the role for the list of eligible voters.',
                                _c)])];
                    case 4:
                        response = _d.sent();
                        role = argsInfo.Search.roles.get(response);
                        emsg.delete();
                        return [3 /*break*/, 2];
                    case 5:
                        collection = role.members;
                        return [3 /*break*/, 7];
                    case 6:
                        if (data.criteria.includes('channel')) {
                            channel = argsInfo.Search.channels.byID(data.criteria);
                            if (!channel)
                                throw 'Invalid criteria given!';
                            collection = channel.members;
                        }
                        else
                            throw 'Invalid criteria given!';
                        _d.label = 7;
                    case 7:
                        data.elections[argsInfo.guild.name].voters = Array.from(collection.keys());
                        return [2 /*return*/, data];
                    case 8:
                        e_4 = _d.sent();
                        if (e_4)
                            argsInfo.Output.onError(e_4);
                        throw e_4;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Voters.byChannel = function (data, argsInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, channelName, channel, collection, response, role, emsg, _c, _d, _e, channel_1, e_5, e_6;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 14, , 15]);
                        _a = [];
                        for (_b in data.elections)
                            _a.push(_b);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 13];
                        channelName = _a[_i];
                        if (!data.elections.hasOwnProperty(channelName))
                            return [3 /*break*/, 12];
                        channel = argsInfo.Search.channels.get(channelName);
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 11, , 12]);
                        collection = void 0;
                        if (!data.criteria.includes('server')) return [3 /*break*/, 3];
                        collection = argsInfo.guild.members;
                        return [3 /*break*/, 10];
                    case 3:
                        if (!data.criteria.includes('role')) return [3 /*break*/, 9];
                        response = void 0;
                        if (data.criteria === 'role-identical')
                            response = channel.name;
                        else if (data.criteria === 'role-choose')
                            response = data.role[channel.name];
                        role = argsInfo.Search.roles.get(response);
                        _f.label = 4;
                    case 4:
                        if (!!role) return [3 /*break*/, 8];
                        return [4 /*yield*/, argsInfo.Output.onError('Couldn\'t find role **' + response + '**.')];
                    case 5:
                        emsg = _f.sent();
                        _d = (_c = argsInfo.Output).response;
                        _e = {};
                        return [4 /*yield*/, argsInfo.criteria];
                    case 6: return [4 /*yield*/, _d.apply(_c, [(_e.description = (_f.sent()) === 'role-choose' ? 'Please write the name of the role for channel **' + channel + '**.' : 'Please write the name of the role for the list of eligible voters.',
                                _e)])];
                    case 7:
                        response = _f.sent();
                        role = argsInfo.Search.roles.get(response);
                        emsg.delete();
                        return [3 /*break*/, 4];
                    case 8:
                        collection = role.members;
                        return [3 /*break*/, 10];
                    case 9:
                        if (data.criteria.includes('channel')) {
                            channel_1 = argsInfo.Search.channels.byID(data.criteria);
                            if (!channel_1)
                                throw 'Invalid criteria given!';
                            collection = channel_1.members;
                        }
                        else
                            throw 'Invalid criteria given!';
                        _f.label = 10;
                    case 10:
                        data.elections[channel.name.toLowerCase()].voters = collection;
                        return [3 /*break*/, 12];
                    case 11:
                        e_5 = _f.sent();
                        if (e_5)
                            argsInfo.Output.onError(e_5);
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 1];
                    case 13: return [2 /*return*/, data];
                    case 14:
                        e_6 = _f.sent();
                        throw e_6;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Voters.filter = function (data, msg, argsInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, _a, _b, _i, type, e_7;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        _loop_1 = function (type) {
                            var voters;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!data.elections.hasOwnProperty(type))
                                            return [2 /*return*/, "continue"];
                                        return [4 /*yield*/, argsInfo.Output.editor({
                                                description: 'Finding eligible voters for... **' + (data.type === 'channel' ? argsInfo.Search.channels.get(type) : type) + '**'
                                            }, msg)];
                                    case 1:
                                        _a.sent();
                                        voters = data.elections[type].voters.filter(function (member) {
                                            if (!data.dupes && member.roles.some(function (role) { return role.name === argsInfo.server.roles.bank; }))
                                                return false;
                                            var dbuser = new Search().dbusers.getUser(member);
                                            if (!data.inactives && (Date.now() - (dbuser.messages.lastSeen || 0) > 1210000000))
                                                return false;
                                            if (dbuser.messages.count < data.messages)
                                                return false;
                                            Logger.command("[Register, " + type + ", " + member.user.tag + "]");
                                            return true;
                                        });
                                        data.elections[type].voters = voters.reduce(function (acc, cur) {
                                            acc[cur.id] = [];
                                            return acc;
                                        }, {});
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _a = [];
                        for (_b in data.elections)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        type = _a[_i];
                        return [5 /*yield**/, _loop_1(type)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, argsInfo.Output.editor({
                            description: 'Compiling voters to database... '
                        }, msg)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, data];
                    case 6:
                        e_7 = _c.sent();
                        throw e_7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /*
      static async compile(data) {
        try {
          let election = {
            "elections": {}
          };
          for (let [property, value] of Object.entries(data)) {
            if (property !== "elections") {
              election[property] = value;
              continue;
            };
            for (let type in value) {
              election.elections[type] = { //if it's a non-native property, just add it
                "voters": data.elections[type].reduce((acc, cur) => { //converts the array to an object with keys as items and values []
                  acc[cur] = [];
                  return acc
                }, {}),
                "candidates": {}
              }
            }
          };
          return election;
        } catch (e) {
          throw e;
        }
      }
    */
    Voters.prototype.findChannel = function (argument) {
        return __awaiter(this, void 0, void 0, function () {
            var election, channel;
            return __generator(this, function (_a) {
                try {
                    election = this.election;
                    if (election[argument.toLowerCase()])
                        return [2 /*return*/, argument.toLowerCase()];
                    channel = this.Search.channels.get(argument);
                    if (!channel || !election[channel.name.toLowerCase()])
                        throw '';
                    return [2 /*return*/, channel.name.toLowerCase()];
                }
                catch (e) {
                    throw 'Couldn\'t find channel **' + argument + '**.';
                }
                return [2 /*return*/];
            });
        });
    };
    Voters.prototype.disqualify = function () {
        return __awaiter(this, void 0, void 0, function () {
            var embed, count, election, args, _i, args_1, arg, user, _user, type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        embed = { description: '' }, count = 0, election = this.election;
                        return [4 /*yield*/, this.Output.response({
                                description: 'Please list the users to disqualify, separated by spaces.'
                            })];
                    case 1:
                        args = (_a.sent()).split(/\s+/g);
                        for (_i = 0, args_1 = args; _i < args_1.length; _i++) {
                            arg = args_1[_i];
                            try {
                                user = void 0;
                                if (arg) {
                                    _user = this.Search.users.get(arg);
                                    if (_user)
                                        user = _user;
                                    else
                                        throw 'Couldn\'t find user **' + arg + '.';
                                }
                                else
                                    user = this.author;
                                for (type in election.elections) {
                                    if (!election.hasOwnProperty(type))
                                        continue;
                                    if (election.elections[type].voters[user.id])
                                        delete election.elections[type].voters[user.id];
                                }
                                embed.description += user + '\n';
                                count++;
                            }
                            catch (e) {
                                if (e)
                                    this.Output.onError(e);
                            }
                        }
                        this.election = election;
                        embed.title = "Successfully removed the following user" + (count > 1 ? 's' : '') + " from the ballot:";
                        if (!embed.description)
                            embed.description = 'None.';
                        this.Output.sender(embed);
                        return [2 /*return*/];
                }
            });
        });
    };
    Voters.prototype.eligible = function (argument) {
        return __awaiter(this, void 0, void 0, function () {
            var user, count, embed, election, _user, type;
            return __generator(this, function (_a) {
                try {
                    user = void 0, count = 0, embed = { description: '' }, election = this.election;
                    if (argument) {
                        _user = this.Search.users.get(argument);
                        if (_user)
                            user = _user;
                        else
                            throw 'Couldn\'t find user **' + argument + '.';
                    }
                    else
                        user = this.author;
                    for (type in election.elections) {
                        if (!election.elections.hasOwnProperty(type))
                            continue;
                        if (election.elections[type].voters[user.id])
                            embed.description += election.type === 'channel' ? this.Search.channels.get(type) + '\n' : type + '\n';
                    }
                    embed.title = user.tag + ' is eligible to vote in election' + (count > 1 ? 's' : '') + ':';
                    if (!embed.description)
                        embed.description = 'None.';
                    this.Output.sender(embed);
                }
                catch (e) {
                    if (e)
                        this.Output.onError(e);
                }
                return [2 /*return*/];
            });
        });
    };
    return Voters;
}(Main));
module.exports = Voters;
