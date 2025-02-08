import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";


export const metadata = {
  title: "Soulup Geotagging System",
  description: "It is a geotagging system by soulup, where users could find people facing problems like them nearby them",
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
