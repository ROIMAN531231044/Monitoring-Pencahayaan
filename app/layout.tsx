import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUXMONITOR // ESP32 - Monitoring Pencahayaan 3",
  description:
    "Sistem Dashboard Monitoring Intensitas Pencahayaan Realtime berbasis ESP32, Sensor BH1750, dan Firebase Realtime Database sesuai Standar SNI 03-6197.",
  keywords: ["ESP32", "BH1750", "Firebase Realtime Database", "Lux Meter", "IoT", "SNI 03-6197"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased selection:bg-cyan-500 selection:text-black flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}

