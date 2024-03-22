import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// mocked until we fetch from chain
const pharoBalance: number = 0;

app.frame("/", (c) => {
  const { status } = c;
  // const rateEstimate = inputText || buttonValue;
  return c.res({
    image: tempImage(
      pharoBalance === 0
        ? "You don't have any PHRO tokens. Go ahead and mint some 🥳"
        : "Click next to participate.",
      status
    ),
    intents: [
      pharoBalance === 0 && (
        <Button value="participate" action="/mint">
          Mint
        </Button>
      ),
      pharoBalance > 0 && (
        <Button value="participate" action="/participate">
          Next
        </Button>
      ),
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/mint", (c) => {
  const { status } = c;
  return c.res({
    image: (
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
          {"Mint"}
        </div>
      </div>
    ),
    intents: [
      <Button value="submit-rate" action="/mint-tokens">
        Mint
      </Button>,
      status === "response" && <Button.Reset>Changed My Mind</Button.Reset>,
      status === "redirect" && <Button action="/participate">Next</Button>,
    ],
  });
});

app.frame("/participate", (c) => {
  const { status } = c;
  return c.res({
    image: tempImage("Welcome! Submit your estimate...", status),
    intents: [
      <TextInput placeholder="Enter your estimate..." />,
      <Button value="submit-rate" action="/submit-rate">
        Submit
      </Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/submit-rate", (c) => {
  const { buttonValue, inputText, status } = c;
  const rateEstimate = inputText || buttonValue;
  return c.res({
    image: tempImage(`Your estimate is ${rateEstimate}.`, status),
    intents: [
      <Button value="submit-rate" action="/finish">
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
