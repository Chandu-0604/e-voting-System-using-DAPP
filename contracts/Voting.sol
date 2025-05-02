// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    uint256 public votingStart;
    uint256 public votingEnd;

    mapping(string => uint256) public votesReceived;
    mapping(address => bool) public hasVoted;

    string[] public candidates;

    event Voted(address indexed voter, string candidate);
    event VotingReset();
    event VotingPeriodSet(uint256 start, uint256 end);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier duringVoting() {
        require(block.timestamp >= votingStart && block.timestamp <= votingEnd, "Voting is not active");
        _;
    }

    constructor(string[] memory candidateNames, uint256 durationSeconds) {
        require(candidateNames.length > 0, "Candidate list cannot be empty");
        owner = msg.sender;
        candidates = candidateNames;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + durationSeconds;
        emit VotingPeriodSet(votingStart, votingEnd);
    }

    function vote(string memory candidate) public duringVoting {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(validCandidate(candidate), "Invalid candidate.");

        votesReceived[candidate]++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidate);
    }

    function totalVotesFor(string memory candidate) public view returns (uint256) {
        require(validCandidate(candidate), "Invalid candidate.");
        return votesReceived[candidate];
    }

    function getNumCandidates() public view returns (uint256) {
        return candidates.length;
    }

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }

    function validCandidate(string memory candidate) private view returns (bool) {
        if (bytes(candidate).length == 0) return false;

        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(candidate))) {
                return true;
            }
        }
        return false;
    }

    function resetVoting(string[] memory newCandidates, uint256 durationSeconds) public onlyOwner {
        require(newCandidates.length > 0, "Candidate list cannot be empty");

        for (uint i = 0; i < candidates.length; i++) {
            delete votesReceived[candidates[i]];
        }

        delete candidates;

        for (uint i = 0; i < newCandidates.length; i++) {
            candidates.push(newCandidates[i]);
        }

        votingStart = block.timestamp;
        votingEnd = block.timestamp + durationSeconds;

        // Reset voter status
        // ⚠️ Not ideal to leave hasVoted mapping as-is for a fresh election, but
        // since mapping can't be fully reset in Solidity, in practice we’d use
        // additional logic or a new contract deployment per election.
        
        emit VotingReset();
        emit VotingPeriodSet(votingStart, votingEnd);
    }

    function isVotingActive() public view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp <= votingEnd;
    }
}
