"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { openBooster } from "@/lib/scryfall";
import { useUI } from "@/context/UIContext";

export default function UnopenedBoosters() {
    const { unopenedBoosters, addCards, openBoosterFromInventory } = useGame();
    const { addNotification } = useUI();
    const [opening, setOpening] = useState(null);
    const [revealedCards, setRevealedCards] = useState([]);
    const [showCards, setShowCards] = useState(false);
    const [currentBoosterId, setCurrentBoosterId] = useState(null);
    const [openingAll, setOpeningAll] = useState(false);

    const handleOpenBooster = async (booster) => {
        setOpening(booster.id);
        setCurrentBoosterId(booster.id);

        // Simular tiempo de apertura
        setTimeout(async () => {
            const cards = await openBooster(booster.setCode, {
                icon: booster.icon,
                card_count: booster.card_count || 0,
            });

            if (cards.length > 0) {
                addCards(cards);
                setRevealedCards(cards);
                setShowCards(true);

                const mythics = cards.filter((c) => c.rarity === "mythic");
                const rares = cards.filter((c) => c.rarity === "rare");

                if (mythics.length > 0) {
                    addNotification(`¡Mítica! ${mythics[0].name}`, "success");
                } else if (rares.length > 0) {
                    addNotification(`Rara: ${rares[0].name}`, "success");
                }
            }

            setOpening(null);
        }, 2000);
    };

    const handleOpenAllBoosters = async () => {
        setOpeningAll(true);
        const allCards = [];

        // Abrir todos los sobres
        for (const booster of unopenedBoosters) {
            const cards = await openBooster(booster.setCode, {
                icon: booster.icon,
                card_count: booster.card_count || 0,
            });
            allCards.push(...cards);
        }

        // Agregar todas las cartas a la colección
        if (allCards.length > 0) {
            addCards(allCards);
            setRevealedCards(allCards);
            setShowCards(true);

            const mythics = allCards.filter((c) => c.rarity === "mythic");
            const rares = allCards.filter((c) => c.rarity === "rare");

            if (mythics.length > 0) {
                addNotification(
                    `¡${mythics.length} Mítica${
                        mythics.length > 1 ? "s" : ""
                    }!`,
                    "success"
                );
            } else if (rares.length > 0) {
                addNotification(
                    `${rares.length} Rara${rares.length > 1 ? "s" : ""}`,
                    "success"
                );
            }

            // Eliminar todos los sobres después de mostrar el modal
            unopenedBoosters.forEach((booster) => {
                openBoosterFromInventory(booster.id);
            });
        }

        setOpeningAll(false);
    };

    const handleCloseModal = () => {
        if (currentBoosterId) {
            openBoosterFromInventory(currentBoosterId);
            setCurrentBoosterId(null);
        }
        setShowCards(false);
        setRevealedCards([]);
    };

    const groupedBoosters = unopenedBoosters.reduce((acc, booster) => {
        if (!acc[booster.setCode]) {
            acc[booster.setCode] = {
                setName: booster.setName,
                setCode: booster.setCode,
                icon: booster.icon,
                boosters: [],
            };
        }
        acc[booster.setCode].boosters.push(booster);
        return acc;
    }, {});

    if (unopenedBoosters.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-2xl text-gray-400 mb-2">
                    No tienes sobres para abrir
                </p>
                <p className="text-gray-500">Compra algunos desde la tienda</p>
            </div>
        );
    }

    return (
        <>
            {unopenedBoosters.length > 1 && (
                <div className="mb-6">
                    <button
                        onClick={handleOpenAllBoosters}
                        disabled={openingAll}
                        className="w-full bg-magic-gold hover:bg-yellow-500 disabled:bg-gray-600 text-magic-black font-bold py-3 rounded-lg transition-colors text-lg"
                    >
                        {openingAll
                            ? "Abriendo todos..."
                            : `Abrir Todos los Sobres (${unopenedBoosters.length})`}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.values(groupedBoosters).map((group) => (
                    <div
                        key={group.setCode}
                        className="bg-magic-gray rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {group.icon && (
                                <img
                                    src={group.icon}
                                    alt={group.setName}
                                    className="w-12 h-12"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm line-clamp-2">
                                    {group.setName}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {group.boosters.length} sobres
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleOpenBooster(group.boosters[0])}
                            disabled={opening === group.boosters[0].id}
                            className="w-full bg-magic-gold hover:bg-yellow-500 disabled:bg-gray-600 text-magic-black font-semibold py-2 rounded transition-colors"
                        >
                            {opening === group.boosters[0].id
                                ? "Abriendo..."
                                : "Abrir Sobre"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal de cartas reveladas */}
            {showCards && revealedCards.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-magic-black border-2 border-magic-gold rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-magic-gold">
                                ¡Cartas Obtenidas!
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {revealedCards.map((card, index) => (
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

                        <button
                            onClick={handleCloseModal}
                            className="mt-6 w-full bg-magic-gray hover:bg-magic-light-gray text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
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
            )}
        </>
    );
}
