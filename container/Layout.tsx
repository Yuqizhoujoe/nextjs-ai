import React, { ReactNode } from "react";

// Material UI
import { Container } from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";

// components
import Header from "./Header";
import Footer from "./Footer";

// Next Auth
// context
import { AppProvider } from "../shared/context";

// firebase

interface ContainerProps {
  children: ReactNode;
}

// Define the theme breakpoints
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      laptop: 1024,
      tablet: 640,
      mobile: 0,
      desktop: 1280,
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

// Define a styled component that uses the theme breakpoints
const MainContainer = styled("div")(({ theme }) => {
  return {
    height: "90vh",
    overflow: "auto",
  };
});

const ChildrenContainer = styled(Container)(({ theme }) => {
  return {
    marginBottom: "10%",
  };
});

function Layout({ children }: ContainerProps): JSX.Element {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <MainContainer data-testid="layout-container">
          <Header />
          <ChildrenContainer
            data-testid="main-content-container"
            sx={{ padding: { mobile: 0 } }}
          >
            {children}
          </ChildrenContainer>
          <Footer />
        </MainContainer>
      </ThemeProvider>
    </AppProvider>
  );
}

export default Layout;
