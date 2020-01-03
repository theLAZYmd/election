"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var regexes_1 = __importDefault(require("../utils/regexes"));
var Parse = /** @class */ (function () {
    function Parse(data) {
        this.data = data;
        this.outcome = '';
        this.status = '';
        this.message = '';
    }
    Parse.prototype.setOutcome = function (outcome) {
        this.outcome = outcome;
        return this;
    };
    Parse.prototype.setStatus = function (status) {
        this.status = status;
        return this;
    };
    Parse.prototype.setMessage = function (status) {
        this.message = status;
        return this;
    };
    Object.defineProperty(Parse.prototype, "ids", {
        get: function () {
            if (this._matches)
                return this._matches;
            var matches = this.data.match(regexes_1.default.ballotHeader) || [];
            return this._matches = matches.slice(1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "voter", {
        get: function () {
            return this.ids[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "election", {
        get: function () {
            return this.ids[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "race", {
        get: function () {
            return this.ids[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "lines", {
        get: function () {
            if (this._lines)
                return this._lines;
            return this._lines = this.data.match(regexes_1.default.ballotVote) || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "raw", {
        get: function () {
            if (!this._raw)
                this._raw = this.lines.map(function (line) { return (line.match(regexes_1.default.ballotLine) || []).slice(1); });
            return this._raw;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "votes", {
        get: function () {
            if (this._votes)
                return this._votes;
            this._votes = [Date.now()];
            for (var _i = 0, _a = this.raw; _i < _a.length; _i++) {
                var _b = _a[_i], index = _b[0], tag = _b[1];
                try {
                    if (!parseInt(index))
                        continue; //this is where unfilled lines are ignored
                    this._votes[parseInt(index)] = tag === 'Blank Vote' ? 'blank' : tag;
                }
                catch (e) {
                    console.error(e);
                }
            }
            return this._votes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "zeroes", {
        //returns a boolean whether a checkbox was filled in with a [0] vote
        //we set it to false. If a string has magically appeared in its place, return true
        //error checking
        get: function () {
            return typeof this.votes[0] === 'number';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "writeIn", {
        //whether someone wrote a [1] or number in the Write-In box without changing the name
        get: function () {
            return this.votes.some(function (v) { return v === 'Write-In'; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "ascending", {
        //whether the votes were done in ascending order
        get: function () {
            return this.votes.slice(1).every(function (v) { return typeof v === 'string'; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "duplicates", {
        //whether the same number was used for more than one option, for instance: [['1', samoyd#2402'], ['1', okei#1207']]
        get: function () {
            var obj = {};
            for (var _i = 0, _a = this.raw; _i < _a.length; _i++) {
                var index = _a[_i][0];
                if (!index)
                    continue;
                if (obj[index])
                    return true;
                else
                    obj[index] = true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "spoiled", {
        //whether the voter decline to fill in any preferences
        get: function () {
            return this.votes.length === 1;
        },
        enumerable: true,
        configurable: true
    });
    //Got to account for all the 'edge cases' a user might possibly be able to do to the ballot
    Parse.prototype.validate = function (server, voter, election) {
        if (this.voter !== voter.id)
            throw 'stolen'; //changed voterID (perhaps to another user)
        if (!server)
            throw 'noGuild'; //changed serverID to other 18 digit code (for whatever reason)
        if (!election.states.voting)
            throw 'state'; //voting period has closed
        if (!election.type)
            throw 'state';
        if (!(this.race in election.races))
            throw 'noElection';
        var race = election.races[this.race]; //changed channel (election) name to something invalid
        if (!(this.voter in race.voters))
            throw 'ineligible'; //changed channel name to other election not eligible for
        if (this.zeroes)
            throw 'zeroes'; //added a zero [0] option
        if (this.writeIn)
            throw 'badWriteIn'; //added a number [1] to 'Wrote-In'
        if (this.duplicates)
            throw 'duplicates'; //wrote the same number next to more than one
        if (!this.ascending)
            throw 'badOrder'; //added a zero [0] option
        //Check if candidates are still in the server live
        //let votes = this.votes
        //	.filter(vote => !vote || vote === 'blank' || this.Search.users.byTag(vote))					//so the this.votes[0] = false gets filtered to stay in
        //	.map(vote => typeof vote === 'string' ? (vote === 'blank' ? 'blank' : this.Search.users.byTag(vote).id) : Date.now()); //here's where the date is added
        //if (votes.length !== this.votes.length) throw 'missingUsers';
        if (race.voters[this.voter] && race.voters[this.voter][0]) { //revote
            if (Date.now() - race.voters[this.voter][0] > 1800000)
                throw 'timeout'; //trying to revote out of time (more than half a hour later)
            else {
                if (this.spoiled)
                    return 'spoiled revote';
                else
                    return 'revote';
            }
        }
        else {
            if (this.spoiled)
                return 'spoiled';
            else
                return 'vote';
        }
    };
    Parse.prototype.toJSON = function () {
        return this.votes;
    };
    return Parse;
}());
exports.default = Parse;
