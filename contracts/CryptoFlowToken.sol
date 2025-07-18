// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CryptoFlowToken
 * @dev ERC20 Token with minting, burning, and pausable functionality
 */
contract CryptoFlowToken is ERC20, ERC20Burnable, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public mintingFee = 0.001 ether; // Fee for minting tokens
    
    mapping(address => uint256) public lastMintTime;
    uint256 public mintCooldown = 1 hours; // Cooldown period between mints
    
    event TokensMinted(address indexed to, uint256 amount, uint256 fee);
    event MintingFeeUpdated(uint256 newFee);
    event CooldownUpdated(uint256 newCooldown);

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        // Mint initial supply to contract deployer
        _mint(initialOwner, 100000 * 10**decimals()); // 100,000 initial tokens
    }

    /**
     * @dev Mint tokens to a specified address
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public payable whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        require(msg.value >= mintingFee, "Insufficient fee paid");
        require(
            block.timestamp >= lastMintTime[msg.sender] + mintCooldown,
            "Minting cooldown not met"
        );

        lastMintTime[msg.sender] = block.timestamp;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, msg.value);
    }

    /**
     * @dev Mint tokens without fee (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function ownerMint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, 0);
    }

    /**
     * @dev Update the minting fee
     * @param newFee New fee amount in wei
     */
    function updateMintingFee(uint256 newFee) public onlyOwner {
        mintingFee = newFee;
        emit MintingFeeUpdated(newFee);
    }

    /**
     * @dev Update the minting cooldown period
     * @param newCooldown New cooldown period in seconds
     */
    function updateMintCooldown(uint256 newCooldown) public onlyOwner {
        mintCooldown = newCooldown;
        emit CooldownUpdated(newCooldown);
    }

    /**
     * @dev Pause all token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause all token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Withdraw contract's ETH balance to owner
     */
    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get the remaining cooldown time for an address
     * @param user Address to check cooldown for
     * @return Remaining cooldown time in seconds
     */
    function getRemainingCooldown(address user) public view returns (uint256) {
        uint256 timePassed = block.timestamp - lastMintTime[user];
        if (timePassed >= mintCooldown) {
            return 0;
        }
        return mintCooldown - timePassed;
    }

    /**
     * @dev Override transfer function to include pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Emergency function to recover accidentally sent ERC20 tokens
     * @param token Address of the token to recover
     * @param amount Amount to recover
     */
    function recoverERC20(address token, uint256 amount) public onlyOwner {
        require(token != address(this), "Cannot recover own token");
        IERC20(token).transfer(owner(), amount);
    }
}