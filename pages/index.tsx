import React from "react";

import Image from "next/image";
import { Box, Container } from "@mui/material";

const Index: React.FC = () => {
  return (
    <Container
      data-testid="home-page"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: {
          mobile: "80vh",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden", // Ensures the image respects the border radius
        }}
      >
        <Image
          src="/makima.jpeg"
          alt="JOJO"
          objectFit="cover"
          height={300}
          width={300}
        />
      </Box>
    </Container>
  );
};

export default Index;
