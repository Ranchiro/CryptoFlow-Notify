const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoFlowToken", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CryptoFlowToken = await ethers.getContractFactory("CryptoFlowToken");
    token = await CryptoFlowToken.deploy("CryptoFlow Token", "CFT", owner.address);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("CryptoFlow Token");
      expect(await token.symbol()).to.equal("CFT");
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther("100000"));
    });
  });

  describe("Minting", function () {
    it("Should allow minting with proper fee", async function () {
      const mintAmount = ethers.parseEther("100");
      const mintingFee = await token.mintingFee();
      
      await expect(
        token.connect(addr1).mint(addr1.address, mintAmount, { value: mintingFee })
      ).to.emit(token, "TokensMinted");

      const balance = await token.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should reject minting without proper fee", async function () {
      const mintAmount = ethers.parseEther("100");
      
      await expect(
        token.connect(addr1).mint(addr1.address, mintAmount, { value: 0 })
      ).to.be.revertedWith("Insufficient fee paid");
    });

    it("Should enforce minting cooldown", async function () {
      const mintAmount = ethers.parseEther("100");
      const mintingFee = await token.mintingFee();
      
      // First mint should succeed
      await token.connect(addr1).mint(addr1.address, mintAmount, { value: mintingFee });
      
      // Second mint should fail due to cooldown
      await expect(
        token.connect(addr1).mint(addr1.address, mintAmount, { value: mintingFee })
      ).to.be.revertedWith("Minting cooldown not met");
    });

    it("Should reject minting to zero address", async function () {
      const mintAmount = ethers.parseEther("100");
      const mintingFee = await token.mintingFee();
      
      await expect(
        token.connect(addr1).mint(ethers.ZeroAddress, mintAmount, { value: mintingFee })
      ).to.be.revertedWith("Cannot mint to zero address");
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to mint without fee", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(
        token.ownerMint(addr1.address, mintAmount)
      ).to.emit(token, "TokensMinted");

      const balance = await token.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should allow owner to update minting fee", async function () {
      const newFee = ethers.parseEther("0.002");
      
      await expect(
        token.updateMintingFee(newFee)
      ).to.emit(token, "MintingFeeUpdated");

      expect(await token.mintingFee()).to.equal(newFee);
    });

    it("Should allow owner to pause and unpause", async function () {
      await token.pause();
      expect(await token.paused()).to.be.true;

      // Should reject transfers when paused
      await expect(
        token.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Pausable: paused");

      await token.unpause();
      expect(await token.paused()).to.be.false;
    });

    it("Should allow owner to withdraw fees", async function () {
      const mintAmount = ethers.parseEther("100");
      const mintingFee = await token.mintingFee();
      
      // Mint to generate fees
      await token.connect(addr1).mint(addr1.address, mintAmount, { value: mintingFee });
      
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      await expect(token.withdrawFees()).to.not.be.reverted;
      
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      // Mint some tokens to addr1 for testing
      const mintAmount = ethers.parseEther("1000");
      await token.ownerMint(addr1.address, mintAmount);
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await expect(
        token.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.emit(token, "Transfer");

      const addr1Balance = await token.balanceOf(addr1.address);
      const addr2Balance = await token.balanceOf(addr2.address);
      
      expect(addr1Balance).to.equal(ethers.parseEther("900"));
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const transferAmount = ethers.parseEther("2000"); // More than balance
      
      await expect(
        token.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      const mintAmount = ethers.parseEther("1000");
      await token.ownerMint(addr1.address, mintAmount);
    });

    it("Should allow burning tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await token.balanceOf(addr1.address);
      const initialSupply = await token.totalSupply();
      
      await expect(
        token.connect(addr1).burn(burnAmount)
      ).to.emit(token, "Transfer");

      const finalBalance = await token.balanceOf(addr1.address);
      const finalSupply = await token.totalSupply();
      
      expect(finalBalance).to.equal(initialBalance - burnAmount);
      expect(finalSupply).to.equal(initialSupply - burnAmount);
    });
  });
});