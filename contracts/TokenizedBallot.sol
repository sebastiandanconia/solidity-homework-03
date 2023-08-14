// SPDX-License-Identifier: GPL-2.0
pragma solidity ^0.8.19;

// https://docs.soliditylang.org/en/latest/solidity-by-example.html
// https://docs.soliditylang.org/en/v0.8.11/solidity-by-example.html

interface IMyToken {
    function getPastvotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    IMyToken tokenContract;

    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    address public chairperson;

    //mapping(address => Voter) public voters;
    mapping(address => uint256) votingPowerSpent; //?

    Proposal[] public proposals;
    uint256 public targetBlockNumber;

    constructor(
        bytes32[] memory proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {

        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        // Optional: require(targetBlockNumber < block.timestamp);

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(
            votingPower(msg.sender) >= amount,
            "TokenizedBallot: trying to vote more than allowed"
        );
        votingPowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function votingPower(address account) public view returns (uint256) {
        // Maybe getPastVotes() really means "Get delegations which were filed on time?"
        return tokenContract.getPastvotes(account, targetBlockNumber) -
             votingPowerSpent[account];
    }


    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}