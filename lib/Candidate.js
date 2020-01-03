"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Candidate = /** @class */ (function () {
    function Candidate(voter, race) {
        this.race = race;
        this.id = '';
        this.name = '';
        this.sponsors = {};
        this.id = voter.id;
        this.name = voter.name;
        for (var _i = 0, _a = Candidate.properties; _i < _a.length; _i++) {
            var p = _a[_i];
            this[p] = voter[p];
        }
        for (var _b = 0, _c = Candidate.thresholds; _b < _c.length; _b++) {
            var threshold = _c[_b];
            if (!threshold.validate(this, race)) {
                throw "Candidate " + this.name + " is not eligible for race " + race.name + "\n" + threshold.error;
            }
            ;
        }
    }
    Candidate.setTransferredProperties = function (properties) {
        Candidate.properties = properties;
    };
    Candidate.setThresholds = function (thresholds) {
        Candidate.thresholds = thresholds;
    };
    Candidate.prototype.toJSON = function () {
        var output = Object.assign({}, this);
        delete output.race;
        return output;
    };
    Candidate.properties = [];
    Candidate.thresholds = [];
    return Candidate;
}());
exports.default = Candidate;
