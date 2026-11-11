import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const T = {
  accentGold: "#F5C842",
  accentGoldDeep: "#C8A800",
};

export default function CoinIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44">
      <Circle cx="22" cy="22" r="21" fill={T.accentGold} />
      <Circle
        cx="22"
        cy="22"
        r="17"
        fill="none"
        stroke={T.accentGoldDeep}
        strokeWidth="2"
      />
      <Path
        d="M20 12 L20 32 M18 16 Q22 14 25 17 Q27 20 22 22 Q27 22 27 26 Q27 32 20 31"
        stroke="#8B6914"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
