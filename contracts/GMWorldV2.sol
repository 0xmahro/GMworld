// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GMWorldV2
 * @notice GM/GN messages with protocol fee - fee goes to owner
 */
contract GMWorldV2 {
    event MessageSent(
        address indexed user,
        string message,
        uint256 timestamp
    );

    uint256 public constant FEE = 0.00005 ether;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Send a GM or GN message. Requires FEE (0.00005 ETH) - goes to owner
     * @param message The greeting (e.g., "Good morning", "おはよう")
     */
    function sendMessage(string calldata message) external payable {
        require(bytes(message).length > 0, "Empty message");
        require(bytes(message).length <= 64, "Message too long");
        require(msg.value >= FEE, "Insufficient fee");

        emit MessageSent(msg.sender, message, block.timestamp);

        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Fee transfer failed");
    }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Withdraw failed");
    }
}
