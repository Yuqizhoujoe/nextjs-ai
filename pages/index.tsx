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
        height: "95vh",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden", // Ensures the image respects the border radius
          borderRadius: "50%", // Makes the container rounded
          height: 500,
          width: 500,
        }}
      >
        <Image src="/jojo.jpeg" alt="JOJO" layout="fill" objectFit="cover" />
      </Box>
    </Container>
  );
};

export default Index;
