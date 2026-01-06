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
                <p className="text-magic-orange mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-magic-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded uppercase tracking-wider text-sm"
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
                className="w-full px-4 py-3 bg-magic-gray border border-magic-light-gray rounded focus:outline-none focus:ring-2 focus:ring-magic-orange focus:border-magic-orange text-magic-white placeholder-gray-500"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredSets.map((set) => (
                    <div
                        key={set.code}
                        className="bg-magic-gray border-2 border-magic-light-gray hover:border-magic-orange p-4 rounded shadow-lg hover:shadow-magic-orange/20 transition-all duration-200 hover:scale-105"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {set.icon_svg_uri && (
                                <img
                                    src={set.icon_svg_uri}
                                    alt={set.name}
                                    className="w-10 h-10 flex-shrink-0 filter drop-shadow-lg"
                                />
                            )}
                            <h3 className="font-bold text-sm line-clamp-2 flex-1 text-magic-white">
                                {set.name}
                            </h3>
                        </div>
                        <p className="text-xs text-magic-gold font-semibold mb-1 uppercase tracking-wider">
                            {set.code.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                            {set.card_count} cartas
                        </p>
                        <button
                            onClick={() => handleAddToCart(set)}
                            className="w-full bg-magic-orange hover:bg-orange-600 text-white font-bold py-2.5 rounded shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider"
                        >
                            Añadir
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
