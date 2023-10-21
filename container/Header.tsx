import * as React from "react";

// component
import Search from "../component/common/Search";

// MUI
import { Box, Container } from "@mui/material";
import { grey } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";

// nextjs
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Button from "../component/common/Button";
import { useRouter } from "next/router";

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

  const handleClick = async (e: any, url: string) => {
    e.preventDefault();
    await router.push(url);
  };

  const renderPages = () => {
    return pages.map((page) => {
      return (
        <div key={page.key}>
          <Button
            key={page.key}
            id={page.key}
            type="button"
            style="purple_to_blue"
            clickFn={(e) => handleClick(e, page.url)}
          >
            {page.page}
          </Button>
        </div>
      );
    });
  };

  return (
    <div className="w-full" data-testid="header-container">
      <HeaderBox sx={{ boxShadow: 2 }}>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
            >
              <HomeIcon color="primary" />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              minWidth: 563,
              marginLeft: 1,
            }}
          >
            {renderPages()}
          </Box>
        </Container>
      </HeaderBox>
    </div>
  );
}
