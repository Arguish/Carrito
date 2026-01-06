"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import Collection from "@/components/Collection";
import SetSelector from "@/components/SetSelector";
import ShoppingCart from "@/components/ShoppingCart";
import SellCart from "@/components/SellCart";
import UnopenedBoosters from "@/components/UnopenedBoosters";
import Notifications from "@/components/Notifications";

export default function Home() {
    const {
        euros = 50,
        collection,
        cart,
        unopenedBoosters,
        reset,
        clearSellCart,
    } = useGame();
    const [activeTab, setActiveTab] = useState("shop");

    const totalCards = collection.reduce((acc, card) => acc + card.quantity, 0);

    const handleTabChange = (tab) => {
        if (activeTab === "collection" && tab !== "collection") {
            clearSellCart();
        }
        setActiveTab(tab);
    };

    return (
        <main className="min-h-screen bg-magic-black">
            <Notifications />

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
                            <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold">
                                <div className="text-xs text-gray-400 uppercase tracking-wider">
                                    Euros
                                </div>
                                <div className="text-xl font-bold text-magic-gold">
                                    €{(euros || 50).toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold">
                                <div className="text-xs text-gray-400 uppercase tracking-wider">
                                    Cartas
                                </div>
                                <div className="text-xl font-bold text-magic-white">
                                    {totalCards}
                                </div>
                            </div>
                            <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold">
                                <div className="text-xs text-gray-400 uppercase tracking-wider">
                                    Carrito
                                </div>
                                <div className="text-xl font-bold text-magic-orange">
                                    {cart.length > 0
                                        ? cart.reduce(
                                              (sum, item) =>
                                                  sum + item.quantity,
                                              0
                                          )
                                        : 0}
                                </div>
                            </div>
                            <div className="bg-magic-gray px-5 py-2.5 rounded border border-magic-light-gray hover:border-magic-gold">
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
                                className="bg-magic-orange hover:bg-orange-600 px-4 py-2 rounded font-semibold text-sm uppercase tracking-wider"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="bg-magic-dark border-b border-magic-gray">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleTabChange("shop")}
                            className={`px-8 py-4 font-semibold uppercase tracking-wider text-sm ${
                                activeTab === "shop"
                                    ? "text-magic-white bg-magic-gray border-b-2 border-magic-orange"
                                    : "text-gray-400 hover:text-magic-white hover:bg-magic-gray"
                            }`}
                        >
                            Tienda
                        </button>
                        <button
                            onClick={() => handleTabChange("boosters")}
                            className={`px-8 py-4 font-semibold uppercase tracking-wider text-sm relative ${
                                activeTab === "boosters"
                                    ? "text-magic-white bg-magic-gray border-b-2 border-magic-orange"
                                    : "text-gray-400 hover:text-magic-white hover:bg-magic-gray"
                            }`}
                        >
                            Sobres
                            {unopenedBoosters.length > 0 && (
                                <span className="absolute top-2 -right-1 bg-magic-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {unopenedBoosters.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => handleTabChange("collection")}
                            className={`px-8 py-4 font-semibold uppercase tracking-wider text-sm ${
                                activeTab === "collection"
                                    ? "text-magic-white bg-magic-gray border-b-2 border-magic-orange"
                                    : "text-gray-400 hover:text-magic-white hover:bg-magic-gray"
                            }`}
                        >
                            Colección
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === "shop" && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-magic-white mb-2 uppercase tracking-wide">
                                Selecciona una Expansión
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Cada sobre cuesta €5.00 y contiene cartas
                                aleatorias de la expansión
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
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-magic-white mb-2 uppercase tracking-wide">
                                Sobres Sin Abrir
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Haz clic en un sobre para abrirlo y descubrir
                                tus cartas
                            </p>
                        </div>
                        <UnopenedBoosters />
                    </div>
                )}

                {activeTab === "collection" && (
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
                )}
            </div>
        </main>
    );
}
