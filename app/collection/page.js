"use client";

import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import Collection from "@/components/Collection";
import SellCart from "@/components/SellCart";

export default function CollectionPage() {
    const { clearSellCart } = useGame();

    // Limpiar el carrito de venta al salir de esta página
    useEffect(() => {
        return () => {
            clearSellCart();
        };
    }, [clearSellCart]);

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-magic-white mb-2 uppercase tracking-wide">
                    Tu Colección
                </h2>
                <p className="text-gray-400 text-sm">
                    Añade cartas al carrito para venderlas
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Collection />
                </div>
                <div>
                    <SellCart />
                </div>
            </div>
        </div>
    );
}
