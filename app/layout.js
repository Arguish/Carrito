import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import { GameProvider } from "@/context/GameContext";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Notifications from "@/components/Notifications";

export const metadata = {
    title: "Magic Collection - Abre Sobres y Completa tu Colección",
    description:
        "Abre sobres de Magic: The Gathering, colecciona cartas y completa sets",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                <GameProvider>
                    <UIProvider>
                        <div className="min-h-screen bg-magic-black">
                            <Notifications />
                            <Header />
                            <Navigation />
                            <main className="max-w-7xl mx-auto px-4 py-8">
                                {children}
                            </main>
                        </div>
                    </UIProvider>
                </GameProvider>
            </body>
        </html>
    );
}
