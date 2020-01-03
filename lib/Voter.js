"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Voter = /** @class */ (function () {
    function Voter(voter) {
        this.id = '';
        this.name = '';
        this.votes = {};
        this.id = voter.id;
        this.name = voter.name;
        for (var _i = 0, _a = Voter.properties; _i < _a.length; _i++) {
            var p = _a[_i];
            this[p] = voter[p];
        }
    }
    Voter.setTransferredProperties = function (properties) {
        Voter.properties = properties;
    };
    Voter.setThresholds = function (thresholds) {
        Voter.thresholds = thresholds;
    };
    Voter.prototype.registerEligible = function (race) {
        for (var _i = 0, _a = Voter.thresholds; _i < _a.length; _i++) {
            var threshold = _a[_i];
            if (!threshold.validate(this, race)) {
                if (this.votes[race.id])
                    delete this.votes[race.id];
                return false;
            }
            ;
        }
        this.votes[race.id] = null;
        return true;
    };
    Voter.prototype.deregisterEligible = function (raceID) {
        if (this.votes[raceID])
            delete this.votes[raceID];
    };
    Voter.prototype.isEligible = function (raceID) {
        return raceID in this.votes;
    };
    Voter.prototype.disqualify = function (raceID) {
        if (raceID) {
            if (!(raceID in this.votes))
                throw "Voter " + name + " was not eligible for race " + raceID;
            delete this.votes[raceID];
        }
        else {
            for (var _i = 0, _a = Object.keys(this.votes); _i < _a.length; _i++) {
                var race = _a[_i];
                delete this.votes[race];
            }
        }
    };
    Voter.prototype.addVote = function (raceID, vote) {
        if (!(raceID in this.votes))
            throw "Voter " + name + " is not eligible for race " + raceID;
        this.votes[raceID] = vote;
    };
    Voter.properties = [];
    Voter.thresholds = [];
    return Voter;
}());
exports.default = Voter;
