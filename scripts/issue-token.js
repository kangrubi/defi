const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(callback) {
  try {
    console.log("Fetching deployed instance of TokenFarm...");
    let tokenFarm = await TokenFarm.deployed();
    console.log("TokenFarm instance fetched:", tokenFarm.address);

    console.log("Issuing tokens...");
    await tokenFarm.issueTokens();
    console.log("Tokens issued!");
  } catch (error) {
    console.error("Error occurred:", error);
  }
  callback();
};
