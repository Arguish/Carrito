"use client";

import { useGame } from "@/context/GameContext";
import { useUI } from "@/context/UIContext";

export default function SellCart() {
    const {
        sellCart,
        euros = 50,
        removeFromSellCart,
        updateSellCartQuantity,
        sellCartItems,
    } = useGame();
    const { addNotification } = useUI();

    const total = sellCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleSell = () => {
        const cardCount = sellCart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
        sellCartItems();
        addNotification(
            `¡Vendiste ${cardCount} cartas por €${total.toFixed(2)}!`,
            "success"
        );
    };

    if (sellCart.length === 0) {
        return (
            <div className="bg-magic-gray border border-magic-light-gray rounded p-6 text-center">
                <p className="text-gray-400">Carrito de venta vacío</p>
                <p className="text-sm text-gray-500 mt-2">
                    Añade cartas de tu colección
                </p>
            </div>
        );
    }

    return (
        <div className="bg-magic-dark border border-magic-light-gray rounded p-6">
            <h3 className="text-lg font-bold mb-4 text-magic-gold uppercase tracking-wider">
                Carrito de Venta
            </h3>

            <div className="space-y-3 mb-6">
                {sellCart.map((card) => (
                    <div
                        key={card.id}
                        className="bg-magic-gray border border-magic-light-gray rounded p-3 hover:border-magic-gold"
                    >
                        <div className="flex items-start gap-3 mb-2">
                            {card.image && (
                                <img
                                    src={card.image}
                                    alt={card.name}
                                    className="w-12 h-auto rounded flex-shrink-0"
                                />
                            )}

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-magic-white truncate">
                                    {card.name}
                                </h4>
                                <p
                                    className={`text-xs capitalize ${
                                        card.rarity === "mythic"
                                            ? "text-magic-orange"
                                            : card.rarity === "rare"
                                            ? "text-magic-gold"
                                            : card.rarity === "uncommon"
                                            ? "text-gray-300"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {card.rarity}
                                </p>
                                <p className="text-xs text-gray-400">
                                    €{card.price.toFixed(2)} c/u
                                </p>
                            </div>

                            <button
                                onClick={() => removeFromSellCart(card.id)}
                                className="text-magic-orange hover:text-red-400 text-xl font-bold flex-shrink-0"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateSellCartQuantity(
                                            card.id,
                                            card.quantity - 1
                                        )
                                    }
                                    className="w-7 h-7 bg-magic-light-gray hover:bg-magic-orange rounded flex items-center justify-center font-bold text-sm"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-bold text-magic-white text-sm">
                                    {card.quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        updateSellCartQuantity(
                                            card.id,
                                            card.quantity + 1
                                        )
                                    }
                                    className="w-7 h-7 bg-magic-light-gray hover:bg-magic-orange rounded flex items-center justify-center font-bold text-sm"
                                >
                                    +
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-green-400 text-sm">
                                    €{(card.price * card.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-magic-light-gray pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm uppercase tracking-wider text-gray-400">
                        Total a recibir:
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                        +€{total.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm uppercase tracking-wider text-gray-400">
                        Tus euros:
                    </span>
                    <span className="font-bold text-magic-gold">
                        €{(euros || 50).toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={handleSell}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded uppercase tracking-wider text-sm"
                >
                    Vender Cartas
                </button>
            </div>
        </div>
    );
}
