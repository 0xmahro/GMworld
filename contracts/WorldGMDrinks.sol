// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WorldGMDrinks
 * @notice Simple on-chain "buy a drink" interaction.
 * Records who bought which drink (string) and total purchases per drink.
 */
contract WorldGMDrinks {
    struct Drink {
        string name;
        uint256 price;
        uint256 totalPurchased;
    }

    Drink[] public drinks;
    mapping(address => string[]) public userDrinks;

    address public owner;

    event DrinkPurchased(address indexed buyer, string drink, uint256 amount);

    error InvalidDrink();
    error InsufficientETH();
    error NotOwner();
    error WithdrawFailed();

    constructor() {
        owner = msg.sender;

        uint256 p = 0.00003 ether;

        drinks.push(Drink({name: unicode"☕ Coffee", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🍵 Tea", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"💧 Water", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🍺 Beer", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🍷 Wine", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🥃 Soju", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🍂 Mate", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🌽 Horchata", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🧋 Thai Iced Tea", price: p, totalPurchased: 0}));
        drinks.push(Drink({name: unicode"🫖 Kahwa / Karkade", price: p, totalPurchased: 0}));
    }

    function buyDrink(uint256 drinkId) external payable {
        if (drinkId >= drinks.length) revert InvalidDrink();
        uint256 price = drinks[drinkId].price;
        if (msg.value < price) revert InsufficientETH();

        userDrinks[msg.sender].push(drinks[drinkId].name);
        drinks[drinkId].totalPurchased += 1;

        emit DrinkPurchased(msg.sender, drinks[drinkId].name, msg.value);
    }

    function getDrinksLength() external view returns (uint256) {
        return drinks.length;
    }

    function getUserDrinks(address user) external view returns (string[] memory) {
        return userDrinks[user];
    }

    function withdraw() external {
        if (msg.sender != owner) revert NotOwner();
        (bool sent, ) = owner.call{value: address(this).balance}("");
        if (!sent) revert WithdrawFailed();
    }
}

