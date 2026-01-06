"use client";

import { useGameStore } from "@/store/gameStore";
import { useUI } from "@/context/UIContext";

export default function SellCart() {
    const {
        sellCart,
        coins,
        removeFromSellCart,
        updateSellCartQuantity,
        sellCartItems,
    } = useGameStore();
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
            `¡Vendiste ${cardCount} cartas por ${total} monedas!`,
            "success"
        );
    };

    if (sellCart.length === 0) {
        return (
            <div className="bg-magic-purple rounded-lg p-6 text-center">
                <p className="text-gray-400">Carrito de venta vacío</p>
                <p className="text-sm text-gray-500 mt-2">
                    Añade cartas de tu colección
                </p>
            </div>
        );
    }

    return (
        <div className="bg-magic-purple rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-magic-gold">
                💰 Carrito de Venta
            </h3>

            <div className="space-y-3 mb-6">
                {sellCart.map((card) => (
                    <div
                        key={card.id}
                        className="bg-magic-black rounded-lg p-4 flex items-center gap-4"
                    >
                        {card.image && (
                            <img
                                src={card.image}
                                alt={card.name}
                                className="w-16 h-auto rounded"
                            />
                        )}

                        <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                                {card.name}
                            </h4>
                            <p
                                className={`text-xs capitalize ${
                                    card.rarity === "mythic"
                                        ? "text-red-400"
                                        : card.rarity === "rare"
                                        ? "text-yellow-400"
                                        : card.rarity === "uncommon"
                                        ? "text-green-400"
                                        : "text-gray-400"
                                }`}
                            >
                                {card.rarity}
                            </p>
                            <p className="text-sm text-gray-400">
                                {card.price} monedas c/u
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    updateSellCartQuantity(
                                        card.id,
                                        card.quantity - 1
                                    )
                                }
                                className="w-8 h-8 bg-magic-purple hover:bg-gray-600 rounded flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-bold">
                                {card.quantity}
                            </span>
                            <button
                                onClick={() =>
                                    updateSellCartQuantity(
                                        card.id,
                                        card.quantity + 1
                                    )
                                }
                                className="w-8 h-8 bg-magic-purple hover:bg-gray-600 rounded flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                            <p className="font-bold text-green-400">
                                {card.price * card.quantity}
                            </p>
                            <p className="text-xs text-gray-400">monedas</p>
                        </div>

                        <button
                            onClick={() => removeFromSellCart(card.id)}
                            className="text-red-400 hover:text-red-300 text-xl"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                        Total a recibir:
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                        +{total} 💰
                    </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">Tus monedas:</span>
                    <span className="font-bold text-magic-gold">
                        {coins} 💰
                    </span>
                </div>

                <button
                    onClick={handleSell}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Vender Cartas
                </button>
            </div>
        </div>
    );
}
