// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GMWorld
 * @notice Minimal gas-efficient contract for sending GM/GN messages on Base
 */
contract GMWorld {
    event MessageSent(
        address indexed user,
        string message,
        uint256 timestamp
    );

    /**
     * @notice Send a GM or GN message
     * @param message The greeting (e.g., "Good morning", "おはよう")
     */
    function sendMessage(string calldata message) external {
        require(bytes(message).length > 0, "Empty message");
        require(bytes(message).length <= 64, "Message too long");

        emit MessageSent(msg.sender, message, block.timestamp);
    }
}
