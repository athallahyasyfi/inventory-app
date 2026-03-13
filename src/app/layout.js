import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "InvenTrack - Inventory Management",
  description: "Sistem manajemen inventori sederhana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {/* Providers membungkus seluruh app agar session bisa diakses di mana saja */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
