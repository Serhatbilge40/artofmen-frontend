import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Art Of Men - Produkt Geschichten",
    template: "%s | Art Of Men"
  },
  description: "Entdecken Sie die Geschichte hinter unseren exklusiven Produkten. Jedes Stück erzählt eine einzigartige Geschichte von Handwerkskunst und Qualität.",
  keywords: ["Art Of Men", "Anzug", "Qualität", "Handwerk", "Luxus"],
  authors: [{ name: "Art Of Men" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Art Of Men",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
