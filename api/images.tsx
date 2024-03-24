import { landingImage as image } from "../api/images.js";

export const landingImage = (content: any) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      fontWeight: 600,
    }}
  >
    {image}
    <div style={{ marginTop: -150 }}>{content}</div>
  </div>
);
