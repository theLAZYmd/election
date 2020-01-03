"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var definitions_1 = require("./utils/definitions");
var Parse_1 = __importDefault(require("./irv/Parse"));
var regexes_1 = __importDefault(require("./utils/regexes"));
var VoteMethods = /** @class */ (function () {
    function VoteMethods(election) {
        this.election = election;
    }
    ;
    VoteMethods.prototype.resolve = function (output, voter, election) {
        return definitions_1.VotingSuccesses(output, voter, election);
    };
    VoteMethods.prototype.reject = function (output) {
        return definitions_1.VotingErrors[output];
    };
    VoteMethods.prototype.parseBallot = function (ballots, server, voter) {
        var _this = this;
        var res = {
            successes: [],
            failures: [],
        };
        var matches = ballots.match(regexes_1.default.ballot) || [];
        matches.forEach(function (match) {
            var vote = new Parse_1.default(match);
            try {
                var outcome = vote.validate(server, voter, _this.election);
                vote.setOutcome('fulfilled')
                    .setStatus(outcome)
                    .setMessage(_this.resolve(outcome, voter, vote.race));
            }
            catch (e) {
                vote.setOutcome('rejected')
                    .setStatus(e)
                    .setMessage(_this.reject(e));
            }
            finally {
                if (vote.outcome === 'fulfilled')
                    res.successes.push(vote);
                else if (vote.outcome === 'rejected')
                    res.failures.push(vote);
            }
        });
        return res;
    };
    return VoteMethods;
}());
exports.default = VoteMethods;
