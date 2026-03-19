// * Next
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

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
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// import "@fontsource/pacifico";
// import "@fontsource/kenia";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      suppressHydrationWarning={true}
      //className={cn("font-sans", inter.variable)}
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body>
        {/* <InitColorSchemeScript attribute="class" /> */}
        <Main>{children}</Main>
      </body>
    </html>
  );
}
