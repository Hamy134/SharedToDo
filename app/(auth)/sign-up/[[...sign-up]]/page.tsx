"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const SignUpPage = () => {
  const { theme } = useTheme();
  const clerkTheme = theme === "dark" ? dark : undefined;

  const bgColor = theme === "dark" ? "#1f2937" : undefined;
  const textColor = theme === "light" ? "#000000" : "#FFFFFF";

  const signUpVariables = {
    colorPrimary: "#ffd800",
    colorBackground: bgColor,
    colorInputBackground: bgColor,
  };

  const signUpAppearance = {
    baseTheme: clerkTheme,
    variables: signUpVariables,
    text: {
      color: textColor,
    },
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <SignUp appearance={signUpAppearance} path="/sign-up" />
    </div>
  );
};

export default SignUpPage;
