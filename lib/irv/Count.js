"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var Count = /** @class */ (function () {
    function Count(candidates, votes) {
        this.votes = votes;
        this.candidates = {};
        this.quota = Infinity;
        this.order = [];
        this.winners = [];
        this.rounds = [];
        this.transfers = [];
        this.candidates = candidates.reduce(function (acc, curr) {
            acc[curr] = true;
            return acc;
        }, {});
        this.totalCount = {};
        if (Count.STV)
            this.quota = Math.floor(this.votes.length / (Count.winnerThreshold + 1)) + 1;
        this.totalCount = this.initialCount();
        this.rounds.push(interfaces_1.mapToLengths(this.totalCount));
        this.getWinner();
        while (this.winners.length < Count.winnerThreshold) {
            var eliminees = this.getEliminees();
            this.deregister(eliminees);
            this.transferVotes(eliminees);
            this.eliminate(eliminees);
            this.rounds.push(interfaces_1.mapToLengths(this.totalCount));
            this.getWinner();
            if (!this.candidatesLeft)
                break;
        }
        ;
    }
    Count.useSTV = function () { this.STV = true; };
    ;
    Count.useIRV = function () { this.STV = false; };
    ;
    Count.setWinnerThreshold = function (winnerThreshold) { this.winnerThreshold = winnerThreshold; };
    ;
    Count.prototype.initialCount = function () {
        return this.sortVotes(this.votes);
    };
    Count.prototype.sortVotes = function (votes) {
        return votes.reduce(function (acc, curr) {
            var vote = curr.find(function (v) { return v in acc; });
            if (!vote)
                return acc;
            acc[vote] = acc[vote].concat([curr]);
            return acc;
        }, interfaces_1.setToZero(this.candidates, []));
    };
    Count.prototype.getWinner = function () {
        var _this = this;
        if (this.candidatesLeft <= 1) {
            var winner_1 = interfaces_1.filterKeys(this.candidates, function (v) { return v; });
            this.winners = winner_1.concat(interfaces_1.flatten(this.order.slice(0, Count.winnerThreshold - 1)));
            if (winner_1.length)
                this.order.unshift(winner_1);
            return winner_1[0] || null;
        }
        if (!Count.STV)
            return null;
        var winner = Object.entries(this.totalCount)
            .sort(function (a, b) { return b[1].length - a[1].length; }) // Sort and map first with STV each time to ensure highest scoring winners come out first
            .map(function (entry) { return entry[0]; })
            .find(function (k) { return !_this.winners.includes(k) && _this.totalCount[k].length >= _this.quota; }) || null;
        if (winner) {
            this.order.splice(this.winners.length, 0, [winner]);
            this.winners.push(winner);
            this.getWinner();
        }
        return winner;
    };
    Count.prototype.getEliminees = function () {
        var _this = this;
        if (Count.STV) {
            var winners = this.winners.filter(function (w) { return _this.candidates[w]; });
            if (winners.length)
                return winners;
        }
        var zeroes = interfaces_1.filterKeys(this.totalCount, function (votes) { return votes.length === 0; });
        if (zeroes.length !== 0)
            return zeroes;
        var lowestValue = Object.values(this.totalCount).reduce(function (acc, curr) {
            if (curr.length < acc)
                return curr.length;
            return acc;
        }, Infinity);
        return interfaces_1.filterKeys(this.totalCount, function (votes) { return votes.length === lowestValue; });
    };
    Count.prototype.deregister = function (eliminees) {
        for (var _i = 0, eliminees_1 = eliminees; _i < eliminees_1.length; _i++) {
            var c = eliminees_1[_i];
            if (!(c in this.totalCount))
                throw this.eliminationError;
            this.candidates[c] = false;
        }
    };
    Count.prototype.transferVotes = function (eliminees) {
        var stv = 1; //TODO: Implement fractional voting with STV
        if (Count.STV && eliminees.length === 1 && this.winners.includes(eliminees[0])) {
            stv = 1 / (this.totalCount[eliminees[0]].length - this.quota);
        }
        for (var _i = 0, eliminees_2 = eliminees; _i < eliminees_2.length; _i++) {
            var c = eliminees_2[_i];
            if (!(c in this.totalCount))
                throw this.eliminationError;
            var votes = this.totalCount[c];
            var transfer = this.sortVotes(votes);
            this.transfers.push(interfaces_1.mapToLengths(transfer));
            for (var _a = 0, _b = Object.entries(transfer); _a < _b.length; _a++) {
                var _c = _b[_a], k = _c[0], v = _c[1];
                this.totalCount[k] = this.totalCount[k].concat(v);
            }
        }
    };
    Count.prototype.eliminate = function (eliminees) {
        var _this = this;
        for (var _i = 0, eliminees_3 = eliminees; _i < eliminees_3.length; _i++) {
            var c = eliminees_3[_i];
            if (!(c in this.totalCount))
                throw this.eliminationError;
            delete this.totalCount[c];
        }
        if (Count.STV) {
            if (eliminees.some(function (c) { return _this.winners.includes(c); }))
                return;
        }
        this.order.unshift(eliminees);
    };
    Object.defineProperty(Count.prototype, "candidatesLeft", {
        get: function () {
            return Object.values(this.candidates).filter(function (v) { return v; }).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Count.prototype, "eliminationError", {
        get: function () {
            return [
                'Found an error with the elimination-finding mechanism:',
                JSON.stringify(this.candidates, null, 4),
                JSON.stringify(this.totalCount, null, 4)
            ].join('\n');
        },
        enumerable: true,
        configurable: true
    });
    Count.prototype.toJSON = function () {
        var output = Object.assign({}, this);
        delete output.totalCount;
        delete output.votes;
        if (!Count.STV)
            delete output.quota;
        if (output.order.every(function (position) { return position.length === 1; }))
            output.order = output.order.map(function (_a) {
                var c = _a[0];
                return c;
            });
        output.candidates = Object.keys(output.candidates);
        return output;
    };
    Count.STV = false;
    Count.winnerThreshold = 1;
    return Count;
}());
exports.default = Count;
