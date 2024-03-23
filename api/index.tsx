import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import {
  getPharoBalance,
  getShibPriceData,
  sendMintTransaction,
} from "../utils/client.js";
import { Address, formatEther } from "viem";

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
let pharoBalance: bigint = 0n;

app.frame("/", async (c) => {
  const { status, frameData } = c;

  // local testing
  pharoBalance = await getPharoBalance(
    "0x3f15B8c6F9939879Cb030D6dd935348E57109637" as Address
  );
  // pharoBalance = await getPharoBalance(frameData?.address! as Address);

  console.log("/", {
    pharoBalance: Number(formatEther(pharoBalance)).toFixed(4),
    frameData,
  });

  return c.res({
    image: tempImage(
      pharoBalance === 0n
        ? "🙀 You don't have any PHRO tokens. Go ahead and mint some 🥳"
        : "Click next to participate.",
      status
    ),
    intents: [
      pharoBalance < BigInt(1500) ? (
        <Button action="/mint">Mint</Button>
      ) : (
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

app.frame("/mint", async (c) => {
  const { frameData, verified, status } = c;
  // const { castId, fid, messageHash, network, timestamp, url } = frameData;

  const mintTx = await sendMintTransaction(
    "0x3f15B8c6F9939879Cb030D6dd935348E57109637" as `0x${string}`
  );

  console.log("frameData", { mintTx, verified, frameData });

  return c.res({
    image: tempImage(
      "Mint Successful! You now have 1500 PHRO tokens. Click next to participate.",
      status
    ),
    intents: [pharoBalance > 0 && <Button action="/participate">Next</Button>],
  });
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

app.frame("/participate", async (c) => {
  const { status } = c;

  const shibPrice = await getShibPriceData();

  console.log("shibPrice", shibPrice);

  return c.res({
    image: tempImage(
      `Current SHIB price ${shibPrice["shiba-inu"].usd} \nWelcome! Submit your estimate...`,
      status
    ),
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
