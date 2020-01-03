"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = {
    register: {
        ballots: 'Cannot send ballots before voters have been registered.'
    },
    voting: {
        ballots: 'Cannot send ballots before voting has opened.',
        any: 'This command cannot be used once voting has begun!'
    }
};
