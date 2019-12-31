const regexes = {
	role: /^role(?:-choose)?$/,
	ballot: /^#VoterID: (?:[0-9]{18})$\n^#ElectionID: (?:[0-9]{18})$\n^#Channel: (?:[\w-]+)$\n(?:^(?:\[(?:[0-9]*)\]\s(?:[\w\s]{2,32}#(?:[0-9]{4})|Write-In|Blank Vote)$\n?)+)/gm,
	ballotHeader: /^#VoterID: ([0-9]{18})$\n^#ElectionID: ([0-9]{18})$\n^#Channel: ([\w-]+)$/m,
	ballotVote: /^\[(?:[0-9]*)\]\s(?:[\w\s]{2,32}#(?:[0-9]{4})|Write-In|Blank Vote)$/mg,
	ballotLine: /^\[([0-9]*)\]\s([\w\s]{2,32}#(?:[0-9]{4})|Write-In|Blank Vote)$/m,
	whitespace: /\s+/g,
	includesAll: /^all$/
}

export default regexes;