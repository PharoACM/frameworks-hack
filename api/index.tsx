import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import {
  getPharoBalance,
  getShibPriceData,
  sendMintTransaction,
  sendPolicyTransaction,
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

let pharoBalance: bigint = 0n;

app.frame("/", async (c) => {
  const { status } = c;

  return c.res({
    image: tempImage(`Click next to participate.`, status),
    intents: [
      <Button action="/mint">Next</Button>,
      status === ("response" || "redirect") && (
        <Button.Reset>Reset</Button.Reset>
      ),
    ],
  });
});

app.frame("/mint", async (c) => {
  const { frameData, verified, status } = c;
  // const { castId, fid, messageHash, network, timestamp, url } = frameData;
  // console.log("shit", { castId, fid, messageHash, network, timestamp, url });

  let userAddress: Address;

  if (!verified) {
    return c.res({
      image: tempImage("Not Verified frame message.", status),
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
  }

  if (frameData) {
    userAddress = frameData?.address as Address;
    if (userAddress.length > 2) {
      pharoBalance = await getPharoBalance(userAddress);

      if (pharoBalance < 1500) {
        const mintTx = await sendMintTransaction(
          // "0x3f15B8c6F9939879Cb030D6dd935348E57109637" as `0x${string}`
          userAddress
        );

        console.log("mintTx", mintTx);

        return c.res({
          image: tempImage(
            "Mint Successful! You now have 1500 PHRO tokens. Click next to participate.",
            status
          ),
          intents: [
            pharoBalance > 0 && <Button action="/participate">Next</Button>,
          ],
        });
      }
    }
    // local testing
    // pharoBalance = await getPharoBalance(
    //   "0x3f15B8c6F9939879Cb030D6dd935348E57109637" as Address
    // );
  }

  console.log("frameData", { verified, frameData });

  return c.res({
    image: tempImage(
      pharoBalance > 0
        ? "You have PHRO tokens. Click next to participate."
        : "Something went wrong. Please try again.",
      status
    ),
    intents: [
      pharoBalance > 0n && <Button action="/participate">Next</Button>,
      pharoBalance === 0n && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/participate", async (c) => {
  const { status, frameData, verified } = c;

  if (!verified) {
    return c.res({
      image: tempImage("Not Verified frame message.", status),
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
  }

  if (frameData) {
    // for local testing
    // frameData.address = "0x3f15B8c6F9939879Cb030D6dd935348E57109637";
    const userAddress: Address = frameData?.address as Address;
    if (userAddress.length > 2) {
      // local testing
      // pharoBalance = await getPharoBalance(
      //   "0x3f15B8c6F9939879Cb030D6dd935348E57109637" as Address
      // );
      pharoBalance = await getPharoBalance(userAddress);

      console.log("/participate", {
        pharoBalance: Number(formatEther(pharoBalance)).toFixed(4),
        frameData,
      });
    }

    const shibPrice = await getShibPriceData();

    console.log("some shit", { frameData, shibPrice });

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
  }

  return c.res({
    image: tempImage("Please connect your wallet to mint PHRO tokens.", status),
    intents: [],
  });
});

app.frame("/submit-rate", async (c) => {
  const { buttonValue, inputText, status, verified, frameData } = c;
  let userAddress: Address;

  if (!verified) {
    return c.res({
      image: tempImage("Not Verified frame message.", status),
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
  }
  const rateEstimate = inputText || buttonValue;

  console.log("rateEstimate", rateEstimate);

  if (frameData) {
    // for local testing
    // frameData.address = "0x3f15B8c6F9939879Cb030D6dd935348E57109637";
    userAddress = frameData?.address as Address;

    if (userAddress.length > 2) {
      // send create policy tx
      sendPolicyTransaction(BigInt(rateEstimate ?? 65), userAddress);
    }

    return c.res({
      image: tempImage(
        `Your estimate is in ${rateEstimate} hours SHIB will fall by 5% or more.`,
        status
      ),
      intents: [
        <Button value="finish" action="/finish">
          Finish
        </Button>,
        status === "response" && <Button.Reset>Reset</Button.Reset>,
      ],
    });
  }

  return c.res({
    image: tempImage("Something went wrong. Please try again", status),
    intents: [<Button.Reset>Reset</Button.Reset>],
  });
});

app.frame("/finish", (c) => {
  const { status } = c;
  return c.res({
    image: tempImage("Thank you for participating!", status),
    intents: [<Button.Link href="">Share</Button.Link>],
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
