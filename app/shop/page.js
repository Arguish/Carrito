"use client";

import SetSelector from "@/components/SetSelector";
import ShoppingCart from "@/components/ShoppingCart";

export default function ShopPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-magic-white mb-2 uppercase tracking-wide">
                    Selecciona una Expansión
                </h2>
                <p className="text-gray-400 text-sm">
                    Cada sobre cuesta €5.00 y contiene cartas aleatorias de la
                    expansión
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <SetSelector />
                </div>
                <div>
                    <ShoppingCart />
                </div>
            </div>
        </div>
    );
}
