import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export type VariantLayout = {
  variant: "rectangular" | "text" | "circular";
  width: number;
  height: number;
};



type VariantProps = {
  layout: VariantLayout[];
};

export default function Variants({ layout }: VariantProps) {
  

  return (
    <Stack spacing={1}>
      <Skeleton animation="wave" />
      {layout.map((skl, index) => (
        <Skeleton
          key={index}
          variant={skl.variant}
          width={skl.width}
          height={skl.height}
        />
      ))}
    </Stack>
  );
}
