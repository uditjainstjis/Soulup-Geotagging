import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata = {
  title: "SoulUp Geotagging - Find & Connect with Like-Minded People", // More descriptive title
  icons: {
    icon: "/favico.png", // 👈 this is the favicon
  },
  description: "Discover people nearby facing similar mental health challenges. SoulUp's geotagging system helps you find support groups and build connections.", // Matches og:description
  keywords: ["SoulUp", "SoulUp geotagging", "geotagging system", "mental health support", "find people", "connect with like-minded people", "mental wellness", "mental health geotagging", "mental health community", "find support groups", "geolocation mental health", "emotional support network", "map-based mental health support", "meet people like you", "find mental health resources", "therapy groups near me", "mental health mapping", "support network", "mental health connections", "location-based mental health support"], // Added keywords
  author: "SoulUp", // Added author
  robots: "index, follow", // Added robots
  openGraph: { // Grouped Open Graph properties
    title: "SoulUp Geotagging - Find & Connect with Like-Minded People", // Matches title
    description: "Discover people nearby facing similar mental health challenges. SoulUp's geotagging system helps you find support groups and build connections.", // Matches description
    image: "data:image/png;base64,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", // Matches og:image
    url: "https://soulup-geotagging.vercel.app/", // Matches og:url
    type: "website", // Matches og:type
  },
  viewport: "width=device-width, initial-scale=1.0", // Added viewport
  verification: {
    google: "_K5skeyXNiCskiker7vb7s3FNZ66GAgfUh13pigO_nA", // Added google-site-verification
  }
};

export default function RootLayout({children}) {
  return (
    <html lang="en">


      <SessionWrapper>
    <body>

      {children}
      {/* I am layout */}
    </body>
      </SessionWrapper>
    </html>
  );
}
