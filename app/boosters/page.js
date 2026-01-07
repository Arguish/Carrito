"use client";

import UnopenedBoosters from "@/components/UnopenedBoosters";

export default function BoostersPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-magic-white mb-2 uppercase tracking-wide">
                    Sobres Sin Abrir
                </h2>
                <p className="text-gray-400 text-sm">
                    Haz clic en un sobre para abrirlo y descubrir tus cartas
                </p>
            </div>
            <UnopenedBoosters />
        </div>
    );
}
