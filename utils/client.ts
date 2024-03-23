import {
  Address,
  Hex,
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { config } from "dotenv";
import { pharoTokenAddress, defaultTokensToMint } from "./config.js";
import { abi as pharoTokenAbi } from "../abis/PharoToken.js";
// import { abi as pharoCoverAbi } from "../abis/PharoCover.js";

config();

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
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

// export const sendPolicyTransaction = async (
//   to: Address,
//   data: Hex,
//   _value = BigInt(0)
// ) => {
//   const { request } = await publicClient.simulateContract({
//     account: adminAccount,
//     address: pharoTokenAddress,
//     abi: pharoCoverAbi,
//     functionName: "createCoverPolicy",
//     args: [],
//   });

//   return await walletClient.writeContract(request);
// };
