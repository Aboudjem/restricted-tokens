// SPDX-License-Identifier: MIT License
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RestrictedToken
 * @dev An ERC20 token that allows an admin to ban specified addresses from sending and receiving tokens.
 */
interface IRestrictedToken is IERC20 {
    /**
     * @dev Emitted when the restriction status of an address is updated.
     * @param _addr The address whose restriction status was updated.
     * @param _restricted The new restriction status of the address.
     */
    event AddressRestrictionUpdated(address indexed _addr, bool _restricted);

    /**
     * @dev Restricts the specified address from sending and receiving tokens.
     * @param _addr The address to be restricted.
     */
    function restrictAddress(address _addr) external;

    /**
     * @dev Un-restricts the specified address, allowing it to send and receive tokens.
     * @param _addr The address to be un-restricted.
     */
    function unRestrictAddress(address _addr) external;

    /**
     * @dev Returns whether the specified address is restricted or not.
     * @param _addr The address to check the restriction status of.
     * @return bool Returns true if the address is restricted, false otherwise.
     */
    function isRestricted(address _addr) external view returns (bool);
}
