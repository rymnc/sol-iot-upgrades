//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Upgrade is Ownable {
    address manager;

    enum upgradeType {Major, Minor}

    mapping(address => bytes32) private device;
    mapping(upgradeType => mapping(uint8 => bytes32)) private version;
    mapping(upgradeType => uint8) private currentVersion;
    mapping(address => bool) private allowList;

    event NewUpgrade(upgradeType _upgradeType, bytes32 ipfsHash);
    event NewMember(address _address);
    event NewDevice(address _address, bytes32 publicKey);

    modifier onlyAllowList {
        require(isAllowed(msg.sender) == true);
        _;
    }

    constructor(
        address _owner,
        uint8 _minorVersion,
        uint8 _majorVersion
    ) {
        manager = _owner;
        if (msg.sender != _owner) {
            transferOwnership(manager);
        }
        currentVersion[upgradeType.Major] = _majorVersion;
        currentVersion[upgradeType.Minor] = _minorVersion;
        allowList[manager] = true;
    }

    function newUpgrade(upgradeType _upgradeType, bytes32 _ipfsHash)
        public
        onlyOwner
    {
        currentVersion[_upgradeType] += 1;
        version[_upgradeType][currentVersion[_upgradeType]] = _ipfsHash;
        emit NewUpgrade(_upgradeType, _ipfsHash);
    }

    function getVersion(upgradeType _upgradeType)
        public
        view
        onlyAllowList
        returns (uint8)
    {
        return currentVersion[_upgradeType];
    }

    function getHash(upgradeType _upgradeType, uint8 _version)
        public
        view
        onlyAllowList
        returns (bytes32)
    {
        require(currentVersion[_upgradeType] != 0);
        return version[_upgradeType][_version];
    }

    function getLatestHash(upgradeType _upgradeType)
        public
        view
        onlyAllowList
        returns (bytes32)
    {
        return getHash(_upgradeType, currentVersion[_upgradeType]);
    }

    function isAllowed(address _address) public view returns (bool) {
        return allowList[_address];
    }

    function isDevice(address _address) public view returns (bool) {
        if (device[_address] != "") return true;
        return false;
    }

    function addToAllowlist(address _address) public onlyOwner {
        require(!isAllowed(_address), "Address already in allowList");
        allowList[_address] = true;
        emit NewMember(_address);
    }

    function addDevice(address _address, bytes32 publicKey) public onlyOwner {
        require(!isDevice(_address), "Device already exists");
        device[_address] = publicKey;
        addToAllowlist(_address);
        emit NewDevice(_address, publicKey);
    }
}
