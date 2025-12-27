import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Insyd Inventory",
  description: "Inventory management for material businesses",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    },
};

export default function RootLayout({
  children
}) {


  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Provider>
        {/* <Navbar handleScroll={handleScroll}/> */}
        {children}
        </Provider>
      </body>
    </html>
  );
}
