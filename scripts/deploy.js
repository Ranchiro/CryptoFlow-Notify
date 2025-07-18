const hre = require("hardhat");

async function main() {
  console.log("Deploying CryptoFlowToken...");

  // Get the contract factory
  const CryptoFlowToken = await hre.ethers.getContractFactory("CryptoFlowToken");

  // Deploy the contract
  const token = await CryptoFlowToken.deploy(
    "CryptoFlow Token",  // name
    "CFT",               // symbol
    "0x..." // Replace with your address
  );

  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("CryptoFlowToken deployed to:", address);

  // Verify the contract on Etherscan (optional)
  if (hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await token.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [
          "CryptoFlow Token",
          "CFT",
          "0x..." // Replace with your address
        ],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };

  console.log("Deployment Info:", deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });