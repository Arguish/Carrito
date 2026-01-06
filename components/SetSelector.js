"use client";

import { useState, useEffect } from "react";
import { getSets } from "@/lib/scryfall";
import { useGameStore } from "@/store/gameStore";
import { useUI } from "@/context/UIContext";

export default function SetSelector() {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { addToCart } = useGameStore();
    const { addNotification } = useUI();

    // useEffect para cargar los sets al montar el componente
    useEffect(() => {
        async function loadSets() {
            try {
                setLoading(true);
                setError(null);
                console.log("Loading sets...");
                const data = await getSets();

                if (data.length === 0) {
                    setError(
                        "No se pudieron cargar los sets. Intenta de nuevo."
                    );
                } else {
                    // Ordenar por fecha de lanzamiento (más recientes primero)
                    const sorted = data.sort(
                        (a, b) =>
                            new Date(b.released_at) - new Date(a.released_at)
                    );
                    setSets(sorted);
                }
            } catch (err) {
                console.error("Error loading sets:", err);
                setError("Error al cargar sets: " + err.message);
            } finally {
                setLoading(false);
            }
        }

        loadSets();
    }, []);

    const filteredSets = sets.filter((set) =>
        set.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (set) => {
        addToCart({
            setCode: set.code,
            setName: set.name,
            icon: set.icon_svg_uri,
            card_count: set.card_count,
        });
        addNotification(`${set.name} añadido al carrito`, "success");
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magic-gold mx-auto"></div>
                <p className="mt-4 text-gray-400">Cargando sets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-magic-gold hover:bg-yellow-500 text-magic-black font-semibold py-2 px-4 rounded"
                >
                    Recargar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Buscar expansión..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-magic-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-magic-blue"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {filteredSets.map((set) => (
                    <div
                        key={set.code}
                        className="bg-magic-purple p-4 rounded-lg"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {set.icon_svg_uri && (
                                <img
                                    src={set.icon_svg_uri}
                                    alt={set.name}
                                    className="w-8 h-8 flex-shrink-0"
                                />
                            )}
                            <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                                {set.name}
                            </h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">
                            {set.code.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                            {set.card_count} cartas
                        </p>
                        <button
                            onClick={() => handleAddToCart(set)}
                            className="w-full bg-magic-gold hover:bg-yellow-500 text-magic-black font-semibold py-2 rounded transition-colors text-sm"
                        >
                            Añadir al Carrito
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
