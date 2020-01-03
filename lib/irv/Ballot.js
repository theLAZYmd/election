"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("./Data");
var maths_1 = require("../utils/maths");
var Ballot = /** @class */ (function () {
    function Ballot(voter, races, election) {
        this.voter = voter;
        this.races = races;
        this.election = election;
    }
    Ballot.setURL = function (url) { this.url = url; };
    Ballot.setFooter = function (footer) { this.footer = footer; };
    Object.defineProperty(Ballot.prototype, "title", {
        get: function () {
            var name = this.election.settings.name.value || 'Election';
            var date = this.election.settings.date.value;
            if (date === undefined)
                throw 'Election date must be defined';
            return name + ': ' + date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ballot.prototype, "url", {
        get: function () {
            return Ballot.url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ballot.prototype, "description", {
        get: function () {
            return '- ' + Data_1.description.join('\n- ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ballot.prototype, "fields", {
        get: function () {
            var fields = [];
            var _loop_1 = function (r) {
                var candidates = Object.values(r.candidates).filter(function (c) {
                    for (var _i = 0, _a = Ballot.thresholds; _i < _a.length; _i++) {
                        var threshold = _a[_i];
                        if (!threshold.validate(c, r))
                            return false;
                    }
                    return true;
                });
                var votingString = maths_1.shuffle(candidates).map(function (c) { return '[] ' + c.name + '\n'; }).join('');
                fields.push({
                    name: "#" + r.name + " Ballot:",
                    value: '```css\n' +
                        ("#VoterID: " + this_1.voter.id + "\n") +
                        ("#ElectionID: " + this_1.election.id + "\n") +
                        ("#Channel: " + r.name + "\n") +
                        ("" + votingString) +
                        '[] Write-In\n' +
                        '[] Blank Vote```',
                    inline: false
                });
            };
            var this_1 = this;
            for (var _i = 0, _a = this.races; _i < _a.length; _i++) {
                var r = _a[_i];
                _loop_1(r);
            }
            return fields;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ballot.prototype, "footer", {
        get: function () {
            return Ballot.footer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ballot.prototype, "color", {
        get: function () {
            if (this.voter.color)
                return this.voter.color;
            if (this.election.settings.color)
                return this.election.settings.color.value;
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Ballot.prototype.toJSON = function () {
        return {
            title: this.title,
            url: this.url,
            description: this.description,
            fields: this.fields,
            footer: this.footer,
            color: this.color
        };
    };
    Ballot.properties = [];
    Ballot.thresholds = [];
    Ballot.url = '';
    Ballot.footer = '';
    return Ballot;
}());
exports.default = Ballot;
