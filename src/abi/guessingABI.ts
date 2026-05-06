export default {
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address"
        }
      ],
      name: "AddressEmptyCode",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "implementation",
          type: "address"
        }
      ],
      name: "ERC1967InvalidImplementation",
      type: "error"
    },
    {
      inputs: [],
      name: "ERC1967NonPayable",
      type: "error"
    },
    {
      inputs: [],
      name: "FailedCall",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidInitialization",
      type: "error"
    },
    {
      inputs: [],
      name: "NotInitializing",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "OwnableInvalidOwner",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error"
    },
    {
      inputs: [],
      name: "UUPSUnauthorizedCallContext",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "slot",
          type: "bytes32"
        }
      ],
      name: "UUPSUnsupportedProxiableUUID",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "number",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "winningAmount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "ercIndex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "betType",
          type: "uint256"
        }
      ],
      name: "Bet",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "version",
          type: "uint64"
        }
      ],
      name: "Initialized",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "number",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hash",
          type: "bytes32"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "betType",
          type: "uint256"
        }
      ],
      name: "Lottery",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "ercIndex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "number",
          type: "uint256"
        }
      ],
      name: "Reward",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "ercIndex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "TeamClaim",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "ercIndex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "types",
          type: "uint256"
        }
      ],
      name: "TeamReward",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "implementation",
          type: "address"
        }
      ],
      name: "Upgraded",
      type: "event"
    },
    {
      inputs: [],
      name: "AGBStake",
      outputs: [
        {
          internalType: "contract IAGBStake",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "SwapRouter",
      outputs: [
        {
          internalType: "contract ISwapRouter",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "UPGRADE_INTERFACE_VERSION",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "USDTToken",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "contract IERC20",
          name: "erc20",
          type: "address"
        }
      ],
      name: "addErc20Pool",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256"
        }
      ],
      name: "betInfo",
      outputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "number",
          type: "uint256"
        },
        {
          internalType: "contract IERC20",
          name: "erc20",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "ercIndex",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "betType",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "isClaim",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "erc20Pool",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "number",
          type: "uint256"
        }
      ],
      name: "lottery",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "lotteryDraw",
      outputs: [
        {
          internalType: "uint256",
          name: "lotteryBlockNumber",
          type: "uint256"
        },
        {
          internalType: "bytes32",
          name: "blockHash",
          type: "bytes32"
        },
        {
          internalType: "uint256",
          name: "startId",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "count",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "betType",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "number",
          type: "uint256"
        },
        {
          internalType: "bytes32",
          name: "blockHash",
          type: "bytes32"
        }
      ],
      name: "manuaLottery",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "ercIndex",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "betType",
          type: "uint256"
        }
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "nextId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "nextNumber",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "nftFundPool",
      outputs: [
        {
          internalType: "contract IFundPool",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      name: "numberUserTotal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256"
        }
      ],
      name: "pending",
      outputs: [
        {
          internalType: "uint256",
          name: "winning",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "proxiableUUID",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256"
        }
      ],
      name: "reaward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "startBlockNumber",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        },
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      name: "teamErc20RewardInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "storeValue",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "claimValue",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address"
        }
      ],
      name: "teamPending",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]"
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "teamReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address"
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes"
        }
      ],
      name: "upgradeToAndCall",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "userHoldIds",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      name: "userInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "guessingValue",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ]
};
