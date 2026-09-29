import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Barber at Pearls | Premium Barbering Umhlanga",
  description:
    "Fades, beard trims, hot towel shaves and VIP styling at Barber at Pearls, Shop B5, Level 2, Pearls Mall, Umhlanga. Book in one tap on WhatsApp: 071 820 5432.",
  keywords: [
    "barber Umhlanga",
    "Barber at Pearls",
    "Pearls Mall barber",
    "fade Umhlanga",
    "hot towel shave Durban",
    "beard trim Umhlanga",
  ],
  openGraph: {
    title: "Barber at Pearls | Premium Barbering Umhlanga",
    description:
      "Premium barbering at Pearls Mall, Umhlanga. Pick your services and book on WhatsApp.",
    type: "website",
    locale: "en_ZA",
    siteName: "Barber at Pearls",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barber at Pearls | Premium Barbering Umhlanga",
    description: "Fades, beards, hot towel shaves and VIP styling at Pearls Mall, Umhlanga.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1B3FC4",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "Barber at Pearls",
  telephone: "+27718205432",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop B5, Level 2, Pearls Mall",
    addressLocality: "Umhlanga",
    addressRegion: "KwaZulu-Natal",
    addressCountry: "ZA",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
