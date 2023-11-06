import React from "react";

// mui
import { Container } from "@mui/material";

// nextjs
import dynamic from "next/dynamic";

const ImageGeneration = dynamic(
  () => import("../component/imageGeneration/ImageGeneration"),
  {}
);

export default function imageGeneration() {
  return (
    <Container data-testid="image_generation_page">
      <ImageGeneration />
    </Container>
  );
}
