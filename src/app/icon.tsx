import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "linear-gradient(135deg, #05241e 0%, #0d4a3e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6ee7b7",
          fontWeight: 900,
          borderRadius: "8px",
          border: "1.5px solid rgba(52, 211, 153, 0.8)",
          letterSpacing: "-0.5px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        AR
      </div>
    ),
    {
      ...size,
    }
  );
}
