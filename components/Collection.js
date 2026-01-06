"use client";

import { useState, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { useUI } from "@/context/UIContext";

export default function Collection() {
    const { collection, addToSellCart, sellCart } = useGame();
    const { addNotification } = useUI();

    const [sortBy, setSortBy] = useState("name");
    const [filterRarity, setFilterRarity] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSet, setSelectedSet] = useState(null);

    const filteredAndSortedCollection = useMemo(() => {
        let filtered = [...collection];

        filtered = filtered.filter((card) => {
            const cartItem = sellCart.find((item) => item.id === card.id);
            if (cartItem && cartItem.quantity >= card.quantity) {
                return false;
            }
            return true;
        });

        if (filterRarity !== "all") {
            filtered = filtered.filter((card) => card.rarity === filterRarity);
        }

        if (searchTerm) {
            filtered = filtered.filter((card) =>
                card.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "rarity":
                    const rarityOrder = {
                        common: 0,
                        uncommon: 1,
                        rare: 2,
                        mythic: 3,
                    };
                    return rarityOrder[b.rarity] - rarityOrder[a.rarity];
                case "set":
                    return a.set.localeCompare(b.set);
                case "quantity":
                    return b.quantity - a.quantity;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [collection, sortBy, filterRarity, searchTerm, sellCart]);

    const setStats = useMemo(() => {
        const stats = {};

        collection.forEach((card) => {
            if (!stats[card.set]) {
                stats[card.set] = {
                    setName:
                        card.set_name ||
                        card.set?.toUpperCase() ||
                        "Desconocido",
                    setCode: card.set,
                    icon: card.set_icon || "",
                    ownedCards: new Set(),
                    totalCards: card.set_card_count || 0,
                };
            }
            stats[card.set].ownedCards.add(card.id);
        });

        Object.values(stats).forEach((stat) => {
            stat.ownedCount = stat.ownedCards.size;
            stat.percentage =
                stat.totalCards > 0
                    ? Math.round((stat.ownedCount / stat.totalCards) * 100)
                    : 0;
            delete stat.ownedCards;
        });

        return stats;
    }, [collection]);

    const stats = useMemo(() => {
        return {
            total: collection.reduce((acc, card) => acc + card.quantity, 0),
            unique: collection.length,
            common: collection.filter((c) => c.rarity === "common").length,
            uncommon: collection.filter((c) => c.rarity === "uncommon").length,
            rare: collection.filter((c) => c.rarity === "rare").length,
            mythic: collection.filter((c) => c.rarity === "mythic").length,
        };
    }, [collection]);

    const handleAddToCart = (card) => {
        addToSellCart(card);
    };

    const handleSelectSet = (setCode) => {
        setSelectedSet(setCode);
        setSearchTerm("");
    };

    const handleBackToSets = () => {
        setSelectedSet(null);
        setSearchTerm("");
        setFilterRarity("all");
    };

    if (collection.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-2xl text-gray-400">
                    Tu colección está vacía
                </p>
                <p className="text-gray-500 mt-2">
                    ¡Abre algunos sobres para empezar!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-magic-gray p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-magic-gold">
                        {stats.total}
                    </div>
                    <div className="text-sm text-gray-300">Total</div>
                </div>
                <div className="bg-magic-gray p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-magic-orange">
                        {stats.unique}
                    </div>
                    <div className="text-sm text-gray-300">Únicas</div>
                </div>
                <div className="bg-magic-gray p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-400">
                        {stats.common}
                    </div>
                    <div className="text-sm text-gray-300">Comunes</div>
                </div>
                <div className="bg-magic-gray p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">
                        {stats.uncommon}
                    </div>
                    <div className="text-sm text-gray-300">Infrecuentes</div>
                </div>
                <div className="bg-magic-gray p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                        {stats.rare}
                    </div>
                    <div className="text-sm text-gray-300">Raras</div>
                </div>
                <div className="bg-magic-gray p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">
                        {stats.mythic}
                    </div>
                    <div className="text-sm text-gray-300">Míticas</div>
                </div>
            </div>

            {selectedSet === null && (
                <>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Buscar expansión..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 bg-magic-gray text-magic-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-magic-orange"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(setStats)
                            .filter(([code, stat]) =>
                                stat.setName
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            )
                            .sort((a, b) =>
                                (b[1].setName || "").localeCompare(
                                    a[1].setName || ""
                                )
                            )
                            .map(([setCode, stat]) => (
                                <div
                                    key={setCode}
                                    className="bg-magic-gray p-4 rounded-lg hover:ring-2 hover:ring-magic-orange transition-all cursor-pointer"
                                    onClick={() => handleSelectSet(setCode)}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        {stat.icon && (
                                            <img
                                                src={stat.icon}
                                                alt={stat.setName}
                                                className="w-8 h-8 flex-shrink-0"
                                            />
                                        )}
                                        <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                                            {stat.setName}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-1">
                                        {setCode.toUpperCase()}
                                    </p>
                                    <p className="text-xs text-gray-300 mb-2">
                                        {stat.totalCards > 0
                                            ? `${stat.ownedCount} / ${stat.totalCards} cartas`
                                            : `${stat.ownedCount} ${
                                                  stat.ownedCount === 1
                                                      ? "carta"
                                                      : "cartas"
                                              }`}
                                    </p>
                                    {stat.totalCards > 0 && (
                                        <>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-magic-gold h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${stat.percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-center text-magic-gold font-semibold">
                                                {stat.percentage}% completado
                                            </p>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>

                    {Object.keys(setStats).length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            No hay expansiones en tu colección
                        </div>
                    )}
                </>
            )}

            {selectedSet !== null && (
                <>
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={handleBackToSets}
                            className="bg-magic-gray hover:bg-magic-light-gray px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Volver a Expansiones
                        </button>
                        <div className="flex items-center gap-3">
                            {setStats[selectedSet]?.icon && (
                                <img
                                    src={setStats[selectedSet].icon}
                                    alt={setStats[selectedSet].setName}
                                    className="w-8 h-8"
                                />
                            )}
                            <h2 className="text-2xl font-bold text-magic-gold">
                                {setStats[selectedSet]?.setName}
                            </h2>
                            <span className="text-gray-400">
                                ({setStats[selectedSet]?.ownedCount} /{" "}
                                {setStats[selectedSet]?.totalCards} cartas -{" "}
                                {setStats[selectedSet]?.percentage}%)
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Buscar cartas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 bg-magic-gray text-magic-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-magic-orange"
                        />

                        <select
                            value={filterRarity}
                            onChange={(e) => setFilterRarity(e.target.value)}
                            className="px-4 py-2 bg-magic-gray text-magic-white rounded-lg focus:outline-none focus:ring-2 focus:ring-magic-orange"
                        >
                            <option value="all">Todas las rarezas</option>
                            <option value="common">Comunes</option>
                            <option value="uncommon">Infrecuentes</option>
                            <option value="rare">Raras</option>
                            <option value="mythic">Míticas</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-magic-gray text-magic-white rounded-lg focus:outline-none focus:ring-2 focus:ring-magic-orange"
                        >
                            <option value="name">Ordenar por nombre</option>
                            <option value="rarity">Ordenar por rareza</option>
                            <option value="quantity">
                                Ordenar por cantidad
                            </option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredAndSortedCollection
                            .filter((card) => card.set === selectedSet)
                            .map((card) => {
                                const cartItem = sellCart.find(
                                    (item) => item.id === card.id
                                );
                                const availableQuantity =
                                    card.quantity - (cartItem?.quantity || 0);

                                return (
                                    <div
                                        key={card.id}
                                        className="bg-magic-gray rounded-lg overflow-hidden hover:ring-2 hover:ring-magic-orange transition-all"
                                    >
                                        {card.image && (
                                            <img
                                                src={card.image}
                                                alt={card.name}
                                                className="w-full h-auto"
                                            />
                                        )}
                                        <div className="p-3">
                                            <h3 className="font-semibold text-sm mb-1 truncate">
                                                {card.name}
                                            </h3>
                                            <div className="flex justify-between items-center text-xs text-gray-300 mb-2">
                                                <span
                                                    className={`capitalize ${
                                                        card.rarity === "mythic"
                                                            ? "text-red-400"
                                                            : card.rarity ===
                                                              "rare"
                                                            ? "text-yellow-400"
                                                            : card.rarity ===
                                                              "uncommon"
                                                            ? "text-green-400"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {card.rarity}
                                                </span>
                                                <span>
                                                    x{availableQuantity}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(card)
                                                }
                                                className="w-full bg-magic-gold hover:bg-yellow-500 text-magic-black font-semibold py-2 rounded transition-colors text-sm"
                                            >
                                                Añadir al Carrito
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {filteredAndSortedCollection.filter(
                        (card) => card.set === selectedSet
                    ).length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            No se encontraron cartas con estos filtros
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
