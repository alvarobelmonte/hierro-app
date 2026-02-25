import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/bottom-nav";

export const metadata: Metadata = {
    title: "Hierro",
    description: "Fatigue-Proof Workout Tracker",
};

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="antialiased min-h-screen pb-20 bg-black text-white">
                <main className="max-w-md mx-auto p-4 min-h-screen">
                    {children}
                </main>
                <BottomNav />
            </body>
        </html>
    );
}
