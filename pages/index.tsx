import React from "react";

import Image from "next/image";
import { Box, Container } from "@mui/material";

const Index: React.FC = () => {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: {
          xs: "80vh",
          lg: "95vh", // Height for screens 1500px and greater
        },
        width: "100vw",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden", // Ensures the image respects the border radius
        }}
      >
        <Image
          src="/jojo.png"
          alt="JOJO"
          objectFit="cover"
          height={500}
          width={500}
        />
      </Box>
    </Container>
  );
};

export default Index;
