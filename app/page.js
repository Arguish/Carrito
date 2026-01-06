"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import Collection from "@/components/Collection";
import SetSelector from "@/components/SetSelector";
import ShoppingCart from "@/components/ShoppingCart";
import SellCart from "@/components/SellCart";
import UnopenedBoosters from "@/components/UnopenedBoosters";
import Notifications from "@/components/Notifications";

export default function Home() {
    const { coins, collection, cart, unopenedBoosters, reset, clearSellCart } =
        useGameStore();
    const [activeTab, setActiveTab] = useState("shop"); // shop, boosters, collection

    const totalCards = collection.reduce((acc, card) => acc + card.quantity, 0);

    const handleTabChange = (tab) => {
        // Vaciar carrito de venta al cambiar de pestaña
        if (activeTab === "collection" && tab !== "collection") {
            clearSellCart();
        }
        setActiveTab(tab);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-magic-black to-gray-900">
            <Notifications />

            {/* Header */}
            <header className="bg-magic-black border-b border-magic-purple">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-magic-gold mb-2">
                                🎴 Magic Collection
                            </h1>
                            <p className="text-gray-400">
                                Abre sobres y completa tu colección
                            </p>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="bg-magic-purple px-6 py-3 rounded-lg">
                                <div className="text-sm text-gray-400">
                                    Monedas
                                </div>
                                <div className="text-2xl font-bold text-magic-gold">
                                    {coins} 💰
                                </div>
                            </div>
                            <div className="bg-magic-purple px-6 py-3 rounded-lg">
                                <div className="text-sm text-gray-400">
                                    Cartas
                                </div>
                                <div className="text-2xl font-bold text-magic-blue">
                                    {totalCards}
                                </div>
                            </div>
                            <div className="bg-magic-purple px-6 py-3 rounded-lg">
                                <div className="text-sm text-gray-400">
                                    Carrito
                                </div>
                                <div className="text-2xl font-bold text-magic-gold">
                                    {cart.length > 0
                                        ? cart.reduce(
                                              (sum, item) =>
                                                  sum + item.quantity,
                                              0
                                          )
                                        : 0}
                                </div>
                            </div>
                            <div className="bg-magic-purple px-6 py-3 rounded-lg">
                                <div className="text-sm text-gray-400">
                                    Sobres
                                </div>
                                <div className="text-2xl font-bold text-green-400">
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
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-magic-purple border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleTabChange("shop")}
                            className={`px-6 py-4 font-semibold transition-colors ${
                                activeTab === "shop"
                                    ? "text-magic-gold border-b-2 border-magic-gold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            🛒 Tienda de Sobres
                        </button>
                        <button
                            onClick={() => handleTabChange("boosters")}
                            className={`px-6 py-4 font-semibold transition-colors relative ${
                                activeTab === "boosters"
                                    ? "text-magic-gold border-b-2 border-magic-gold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            🎴 Abrir Sobres
                            {unopenedBoosters.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unopenedBoosters.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => handleTabChange("collection")}
                            className={`px-6 py-4 font-semibold transition-colors ${
                                activeTab === "collection"
                                    ? "text-magic-gold border-b-2 border-magic-gold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            📚 Mi Colección
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === "shop" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Selecciona una Expansión
                            </h2>
                            <p className="text-gray-400">
                                Cada sobre cuesta 200 monedas y contiene 15
                                cartas aleatorias
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
                )}

                {activeTab === "boosters" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Sobres Sin Abrir
                            </h2>
                            <p className="text-gray-400">
                                Haz clic en un sobre para abrirlo y ver tus
                                cartas
                            </p>
                        </div>
                        <UnopenedBoosters />
                    </div>
                )}

                {activeTab === "collection" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Tu Colección
                            </h2>
                            <p className="text-gray-400">
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
                )}
            </div>
        </main>
    );
}
