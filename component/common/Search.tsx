import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { styled } from "@mui/material/styles";
import Link from "next/link";

const SearchPagePaper = styled(Paper)(({ theme }) => {
  return {
    component: "form",
    width: "70%",
    margin: "5rem auto",
    p: "2px 4px",
    display: "flex",
    justifyContent: "center",
  };
});

export default function Search() {
  const params = useSearchParams();
  const q = params.get("q");

  const [query, setQuery] = useState("");

  return (
    <SearchPagePaper>
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ "aria-label": "search google maps" }}
        onChange={(evt) => setQuery(evt.target.value)}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <Link href={`/search?q=${query}`}>
          <SearchIcon />
        </Link>
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </SearchPagePaper>
  );
}
