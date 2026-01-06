"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useUI } from "@/context/UIContext";
import { openBooster } from "@/lib/scryfall";

export default function BoosterOpener({ selectedSet, onClose }) {
    const { addCards, buyBooster, coins } = useGameStore();
    const { addNotification } = useUI();
    const [opening, setOpening] = useState(false);
    const [cards, setCards] = useState([]);
    const [revealed, setRevealed] = useState(false);

    const boosterCost = 200;

    const handleOpenBooster = async () => {
        if (coins < boosterCost) {
            addNotification("No tienes suficientes monedas", "error");
            return;
        }

        setOpening(true);
        buyBooster(boosterCost);

        // Simular tiempo de apertura
        setTimeout(async () => {
            const boosterCards = await openBooster(selectedSet.code);
            setCards(boosterCards);
            addCards(boosterCards);
            setOpening(false);
            setRevealed(true);

            const mythics = boosterCards.filter((c) => c.rarity === "mythic");
            const rares = boosterCards.filter((c) => c.rarity === "rare");

            if (mythics.length > 0) {
                addNotification(`¡Mítica! ${mythics[0].name}`, "success");
            } else if (rares.length > 0) {
                addNotification(`Rara: ${rares[0].name}`, "success");
            }
        }, 2000);
    };

    const handleClose = () => {
        setRevealed(false);
        setCards([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-magic-black border-2 border-magic-gold rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-magic-gold">
                        {selectedSet.name}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {!revealed && !opening && (
                    <div className="text-center py-12">
                        <div className="mb-6">
                            {selectedSet.icon_svg_uri && (
                                <img
                                    src={selectedSet.icon_svg_uri}
                                    alt={selectedSet.name}
                                    className="w-24 h-24 mx-auto mb-4"
                                />
                            )}
                            <h3 className="text-xl font-semibold mb-2">
                                Sobre de {selectedSet.name}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                15 cartas aleatorias
                            </p>
                            <p className="text-magic-gold text-2xl font-bold mb-6">
                                Costo: {boosterCost} monedas
                            </p>
                            <p className="text-gray-300">
                                Tus monedas:{" "}
                                <span className="text-magic-gold font-bold">
                                    {coins}
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={handleOpenBooster}
                            disabled={coins < boosterCost}
                            className="bg-magic-gold hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-magic-black font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                        >
                            {coins < boosterCost
                                ? "Monedas insuficientes"
                                : "Abrir Sobre"}
                        </button>
                    </div>
                )}

                {opening && (
                    <div className="text-center py-12">
                        <div className="animate-bounce text-6xl mb-4">🎴</div>
                        <p className="text-xl text-magic-gold">
                            Abriendo sobre...
                        </p>
                    </div>
                )}

                {revealed && cards.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-center mb-6 text-magic-gold">
                            ¡Cartas obtenidas!
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                            {cards.map((card, index) => (
                                <div
                                    key={`${card.id}-${index}`}
                                    className="relative group"
                                    style={{
                                        animation: `slideIn 0.5s ease-out ${
                                            index * 0.1
                                        }s both`,
                                    }}
                                >
                                    {card.image && (
                                        <img
                                            src={card.image}
                                            alt={card.name}
                                            className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                                        />
                                    )}
                                    <div
                                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            card.rarity === "mythic"
                                                ? "bg-red-500"
                                                : card.rarity === "rare"
                                                ? "bg-yellow-500"
                                                : card.rarity === "uncommon"
                                                ? "bg-green-500"
                                                : "bg-gray-500"
                                        }`}
                                    >
                                        {card.rarity === "mythic"
                                            ? "M"
                                            : card.rarity === "rare"
                                            ? "R"
                                            : card.rarity === "uncommon"
                                            ? "U"
                                            : "C"}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleOpenBooster}
                                disabled={coins < boosterCost}
                                className="bg-magic-blue hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Abrir otro ({boosterCost} 💰)
                            </button>
                            <button
                                onClick={handleClose}
                                className="bg-magic-purple hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) rotateY(-90deg);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) rotateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
