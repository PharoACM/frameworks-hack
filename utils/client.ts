import {
  Address,
  Hex,
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  encodeFunctionData,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { config } from "dotenv";
import {
  pharoTokenAddress,
  defaultTokensToMint,
  pharoCoverAddress,
} from "./config.js";
import { abi as pharoTokenAbi } from "../abis/PharoToken.js";
import { abi as pharoCoverAbi } from "../abis/PharoCover.js";

config();

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
  // account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
});

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// or: const [address] = await client.requestAddresses()

// JSON-RPC Account
export const [address] = await walletClient.getAddresses();

// Local Account
export const adminAccount = privateKeyToAccount(
  process.env.PRIVATE_KEY as `0x${string}`
);

export const sendMintTransaction = async (to: Address, _value = BigInt(0)) => {
  const { request } = await publicClient.simulateContract({
    account: adminAccount,
    address: pharoTokenAddress,
    abi: pharoTokenAbi,
    functionName: "mintTokensTo",
    args: [to, parseEther(defaultTokensToMint.toString())],
  });

  return await walletClient.writeContract(request);
};

export const getPharoBalance = async (user: Address) => {
  const balance = await publicClient.readContract({
    address: pharoTokenAddress,
    abi: [
      {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
    ],
    functionName: "balanceOf",
    args: [user],
  });

  console.log("balance", balance);

  return BigInt(balance);
};

export const getShibPriceData = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=shiba-inu&vs_currencies=usd",
    {
      headers: {
        "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY as string,
      },
    }
  );

  return response.json();
};

export const sendPolicyTransaction = async (
  rateEstimate: bigint,
  coverBuyer: Address
) => {
  const { request } = await publicClient.simulateContract({
    address: pharoCoverAddress,
    abi: pharoCoverAbi,
    functionName: "createCoverPolicy",
    // [coverBuyer, token, pharoId, {signedPolicyData}]
    args: [
      coverBuyer,
      pharoTokenAddress,
      BigInt(0),
      {
        minCover: BigInt(3000),
        premium: BigInt(1500),
        rateEstimate: rateEstimate,
        lengthOfCover: BigInt(604800), // seconds in a week
      },
    ],
    account: adminAccount,
  });

  return await walletClient.writeContract(request);
};
