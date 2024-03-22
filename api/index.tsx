import {
  Button,
  ContractTransactionParameters,
  FrameResponse,
  Frog,
  TextInput,
  TransactionParameters,
} from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";
import { encodeFunctionData, formatEther, parseEther, parseGwei } from "viem";
import { baseSepolia, base, arbitrumSepolia } from "viem/chains";
import { abi as pharoTokenAbi } from "../abis/PharoToken.js";

const pharoTokenAddress = "0xB4204ecc047F026ABfC3B5794cFDBF7dAC7C4C9E";
const defaultTokens = 1500;

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string }),
});

// todo: mocked until we fetch from chain
const pharoBalance: number = 10;

app.frame("/", (c) => {
  const { status, frameData } = c;

  console.log("/", { pharoBalance, frameData });

  return c.res({
    image: tempImage(
      pharoBalance === 0
        ? "You don't have any PHRO tokens. Go ahead and mint some 🥳"
        : "Click next to participate.",
      status
    ),
    intents: [
      pharoBalance === 0 && (
        <Button.Transaction target="/mint" action="/mint-success">
          Mint
        </Button.Transaction>
      ),
      pharoBalance > 0 && (
        <Button value="participate" action="/participate">
          Next
        </Button>
      ),
      status === ("response" || "redirect") && (
        <Button.Reset>Reset</Button.Reset>
      ),
    ],
  });
});

app.transaction("/mint", (c) => {
  const { frameData, verified } = c;
  // const { castId, fid, messageHash, network, timestamp, url } = frameData;

  console.log("frameData", frameData);

  const contractData: ContractTransactionParameters = {
    abi: pharoTokenAbi,
    chainId: `eip155:${baseSepolia.id}`,
    functionName: "mintTokensTo",
    args: ["0xcBf407C33d68a55CB594Ffc8f4fD1416Bba39DA5", parseEther("1500")],
    to: pharoTokenAddress,
  };

  if (!verified) {
    return c.contract(contractData);
  }
});

app.frame("/mint-success", (c) => {
  const { status, verified, frameData } = c;

  console.log("frameData", { frameData, verified });

  if (!verified) {
    return c.res({
      image: tempImage(
        "Please connect your wallet to mint PHRO tokens.",
        status
      ),
      intents: [],
    });
  }

  return c.res({
    image: tempImage(
      "Mint Successful! You now have 1500 PHRO tokens. Click next to participate.",
      status
    ),
    intents: [pharoBalance > 0 && <Button action="/participate">Next</Button>],
  });
});

app.frame("/participate", (c) => {
  const { status } = c;
  return c.res({
    image: tempImage("Welcome! Submit your estimate...", status),
    intents: [
      <TextInput placeholder="Enter your estimate..." />,
      <Button action="/submit-rate">Submit</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/submit-rate", (c) => {
  const { buttonValue, inputText, status } = c;
  const rateEstimate = inputText || buttonValue;

  console.log("rateEstimate", rateEstimate);

  // const contractData: ContractTransactionParameters = {
  //   abi: pharoTokenAbi,
  //   chainId: `eip155:${baseSepolia.id}`,
  //   functionName: "submitRate",
  //   args: [rateEstimate],
  //   to: pharoTokenAddress,
  // };

  // return c.contract(contractData);
  return c.res({
    image: tempImage(`Your estimate is ${rateEstimate}.`, status),
    intents: [
      <Button value="finish" action="/finish">
        Finish
      </Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/finish", (c) => {
  const { status } = c;
  return c.res({
    image: tempImage("Thank you for participating!", status),
    intents: [],
  });
});

function tempImage(
  content: string,
  status: "initial" | "redirect" | "response"
) {
  return (
    <div
      style={{
        alignItems: "center",
        background:
          status === "response"
            ? "linear-gradient(to right, #432889, #17101F)"
            : "black",
        backgroundSize: "100% 100%",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        height: "100%",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 60,
          fontStyle: "normal",
          letterSpacing: "-0.025em",
          lineHeight: 1.4,
          marginTop: 30,
          padding: "0 120px",
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </div>
    </div>
  );
}

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
