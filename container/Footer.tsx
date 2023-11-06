import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const Root = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.common.white,
    position: "fixed",
    bottom: 0,
    width: "100%",
  };
});

const StyledLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(1),
}));

function Footer(): JSX.Element {
  return (
    <Root
      sx={{
        boxShadow: 4,
      }}
    >
      <Typography variant="body2" align="center" color={grey[400]}>
        JoJo &copy; {new Date().getFullYear()}
      </Typography>
      <Typography variant="body2" align="center" color={grey[400]}>
        AI Integration
        <StyledLink href="https://github.com/Yuqizhoujoe/nextjs-ai-cypress">
          JoJo Github
        </StyledLink>
      </Typography>
    </Root>
  );
}

export default Footer;
