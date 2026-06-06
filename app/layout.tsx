import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SignLearn — Learn ASL with Your Camera",
  description: "Master American Sign Language through interactive, camera-based lessons.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "var(--bg-page)", color: "var(--text-primary)", minHeight: "100vh" }}>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: "var(--nav-height)" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
