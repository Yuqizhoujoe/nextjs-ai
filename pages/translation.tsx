import { Container } from "@mui/material";
import dynamic from "next/dynamic";
// import TranslationComponent from "../client/component/translation/TranslationComponent";

const Translation = dynamic(
  () => import("../component/translation/Translation"),
  {
    ssr: true,
  }
);

export default function translation() {
  return (
    <Container data-testid="translation_page">
      <Translation />
    </Container>
  );
}
