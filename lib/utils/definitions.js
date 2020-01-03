"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Systems = [
    {
        "key": "fptp",
        "name": "First Past the Post",
        "href": "https://www.electoral-reform.org.uk/voting-systems/types-of-voting-system/first-past-the-post/",
    },
    {
        "key": "irv",
        "name": "Instant Run-Off",
        "href": "https://en.wikipedia.org/wiki/Instant-runoff_voting#Examples"
    },
    {
        "key": "stv",
        "name": "Single-Transferable Vote",
        "href": "https://www.electoral-reform.org.uk/voting-systems/types-of-voting-system/single-transferable-vote/"
    }
];
exports.Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
exports.VotingErrors = {
    stolen: 'This ballot does not match your registered voter ID.\nPlease do not make any unauthorised modifications to your ballot.',
    noGuild: 'Couldn\'t find server to submit vote for.\nPlease do not make any unauthorised modifications to your ballot.',
    state: 'Voting period for elections on this server is closed.\nThis ballot has not been registered.',
    noElection: 'Couldn\'t find election matching name listed on your ballot.\nPlease do not make any unauthorised modifications to your ballot.',
    ineligible: 'You are ineligible to vote for that channel.',
    timeout: 'You have already voted for that channel.',
    badOrder: 'Invalid voting order! Fill up your ballot in ascending order, beginning with `[1]`',
    badWriteIn: 'Invalid `Write-In`. Change the `Write-In` field to a `DiscordTag#1024` to write in a user.',
    zeroes: 'You may not vote for a user with a position zero `[0]`.',
    duplicates: 'Your ballot contains duplicate votes. Only assign a position number to an option once.',
    missingUsers: 'Couldn\'t find one or more users listed in the ballot.\nPlease check and the spelling of any written-in users and verify that any and all have not withdrawn by trying to `@mention` them or by using the `!candidates` command in the server.'
};
function VotingSuccesses(key, voter, election) {
    switch (key) {
        case ('spoiled'):
            return "Accepted **spoiled** ballot from **" + voter.name + "** for election #**" + election + ".**\nIf this was your intention, you do not need to reply, otherwise you may resubmit your ballot during the next 30 minutes.";
        case ('spoiled revote'):
            return "Accepted **spoiled revote** ballot from **" + voter.name + "** for election #**" + election + ".**";
        case ('revote'):
            return "Accepted valid **revote** ballot from **" + voter.name + "** for election #**" + election + ".**";
        case ('vote'):
            return "Accepted valid ballot from **" + voter.name + "** for election #**" + election + ".**";
        default:
            throw 'Invalid key';
    }
}
exports.VotingSuccesses = VotingSuccesses;
