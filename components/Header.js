"use client";

import { useGame } from "@/context/GameContext";

export default function Header() {
    const {
        euros = 50,
        collection = [],
        cart = [],
        unopenedBoosters = [],
        reset,
    } = useGame();

    const totalCards = collection.reduce((acc, card) => acc + card.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-magic-dark border-b border-magic-gray shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-magic-gold to-magic-orange bg-clip-text text-transparent mb-2">
                            MAGIC: THE GATHERING
                        </h1>
                        <p className="text-gray-400 text-sm uppercase tracking-wider">
                            Colección de Cartas
                        </p>
                    </div>

                    <div className="flex gap-3 items-center flex-wrap">
                        <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold transition-colors">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">
                                Euros
                            </div>
                            <div className="text-xl font-bold text-magic-gold">
                                €{euros.toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold transition-colors">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">
                                Cartas
                            </div>
                            <div className="text-xl font-bold text-magic-white">
                                {totalCards}
                            </div>
                        </div>
                        <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold transition-colors">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">
                                Carrito
                            </div>
                            <div className="text-xl font-bold text-magic-orange">
                                {cartTotal}
                            </div>
                        </div>
                        <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold transition-colors">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">
                                Sobres
                            </div>
                            <div className="text-xl font-bold text-magic-orange">
                                {unopenedBoosters.length}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (
                                    confirm(
                                        "¿Seguro que quieres resetear tu progreso?"
                                    )
                                ) {
                                    reset();
                                }
                            }}
                            className="bg-magic-orange hover:bg-orange-600 px-4 py-2 rounded font-semibold text-sm uppercase tracking-wider transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
