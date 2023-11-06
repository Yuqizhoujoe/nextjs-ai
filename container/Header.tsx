"use client";
import * as React from "react";
import { useEffect, useState } from "react";

// component
// MUI
import {
  Box,
  Button,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";

// nextjs
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import Link from "next/link";

// Next Auth
import { signIn, signOut, useSession } from "next-auth/react";
import MenuIcon from "@mui/icons-material/Menu";

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
  console.log("HEADER_BOX_THEME", {
    theme,
  });

  return {
    position: "static",
    backgroundColor: grey[50],
    color: theme.palette.common.white,
  };
});

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(null);

  // Effect to handle the resize event
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const renderDrawerContents = () => {
    return (
      <Box role="presentation" onClick={() => setOpenDrawer(false)}>
        <List>
          {pages.map((page) => (
            <ListItemButton key={page.key} sx={{ justifyContent: "center" }}>
              <Link href={page.url}>
                <ListItemText secondary={page.page} />
              </Link>
            </ListItemButton>
          ))}
        </List>
      </Box>
    );
  };

  const renderDrawer = () => {
    return (
      <>
        <Button color="primary" onClick={() => setOpenDrawer(true)}>
          <MenuIcon />
        </Button>
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiPaper-root": {
              // backgroundColor: "#e2e0e0",
            },
          }}
        >
          {renderDrawerContents()}
        </Drawer>
      </>
    );
  };

  const renderHeaderContents = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {renderAuthBtn()}
        {windowWidth < 500 && renderDrawer()}
        {windowWidth >= 500 && renderPages()}
      </Box>
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
          {renderHeaderContents()}
        </Container>
      </HeaderBox>
    </div>
  );
}
