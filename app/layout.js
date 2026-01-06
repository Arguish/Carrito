import "./globals.css";
import { UIProvider } from "@/context/UIContext";

export const metadata = {
    title: "Magic Collection - Abre Sobres y Completa tu Colección",
    description:
        "Abre sobres de Magic: The Gathering, colecciona cartas y completa sets",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                <UIProvider>{children}</UIProvider>
            </body>
        </html>
    );
}
