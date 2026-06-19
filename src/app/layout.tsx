// * Next
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
//import localFont from "next/font/local";

// * Main entry file
import Main from "@/app/main";

// * CSS
import "@/styles/globals.css";

// * Utils
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Foresee Inc.",
  description:
    "SASS application used to take and maintain stock records & inventories in warehouses.",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  //variable: "--font-mono",
  variable: "--font-sans",
});
// const rubik = localFont({
//   src: [
//     {
//       path: "../public/fonts/Rubik-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//   ],
//   variable: "--font-sans",
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", jetbrainsMono.variable)}
    >
      <body>
        <Main>{children}</Main>
      </body>
    </html>
  );
}
