const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  const candidates = ["Alice", "Bob", "Charlie"];
  const votingDuration = 604800;  
  deployer.deploy(Voting, candidates, votingDuration);
};
