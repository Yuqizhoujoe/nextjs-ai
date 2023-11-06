import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export default NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // @ts-ignore
    async signIn(userInfo) {
      console.log("NEXT_AUTH_SIGN_IN", {
        userInfo,
      });

      const { user, account, profile } = userInfo;

      if (
        user &&
        account.provider === "google" &&
        // @ts-ignore
        profile.email_verified === true &&
        profile.email === "kevinyuqi123@gmail.com"
      ) {
        console.log("USER_SIGN_IN");
        return true;
      } else {
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
