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
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


// import "@fontsource/pacifico";
// import "@fontsource/kenia";

export const metadata: Metadata = {
  title: "Foresee Inc.",
  description:
    "SASS application used to take and maintain stock records & inventories in warehouses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={cn("font-sans", inter.variable)}>
      <body>
        <InitColorSchemeScript attribute="class" />
        <Main>{children}</Main>
      </body>
    </html>
  );
}
