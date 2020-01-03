"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Race_1 = __importDefault(require("./Race"));
var Voter_1 = __importDefault(require("./Voter"));
var Candidate_1 = __importDefault(require("./Candidate"));
var Vote_1 = __importDefault(require("./Vote"));
var definitions_1 = require("./utils/definitions");
var markdown_1 = require("./utils/markdown");
var errors_1 = require("./utils/errors");
var Ballot_1 = __importDefault(require("./irv/Ballot"));
var Count_1 = __importDefault(require("./irv/Count"));
// An election is defined as a group of election parameters surrounding a set of 'races'
var Election = /** @class */ (function () {
    function Election(id) {
        var _this = this;
        this.id = '';
        this.states = {
            register: false,
            candidates: false,
            voting: false,
            count: false
        };
        this.settings = {
            name: {
                value: 'Election',
                definition: 'string',
                title: 'Title'
            },
            date: {
                value: new Date(Date.now()).getMonth(),
                definition: 'number',
                title: 'Date',
                conversion: function (key) { return definitions_1.Months[key]; },
            },
            system: {
                value: 'irv',
                definition: definitions_1.Systems.map(function (s) { return s.name; }),
                title: 'Voting System',
                conversion: function (key) {
                    var system = definitions_1.Systems.find(function (s) { return s.key === key; });
                    if (!system)
                        throw 'Invalid key';
                    return "[" + system.name + "](" + system.href + ")";
                }
            },
            type: {
                value: 'multi',
                definition: ['multi', 'single'],
                title: 'Type of election'
            },
            ballotColour: {
                value: 15844367,
                definition: 'number',
                title: 'Default ballot colour'
            }
        };
        this.candidateThresholds = {
            limit: {
                value: '1',
                title: 'Running limit',
                validate: function (candidate) { return !candidate.races || candidate.races.length < 1; },
                error: 'Candidate is already running in a race'
            }
        };
        this.ballotThresholds = {
            sponsors: {
                key: 'sponsors',
                value: '3',
                title: 'Required sponsors',
                validate: function (candidate) { return Object.keys(candidate.sponsors).length >= 3; },
                error: 'Candidate has not reached the requisite number of sponsors'
            }
        };
        this.voterThresholds = {
            inactives: {
                value: 'true',
                title: 'Inactive members voting?',
                validate: function (voter) { return voter.active !== false; },
                error: 'User is marked as inactive'
            }
        };
        this.races = {};
        this.voters = {};
        this.votes = {};
        this.pendingPromises = [];
        this.resolve = function () {
            return Promise.all(_this.pendingPromises).then(function () { });
        };
        this.id = id;
        Voter_1.default.setThresholds(Object.values(this.voterThresholds));
        Candidate_1.default.setThresholds(Object.values(this.candidateThresholds));
    }
    Object.defineProperty(Election.prototype, "type", {
        get: function () {
            var system = this.settings.system;
            if (!system)
                throw 'Invalid settings';
            return system.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Election.prototype, "plural", {
        get: function () {
            return Object.keys(this.races).length > 1 ? 's' : '';
        },
        enumerable: true,
        configurable: true
    });
    /* CONFIGURE SETTINGS */
    Election.prototype.editSetting = function (key, s) {
        var prev = this.settings[key];
        if (prev.definition) {
            if (s.definition)
                throw 'Don\'t set new definition when editing a setting!';
            s.definition = prev.definition;
        }
        if (!s.title && prev.title)
            s.title = prev.title;
        if (typeof s.title !== 'string')
            throw 'Setting title must be a string';
        if (Array.isArray(s.definition)) {
            if (!s.definition.some(function (v) { return v === s.value; }))
                throw 'Setting value must be one of ' + s.definition.join(',');
        }
        else {
            if (typeof s.value !== s.definition)
                throw 'Setting value must be type ' + s.definition;
        }
        this.settings[key] = s;
        return this;
    };
    Election.prototype.setRaceProperties = function (properties) {
        Race_1.default.setTransferredProperties(properties);
        return this;
    };
    Election.prototype.setVoterProperties = function (properties) {
        Voter_1.default.setTransferredProperties(properties);
        return this;
    };
    Election.prototype.setCandidateProperties = function (properties) {
        Candidate_1.default.setTransferredProperties(properties);
        return this;
    };
    Election.prototype.addVoterThreshold = function (key, t) {
        this.voterThresholds[key] = t;
        Voter_1.default.setThresholds(Object.values(this.voterThresholds));
        return this;
    };
    Election.prototype.editVoterThreshold = function (key, t) {
        if (!(key in this.voterThresholds))
            throw 'Bad key threshold to edit ' + key;
        this.voterThresholds[key] = t;
        Voter_1.default.setThresholds(Object.values(this.voterThresholds));
        return this;
    };
    Election.prototype.addCandidateThreshold = function (key, t) {
        this.candidateThresholds[key] = t;
        Candidate_1.default.setThresholds(Object.values(this.candidateThresholds));
        return this;
    };
    Election.prototype.editCandidateThreshold = function (key, t) {
        if (!(key in this.candidateThresholds))
            throw 'Bad key threshold to edit ' + key;
        this.candidateThresholds[key] = t;
        Candidate_1.default.setThresholds(Object.values(this.candidateThresholds));
        return this;
    };
    Object.defineProperty(Election.prototype, "settingsObject", {
        get: function () {
            return Object.entries(Object.assign({}, this.settings, this.candidateThresholds, this.voterThresholds))
                .reduce(function (acc, _a) {
                var k = _a[0], v = _a[1];
                acc[k] = v.conversion ? v.conversion(v.value) : v.value.toString();
                return acc;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Election.prototype, "settingsFields", {
        get: function () {
            var fields = [];
            for (var _i = 0, _a = Object.values(this.settings); _i < _a.length; _i++) {
                var s = _a[_i];
                fields.push({
                    name: s.title,
                    value: s.conversion ? s.conversion(s.value) : s.value.toString()
                });
            }
            for (var _b = 0, _c = Object.values(this.candidateThresholds); _b < _c.length; _b++) {
                var s = _c[_b];
                fields.push({
                    name: s.title,
                    value: s.value
                });
            }
            for (var _d = 0, _e = Object.values(this.voterThresholds); _d < _e.length; _d++) {
                var s = _e[_d];
                fields.push({
                    name: s.title,
                    value: s.value
                });
            }
            fields.push({
                name: 'Elections',
                value: Object.values(this.races).map(function (r) { return markdown_1.bold(r.name); }).join(' | ')
            });
            return fields;
        },
        enumerable: true,
        configurable: true
    });
    Election.prototype.setState = function (key, value) {
        if (value && this.states[key] === value)
            throw 'Election was already in ' + key + 'state';
        if (!value && this.states[key] === value)
            throw 'Election was not in ' + key + 'state';
        this.states[key] = value;
    };
    Election.prototype.resetState = function () {
        for (var _i = 0, _a = Object.keys(this.states); _i < _a.length; _i++) {
            var key = _a[_i];
            this.states[key] = false;
        }
    };
    /* GENERATE VOTERS */
    Election.prototype.addRace = function (data) {
        var race = new Race_1.default(data, this);
        this.races[race.id] = race;
        return race;
    };
    Election.prototype.addVoter = function (data) {
        var voter = new Voter_1.default(data);
        this.voters[voter.id] = voter;
        return voter;
    };
    Election.prototype.getCounts = function () {
        var res = {};
        var voters = Object.values(this.voters);
        var _loop_1 = function (race) {
            res[race.id] = voters.filter(function (v) { return v.isEligible(race.id); }).length;
        };
        for (var _i = 0, _a = Object.values(this.races); _i < _a.length; _i++) {
            var race = _a[_i];
            _loop_1(race);
        }
        return res;
    };
    Election.prototype.getVoters = function (raceID) {
        if (!(raceID in this.races))
            throw 'Couldn\'t find election ' + raceID;
        var voters = Object.values(this.voters);
        return voters.filter(function (v) { return v.isEligible(raceID); });
    };
    Election.prototype.registerEligible = function () {
        var voterKeys = Object.keys(this.voters);
        var races = Object.values(this.races);
        for (var _i = 0, voterKeys_1 = voterKeys; _i < voterKeys_1.length; _i++) {
            var key = voterKeys_1[_i];
            for (var _a = 0, races_1 = races; _a < races_1.length; _a++) {
                var r = races_1[_a];
                this.voters[key].registerEligible(r);
            }
        }
        this.setState('register', true);
        return this;
    };
    Election.prototype.deregisterEligible = function () {
        var voterKeys = Object.keys(this.voters);
        var races = Object.values(this.races);
        for (var _i = 0, voterKeys_2 = voterKeys; _i < voterKeys_2.length; _i++) {
            var key = voterKeys_2[_i];
            for (var _a = 0, races_2 = races; _a < races_2.length; _a++) {
                var r = races_2[_a];
                this.voters[key].deregisterEligible(r.id);
            }
        }
        this.setState('register', false);
        return this;
    };
    /* Candidates */
    Election.prototype.openNominations = function () {
        this.setState('candidates', true);
        return this;
    };
    Election.prototype.closeNominations = function () {
        this.setState('candidates', false);
        return this;
    };
    /* Voting */
    Election.prototype.openVoting = function () {
        if (!this.states.register)
            throw 'Cannot initiate voting without voter registration.';
        if (this.states.candidates)
            throw 'Cannot initiate voting while candidate registration is still open.';
        this.setState('voting', true);
        return this;
    };
    Election.prototype.closeVoting = function () {
        this.setState('voting', false);
        return this;
    };
    Election.prototype.generateTestBallot = function (voter, mobile, races) {
        if (!this.states.register)
            throw errors_1.state.register.ballots;
        if (!this.states.voting && mobile)
            throw errors_1.state.voting.ballots;
        return this.generateBallotDict([voter], races);
    };
    Election.prototype.generateOneBallot = function (voter, mobile) {
        var _this = this;
        if (!this.states.voting && mobile)
            throw errors_1.state.voting.ballots;
        var races = Object.keys(voter.votes).map(function (id) { return _this.races[id]; });
        return this.generateBallotDict([voter], races);
    };
    Election.prototype.generateAllBallots = function (real) {
        if (!this.states.register)
            throw errors_1.state.register.ballots;
        if (real) {
            if (this.states.voting)
                throw errors_1.state.voting.any;
            this.openVoting();
        }
        var voters = Object.values(this.voters);
        return this.generateBallotDict(voters, Object.values(this.races));
    };
    Election.prototype.generateBallotDict = function (voters, races) {
        var _this = this;
        return voters.reduce(function (acc, curr) {
            acc[curr.id] = new Ballot_1.default(curr, races, _this);
            return acc;
        }, {});
    };
    Election.prototype.addVoteFromBallot = function (voter, data) {
        var _this = this;
        var successes = new Vote_1.default(this).parseBallot(data, this.id, voter).successes;
        successes.forEach(function (ballot) { return _this.addVote(voter, ballot); });
        return this;
    };
    //Dangerous! No validation
    Election.prototype.addVote = function (voter, ballot) {
        if (voter.id !== ballot.voter)
            throw Vote_1.default.prototype.reject('stolen');
        if (typeof ballot.votes[0] !== 'number')
            throw 'Invalid vote format\n' + JSON.stringify(ballot.votes, null, 4);
        if (!ballot.votes.slice(1).every(function (v) { return typeof v === 'string'; }))
            throw 'Invalid vote format\n' + JSON.stringify(ballot.votes, null, 4);
        this.setVote(ballot);
        return this;
    };
    Election.prototype.setVote = function (ballot) {
        this.votes[ballot.race + '.' + ballot.voter] = ballot.votes;
        this.races[ballot.race].validVotes[ballot.voter] = ballot.votes;
        this.voters[ballot.voter].votes[ballot.race] = ballot.votes;
    };
    Election.prototype.countVotes = function () {
        this.setState('register', false);
        this.setState('count', true);
        var results = {};
        for (var _i = 0, _a = Object.entries(this.races); _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], race = _b[1];
            var candidates = Object.keys(race.candidates);
            var votes = Object.values(race.validVotes).map(function (vote) { return vote.slice(1); });
            results[id] = new Count_1.default(candidates, votes);
        }
        this.results = results;
        return this;
    };
    /* Utility */
    Election.prototype.getRace = function (id) {
        if (this.races[id])
            return this.races[id];
        return Object.values(this.races).find(function (r) { return r.name.toLowerCase().startsWith(id.toLowerCase()); });
    };
    Election.prototype.getVoter = function (id) {
        if (this.voters[id])
            return this.voters[id];
        return Object.values(this.voters).find(function (v) { return v.name.toLowerCase().startsWith(id.toLowerCase()); });
    };
    Election.prototype.toJSON = function () {
        return {
            id: this.id,
            states: this.states,
            settings: this.settingsObject,
            races: this.races,
            results: this.results,
            voters: this.voters,
            votes: this.votes
        };
    };
    return Election;
}());
exports.default = Election;
