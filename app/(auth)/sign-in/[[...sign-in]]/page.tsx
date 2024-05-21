"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const SignInPage = () => {
  const { theme } = useTheme();
  const clerkTheme = theme === "dark" ? dark : undefined;

  const bgColor = theme === "dark" ? "#1f2937" : undefined;
  const textColor = theme === "light" ? "#000000" : "#FFFFFF";

  const signInVariables = {
    colorPrimary: "#ffd800",
    colorBackground: bgColor,
    colorInputBackground: bgColor,
  };

  const signInAppearance = {
    baseTheme: clerkTheme,
    variables: signInVariables,
    text: {
      color: textColor,
    },
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <SignIn appearance={signInAppearance} path="/sign-in" />
    </div>
  );
};

export default SignInPage;
