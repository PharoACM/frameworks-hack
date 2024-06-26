export const abi = [
  {
    type: "constructor",
    inputs: [
      { name: "_phroTokenAddress", type: "address", internalType: "address" },
      {
        name: "_pharoPhinanceAddress",
        type: "address",
        internalType: "address",
      },
      { name: "_admin", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "arePharoFinancialsHealthy",
    inputs: [{ name: "pharoId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "closePolicy",
    inputs: [
      { name: "pharoId", type: "uint256", internalType: "uint256" },
      { name: "policyId", type: "uint256", internalType: "uint256" },
      { name: "coverBuyerAddress", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "collectCoverPremiums",
    inputs: [{ name: "pharoId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "success", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createCoverPolicy",
    inputs: [
      { name: "userAddress", type: "address", internalType: "address" },
      { name: "token", type: "address", internalType: "address" },
      { name: "pharoId", type: "uint256", internalType: "uint256" },
      {
        name: "sPolicy",
        type: "tuple",
        internalType: "struct PharoConstants.SignedPolicy",
        components: [
          { name: "minCover", type: "uint128", internalType: "uint128" },
          { name: "premium", type: "uint128", internalType: "uint128" },
          { name: "rateEstimate", type: "uint128", internalType: "uint128" },
          { name: "lengthOfCover", type: "uint128", internalType: "uint128" },
        ],
      },
    ],
    outputs: [
      { name: "success", type: "bool", internalType: "bool" },
      { name: "createdPolicyId", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "discoverPharoMarket",
    inputs: [
      { name: "_pharoMarket", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "distributeCover",
    inputs: [
      { name: "pharoId", type: "uint256", internalType: "uint256" },
      { name: "trueEventTime", type: "uint32", internalType: "uint32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getActiveMarketPolicies",
    inputs: [{ name: "pharoId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "activePolicies",
        type: "tuple[]",
        internalType: "struct PharoConstants.CoverPolicy[]",
        components: [
          { name: "creationDate", type: "uint256", internalType: "uint256" },
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum PharoConstants.CoverPolicyStatus",
          },
          { name: "pharoId", type: "uint256", internalType: "uint256" },
          { name: "coverBought", type: "uint256", internalType: "uint256" },
          { name: "lengthOfCover", type: "uint256", internalType: "uint256" },
          { name: "reward", type: "uint256", internalType: "uint256" },
          { name: "premiumPaid", type: "uint256", internalType: "uint256" },
          { name: "premium", type: "uint256", internalType: "uint256" },
          { name: "rateEstimate", type: "uint256", internalType: "uint256" },
          { name: "minCover", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBuyerPolicies",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "policies",
        type: "tuple[]",
        internalType: "struct PharoConstants.CoverPolicy[]",
        components: [
          { name: "creationDate", type: "uint256", internalType: "uint256" },
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum PharoConstants.CoverPolicyStatus",
          },
          { name: "pharoId", type: "uint256", internalType: "uint256" },
          { name: "coverBought", type: "uint256", internalType: "uint256" },
          { name: "lengthOfCover", type: "uint256", internalType: "uint256" },
          { name: "reward", type: "uint256", internalType: "uint256" },
          { name: "premiumPaid", type: "uint256", internalType: "uint256" },
          { name: "premium", type: "uint256", internalType: "uint256" },
          { name: "rateEstimate", type: "uint256", internalType: "uint256" },
          { name: "minCover", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBuyerPoliciesCount",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "pharoIds", type: "uint256[]", internalType: "uint256[]" },
    ],
    outputs: [{ name: "count", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNrOfRejPoliciesByPharoId",
    inputs: [{ name: "pharoId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPolicyById",
    inputs: [{ name: "policyId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "success", type: "bool", internalType: "bool" },
      {
        name: "policy",
        type: "tuple",
        internalType: "struct PharoConstants.CoverPolicy",
        components: [
          { name: "creationDate", type: "uint256", internalType: "uint256" },
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum PharoConstants.CoverPolicyStatus",
          },
          { name: "pharoId", type: "uint256", internalType: "uint256" },
          { name: "coverBought", type: "uint256", internalType: "uint256" },
          { name: "lengthOfCover", type: "uint256", internalType: "uint256" },
          { name: "reward", type: "uint256", internalType: "uint256" },
          { name: "premiumPaid", type: "uint256", internalType: "uint256" },
          { name: "premium", type: "uint256", internalType: "uint256" },
          { name: "rateEstimate", type: "uint256", internalType: "uint256" },
          { name: "minCover", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getPolicyByPharoIdAndPolicyId",
    inputs: [
      { name: "pharoId", type: "uint256", internalType: "uint256" },
      { name: "policyId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "success", type: "bool", internalType: "bool" },
      {
        name: "policy",
        type: "tuple",
        internalType: "struct PharoConstants.CoverPolicy",
        components: [
          { name: "creationDate", type: "uint256", internalType: "uint256" },
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "owner", type: "address", internalType: "address" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum PharoConstants.CoverPolicyStatus",
          },
          { name: "pharoId", type: "uint256", internalType: "uint256" },
          { name: "coverBought", type: "uint256", internalType: "uint256" },
          { name: "lengthOfCover", type: "uint256", internalType: "uint256" },
          { name: "reward", type: "uint256", internalType: "uint256" },
          { name: "premiumPaid", type: "uint256", internalType: "uint256" },
          { name: "premium", type: "uint256", internalType: "uint256" },
          { name: "rateEstimate", type: "uint256", internalType: "uint256" },
          { name: "minCover", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRejectedPolicy",
    inputs: [
      { name: "pharoId", type: "uint128", internalType: "uint128" },
      { name: "policyId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "policy",
        type: "tuple",
        internalType: "struct PharoConstants.SignedPolicy",
        components: [
          { name: "minCover", type: "uint128", internalType: "uint128" },
          { name: "premium", type: "uint128", internalType: "uint128" },
          { name: "rateEstimate", type: "uint128", internalType: "uint128" },
          { name: "lengthOfCover", type: "uint128", internalType: "uint128" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoleAdmin",
    inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantKeeperRole",
    inputs: [{ name: "newKeeper", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "grantOperatorRole",
    inputs: [{ name: "newOperator", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pharoIdToPolicyIds",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pharoMarket",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IPharoMarket" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pharoPhinance",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IPharoPhinance" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "phroToken",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IPHROToken" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "phroTokenAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "callerConfirmation", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updatePolicy",
    inputs: [
      { name: "pharoId", type: "uint256", internalType: "uint256" },
      { name: "policyId", type: "uint256", internalType: "uint256" },
      { name: "reward", type: "uint256", internalType: "uint256" },
      { name: "coverBought", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updatePolicyPremium",
    inputs: [
      { name: "pharoId", type: "uint256", internalType: "uint256" },
      { name: "policyId", type: "uint256", internalType: "uint256" },
      { name: "newPremium", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "BadPharo",
    inputs: [
      {
        name: "actor",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "pharo_id",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CoverPolicyAccepted",
    inputs: [
      {
        name: "coverBuyer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CoverPolicyClosed",
    inputs: [
      {
        name: "policyId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "coverBuyer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CoverPolicyInitialized",
    inputs: [
      {
        name: "pharo_id",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "policy_id",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "coverBuyer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CoverPolicyRejected",
    inputs: [
      {
        name: "coverBuyer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CoverPolicyUpdated",
    inputs: [
      {
        name: "pharoId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "policyId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "reward",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "coverBought",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ExecuteCBFinancialsError",
    inputs: [
      {
        name: "wallet_id",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "pharo_id",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ExecuteCoverPaymentError",
    inputs: [
      {
        name: "pharo_id",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "cover_amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "wallet_id",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "InsufficientFundsOrAllowance",
    inputs: [
      {
        name: "actor",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "pharo_id",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleAdminChanged",
    inputs: [
      { name: "role", type: "bytes32", indexed: true, internalType: "bytes32" },
      {
        name: "previousAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "newAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleGranted",
    inputs: [
      { name: "role", type: "bytes32", indexed: true, internalType: "bytes32" },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleRevoked",
    inputs: [
      { name: "role", type: "bytes32", indexed: true, internalType: "bytes32" },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "ALLOWANCE_TOO_LOW", inputs: [] },
  { type: "error", name: "ALREADY_LOCKED", inputs: [] },
  { type: "error", name: "AMOUNT_ZERO", inputs: [] },
  { type: "error", name: "AccessControlBadConfirmation", inputs: [] },
  {
    type: "error",
    name: "AccessControlUnauthorizedAccount",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "neededRole", type: "bytes32", internalType: "bytes32" },
    ],
  },
  { type: "error", name: "MustBeGreaterThanZero", inputs: [] },
  { type: "error", name: "NOT_ALLOWED", inputs: [] },
  { type: "error", name: "NOT_ENOUGH_BALANCE", inputs: [] },
  { type: "error", name: "NOT_LOCKED", inputs: [] },
  { type: "error", name: "NO_APPROVAL", inputs: [] },
  { type: "error", name: "PAST_DEADLINE", inputs: [] },
  { type: "error", name: "WRONG_ROLE", inputs: [] },
  { type: "error", name: "WrongRole", inputs: [] },
  { type: "error", name: "ZERO_ADDRESS", inputs: [] },
] as const;
