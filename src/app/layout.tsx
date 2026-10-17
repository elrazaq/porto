import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel, Amiri } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-chess",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-islamic",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Full Stack & Native Android Developer | Portfolio",
  description:
    "Interactive modern portfolio with Bento Grid, showcasing Full Stack Web and Native Android (Kotlin) development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`dark ${jakarta.variable} ${cinzel.variable} ${amiri.variable}`}
    >
      <body className="min-h-screen text-slate-100 antialiased selection:bg-mint-400 selection:text-neutral-950 font-sans">
        {children}
      </body>
    </html>
  );
}
