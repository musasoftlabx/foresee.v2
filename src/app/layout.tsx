// * Next
import type { Metadata } from "next";
import { Rubik } from "next/font/google";

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

const rubik = Rubik({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", rubik.variable)}
    >
      <body>
        <Main>{children}</Main>
      </body>
    </html>
  );
}
