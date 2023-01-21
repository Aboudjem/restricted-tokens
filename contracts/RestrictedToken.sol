// SPDX-License-Identifier: MIT License
pragma solidity =0.8.17;

import "./interfaces/IRestrictedToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title RestrictedToken
/// @dev An ERC20 token that allows an admin to ban specified addresses from sending and receiving tokens.
contract RestrictedToken is IRestrictedToken, ERC20, Ownable {
    mapping(address => bool) private _restricted;

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, 100_000_000 * 1E18);
    }

    /**
     * @dev Restricts the specified address from sending and receiving tokens.
     * @param _addr The address to be restricted.
     * require onlyOwner can call this function
     */
    function restrictAddress(address _addr) external onlyOwner {
        _restricted[_addr] = true;
        emit AddressRestrictionUpdated(_addr, true);
    }

    /**
     * @dev Un-restricts the specified address, allowing it to send and receive tokens.
     * @param _addr The address to be un-restricted.
     * require onlyOwner can call this function
     */
    function unRestrictAddress(address _addr) external onlyOwner {
        _restricted[_addr] = false;
        emit AddressRestrictionUpdated(_addr, false);
    }

    /**
     * @dev Returns whether the specified address is restricted or not.
     * @param _addr The address to check the restriction status of.
     * @return bool Returns true if the address is restricted, false otherwise.
     */
    function isRestricted(address _addr) external view returns (bool) {
        return _restricted[_addr];
    }

    /*
     * @dev checks if the 'from' and 'to' addresses are restricted before allowing the transfer to occur.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal override {
        require(!_restricted[from], "Restricted 'from' address.");
        require(!_restricted[to], "Restricted 'to' address.");
    }
}
