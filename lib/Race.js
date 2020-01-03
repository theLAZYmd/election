"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Candidate_1 = __importDefault(require("./Candidate"));
var maths_1 = require("./utils/maths");
var Race = /** @class */ (function () {
    function Race(data, election) {
        this.election = election;
        this.id = '';
        this.name = '';
        this.candidates = {};
        this.validVotes = {};
        this.eligibleCache = new Map();
        this.id = data.id;
        this.name = data.name;
        for (var _i = 0, _a = Race.properties; _i < _a.length; _i++) {
            var p = _a[_i];
            this[p] = data[p];
        }
    }
    Race.setTransferredProperties = function (properties) {
        Race.properties = properties;
    };
    Object.defineProperty(Race.prototype, "candidatesLength", {
        get: function () {
            return Object.keys(this.candidates).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Race.prototype, "eligibleVoters", {
        get: function () {
            var _this = this;
            var key = JSON.stringify(this.election.voters);
            if (this.eligibleCache.get(key))
                return this.eligibleCache.get(key);
            var value = Object.values(this.election.voters).filter(function (v) { return v.isEligible(_this.id); });
            this.eligibleCache.set(key, value);
            return value;
        },
        enumerable: true,
        configurable: true
    });
    Race.prototype.getRandomVoter = function (exclude) {
        if (exclude === void 0) { exclude = []; }
        return this.getRandomVoters(1, exclude)[0];
    };
    Race.prototype.getRandomVoters = function (count, exclude) {
        if (count === void 0) { count = 1; }
        if (exclude === void 0) { exclude = []; }
        var voters = this.eligibleVoters;
        return maths_1.randomPermutation(voters.map(function (v) { return v.id; }), count, exclude)
            .map(function (id) { return voters.find(function (v) { return v.id === id; }); });
    };
    Race.prototype.upgradeToCandidate = function (voter) {
        if (voter.id in this.candidates)
            throw 'Already registered candidate ' + voter.name + ' in race ' + this.name;
        var candidate = new Candidate_1.default(voter, this);
        this.candidates[candidate.id] = candidate;
        if (!voter.races)
            voter.races = [];
        voter.races.push(this.id);
        this.election.voters[voter.id].races = voter.races;
        return this;
    };
    Race.prototype.disqualifyCandidate = function (candidateID) {
        if (!(candidateID in this.candidates))
            throw 'Couldn\'t find candidate ' + candidateID + ' in race ' + this.name;
        return this;
    };
    Race.prototype.sponsor = function (candidate, voter) {
        if (voter.id === candidate.id)
            throw voter.name + " cannot not sponsor self";
        if (!voter.isEligible(this.id))
            throw voter.name + " is not a member of the electorate.\nCannot declare sponsorship for candidate " + candidate.name + " in race " + this.name;
        if (Object.values(this.candidates).some(function (c) { return voter.id in c.sponsors; }))
            throw voter.name + " has already declared sponsorship in race " + this.name;
        this.candidates[candidate.id].sponsors[voter.id] = voter;
        return this;
    };
    Race.prototype.unsponsor = function (candidate, voter) {
        if (voter.id === candidate.id)
            throw 'Invalid request';
        if (!voter.isEligible(this.id))
            throw voter.name + " is not a member of the electorate.";
        if (!(voter.id in candidate.sponsors))
            throw voter.name + " had not sponsored " + candidate.name + " in race " + this.name;
        delete this.candidates[candidate.id].sponsors[voter.id];
        return this;
    };
    Race.prototype.toJSON = function () {
        var output = Object.assign({}, this);
        delete output.election;
        return output;
    };
    Race.properties = [];
    return Race;
}());
exports.default = Race;
