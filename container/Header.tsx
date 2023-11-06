import * as React from "react";

// component
// MUI
import { Box, Button, Container } from "@mui/material";
import { grey } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";

// nextjs
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import Link from "next/link";

// Next Auth
import { signIn, signOut, useSession } from "next-auth/react";

const pages = [
  {
    key: "chat",
    page: "Chat",
    url: "/chat",
  },
  {
    key: "imageGeneration",
    page: "Image Generation",
    url: "/imageGeneration",
  },
  {
    key: "translation",
    page: "Translation",
    url: "/translation",
  },
  {
    key: "search",
    page: "Search",
    url: "/search",
  },
];

const HeaderBox = styled(Box)(({ theme }) => {
  return {
    position: "static",
    backgroundColor: grey[50],
    color: theme.palette.common.white,
  };
});

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = async (url: string) => {
    await router.push(url);
  };

  const renderPages = () => {
    return pages.map((page) => {
      return (
        <Button
          key={page.key}
          color="primary"
          variant="text"
          onClick={() => handleClick(page.url)}
        >
          {page.page}
        </Button>
      );
    });
  };

  const renderAuthBtn = () => {
    if (session) {
      return (
        <Button
          color="secondary"
          size="large"
          variant="text"
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: "/",
            })
          }
        >
          Sign out
        </Button>
      );
    }

    return (
      // <Paper
      //   elevation={0}
      //   sx={{
      //     margin: 1,
      //     display: "flex",
      //     justifyContent: "center",
      //     flexDirection: "column",
      //   }}
      // >
      //   <GoogleButton onClick={() => signIn()} />
      // </Paper>
      <Button
        color="error"
        size="large"
        variant="text"
        onClick={() => signIn()}
      >
        Sign In
      </Button>
    );
  };

  return (
    <div className="w-full" data-testid="header-container">
      <HeaderBox sx={{ boxShadow: 2 }}>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/">
              <IconButton
                color="primary"
                sx={{ p: "10px" }}
                aria-label="directions"
              >
                <HomeIcon color="primary" />
              </IconButton>
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              minWidth: 563,
              marginLeft: 1,
            }}
          >
            {renderAuthBtn()}
            {renderPages()}
          </Box>
        </Container>
      </HeaderBox>
    </div>
  );
}
