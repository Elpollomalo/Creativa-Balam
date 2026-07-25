import type { CSSProperties } from "react";
import { COLORS } from "./config";

export const containerStyle: CSSProperties = {
  background: COLORS.hueso,
  borderRadius: "20px",
  padding: "32px 24px",
  fontFamily: "'Inter', 'Arial', sans-serif",
  color: COLORS.negro,
  maxWidth: "480px",
  margin: "0 auto",
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
};

export const badgeStyle: CSSProperties = {
  display: "inline-block",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  color: COLORS.ambar,
  background: "rgba(201, 150, 44, 0.1)",
  border: "1px solid rgba(201, 150, 44, 0.3)",
  borderRadius: "6px",
  padding: "4px 12px",
  marginBottom: "14px",
};

export const introTitleStyle: CSSProperties = { fontSize: "22px", fontWeight: 800, marginBottom: "10px" };
export const introSubtitleStyle: CSSProperties = { fontSize: "13.5px", color: COLORS.piedra, lineHeight: 1.6, marginBottom: "10px" };
export const introBoxStyle: CSSProperties = {
  background: "rgba(27,77,62,0.06)",
  border: "1px solid rgba(27,77,62,0.15)",
  borderRadius: "10px",
  padding: "14px 16px",
  marginBottom: "14px",
  fontSize: "13px",
};
export const introListStyle: CSSProperties = { margin: "8px 0 0", paddingLeft: "18px", color: COLORS.piedra, lineHeight: 1.6 };

export const langButtonStyle: CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "14px 16px", borderRadius: "12px", border: `1.5px solid ${COLORS.piedraClaro}`,
  fontSize: "15px", fontWeight: 700, cursor: "pointer",
};

export const progressTrackStyle: CSSProperties = {
  width: "100%", height: "5px", background: "rgba(27,77,62,0.12)", borderRadius: "4px", overflow: "hidden", marginBottom: "10px",
};
export const progressFillStyle: CSSProperties = { height: "100%", background: COLORS.ambar, borderRadius: "4px", transition: "width 0.3s ease" };
export const blockLabelStyle: CSSProperties = { fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: COLORS.jade, marginBottom: "6px" };
export const questionStyle: CSSProperties = { fontSize: "18px", fontWeight: 700, lineHeight: 1.4 };
export const subtitleSmallStyle: CSSProperties = { fontSize: "12.5px", color: COLORS.piedra, marginTop: "6px", fontStyle: "italic" };

export const inputStyle: CSSProperties = {
  width: "100%", boxSizing: "border-box", fontSize: "15px", padding: "12px 14px", borderRadius: "10px",
  border: `1.5px solid ${COLORS.piedraClaro}`, outline: "none", fontFamily: "inherit",
};
export const textareaStyle: CSSProperties = { ...inputStyle, minHeight: "100px", resize: "vertical" };

export const optionCardStyle: CSSProperties = {
  padding: "12px 14px", borderRadius: "10px", border: `1.5px solid ${COLORS.piedraClaro}`,
  marginBottom: "10px", fontSize: "14px", cursor: "pointer", transition: "all 0.15s ease",
};
export const optionCardActiveStyle: CSSProperties = { border: `1.5px solid ${COLORS.jade}`, background: "rgba(27,77,62,0.08)", fontWeight: 700 };

export const scaleCardStyle: CSSProperties = {
  flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: "10px",
  border: `1.5px solid ${COLORS.piedraClaro}`, cursor: "pointer",
};

export const navRowStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };
export const primaryButtonStyle: CSSProperties = {
  background: COLORS.negro, color: COLORS.hueso, border: "none", borderRadius: "10px",
  padding: "13px 22px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
};
export const secondaryButtonStyle: CSSProperties = { background: "transparent", color: COLORS.piedra, border: "none", fontSize: "13px", cursor: "pointer" };
