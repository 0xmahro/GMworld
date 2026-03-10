// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../GMWorldV2.sol";

contract DeployGMWorldV2 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        GMWorldV2 gm = new GMWorldV2();
        console.log("GMWorldV2 deployed at:", address(gm));
        console.log("Owner (fee recipient):", gm.owner());
        console.log("Fee per message:", gm.FEE(), "wei");
        vm.stopBroadcast();
    }
}
