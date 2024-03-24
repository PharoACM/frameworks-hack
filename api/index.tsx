import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import {
  getPharoBalance,
  getShibPriceData,
  getUserData,
  hasPolicy,
  sendMintTransaction,
} from "../utils/client.js";
import { Address } from "viem";
import { abi as pharoCoverAbi } from "../abis/PharoCover.js";
import { baseSepolia } from "viem/chains";
import { pharoCoverAddress, pharoTokenAddress } from "../utils/config.js";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: "edge",
// };

type State = {
  pharoBalance: bigint;
  liked: boolean;
};

export const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string }),
});

let pharoBalance: bigint = 0n;

app.frame("/", async (c) => {
  const { status } = c;

  return c.res({
    image: tempImage("Welcome to Pharo!\nClick Next to participate.", status),
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

  const userData = await getUserData(frameData?.fid!);

  let userAddress: Address;

  if (!verified) {
    return c.res({
      image: tempImage("Not Verified frame message.", status),
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
  }

  if (userData.users[0]) {
    userAddress = userData.users[0].custody_address as Address;
    if (userAddress.length > 2) {
      pharoBalance = await getPharoBalance(userAddress);

      if (pharoBalance < 1500) {
        const mintTx = await sendMintTransaction(
          // "0x3f15B8c6F9939879Cb030D6dd935348E57109637" as `0x${string}`
          userAddress
        );

        return c.res({
          image: tempImage(
            `Mint Successful! You now have 1500 PHRO tokens \n${mintTx}. \n Click next to participate.`,
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

  return c.res({
    image: tempImage(
      pharoBalance > 0
        ? "You have PHRO tokens. Click next to participate."
        : "PHRO balance is 0, something went wrong. Please try again.",
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
  const userData = await getUserData(frameData?.fid!);

  let userAddress: Address;

  if (!verified) {
    return c.res({
      image: tempImage("Not Verified frame message.", status),
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
  }

  if (userData.users[0]) {
    userAddress = userData.users[0].custody_address as Address;
    // local testing
    // pharoBalance = await getPharoBalance(
    //   "0x3f15B8c6F9939879Cb030D6dd935348E57109637" as Address
    // );

    const alreadyParticipated = await hasPolicy(userAddress);
    if (!alreadyParticipated) {
      return c.res({
        image: tempImage("You have already participated.", status),
        intents: [<Button.Reset>Reset</Button.Reset>],
      });
    }

    pharoBalance = await getPharoBalance(userAddress);
    const shibPrice = await getShibPriceData();

    return c.res({
      action: "/finish",
      image: tempImage(
        `Current SHIB price ${shibPrice["shiba-inu"].usd} \nWelcome! Submit your estimate...`,
        status
      ),
      intents: [
        <TextInput placeholder="Enter your estimate..." />,
        <Button.Transaction target="/submit-rate">Submit</Button.Transaction>,
        status === "response" && <Button.Reset>Reset</Button.Reset>,
      ],
    });
  }

  return c.res({
    image: tempImage("Please connect your wallet to mint PHRO tokens.", status),
    intents: [],
  });
});

app.transaction("/submit-rate", async (c) => {
  const { buttonValue, inputText, frameData } = c;
  const userData = await getUserData(frameData?.fid!);
  let userAddress: Address;
  const rateEstimate = inputText || buttonValue;
  userAddress = userData.users[0].verified_addresses
    .eth_addresses[0] as Address;

  return c.contract({
    abi: pharoCoverAbi,
    chainId: `eip155:${baseSepolia.id}`,
    functionName: "createCoverPolicy",
    to: pharoCoverAddress,
    args: [
      userAddress,
      pharoTokenAddress,
      BigInt(0),
      {
        minCover: BigInt(3000),
        premium: BigInt(1500),
        rateEstimate: BigInt(rateEstimate as string),
        lengthOfCover: BigInt(604800), // seconds in a week
      },
    ],
  });
});

app.frame("/finish", (c) => {
  const { status, transactionId } = c;

  return c.res({
    image: tempImage(
      `Thank you for participating!\nYour tx hash: ${transactionId?.slice(
        0,
        4
      )}`,
      status
    ),
    intents: [
      <Button.Link href="https://warpcast.com/jaxcoder.eth/0xf5b0b729">
        Share
      </Button.Link>,
    ],
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
