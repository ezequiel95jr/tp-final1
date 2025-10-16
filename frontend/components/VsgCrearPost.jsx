import React from "react";
import Svg, { Path } from "react-native-svg";

export default function MlCreateSingleMetricJob({ width = 32, height = 32, color = "black" }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
    >
      <Path
        fill={color}
        d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16a16 16 0 0 1-16 16m0-30C8.268 2 2 8.268 2 16s6.268 14 14 14s14-6.268 14-14A14 14 0 0 0 16 2"
      />
      <Path
        fill={color}
        d="M23 15h-6V9h-2v6H9v2h6v6h2v-6h6z"
      />
    </Svg>
  );
}
