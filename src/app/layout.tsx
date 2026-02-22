// * Next
import type { Metadata } from "next";

// * NPM
import Main from "@/app/main";

// * MUI
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

// * CSS
import "@/styles/globals.css";

//* Fonts & Styles
// import "@fontsource/abel";
// import "@fontsource/rubik";
// import "@fontsource/allison";
// import "@fontsource/lato";
import "@fontsource/nunito";
// import "@fontsource/pacifico";
// import "@fontsource/kenia";

export const metadata: Metadata = {
  title: "E-Ballot",
  description: "Application used to organize and cast electronic ballots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <InitColorSchemeScript attribute="class" />
        <Main>{children}</Main>
      </body>
    </html>
  );
}
