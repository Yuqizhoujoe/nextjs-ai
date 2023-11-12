import { Container } from "@mui/material";
import UserComponent from "../component/user/UserComponent";
import { useSession } from "next-auth/react";

export default function User() {
  const { data } = useSession();

  if (!data) return null;

  return (
    <Container data-testid="user-page" sx={{ marginTop: 5 }}>
      <UserComponent user={data.user} />
    </Container>
  );
}
