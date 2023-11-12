// mui module breakpoints override
declare module "@mui/system" {
  interface BreakpointOverrides {
    laptop: true;
    tablet: true;
    mobile: true;
    desktop: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}
