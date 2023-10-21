import { Container } from "@mui/material";
import Search from "../component/common/Search";
import React from "react";

export default function search() {
  return (
    <Container data-testid="search-page">
      <Search />
    </Container>
  );
}
