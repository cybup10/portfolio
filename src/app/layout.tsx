import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trueone — Smart Contract Security",
  description:
    "Engineering student specializing in smart contract security. Studying how DeFi protocols break, and building the AI/ML automation that finds those breaks faster.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
