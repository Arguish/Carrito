"use client";

import { useGameStore } from "@/store/gameStore";
import { useUI } from "@/context/UIContext";

export default function ShoppingCart() {
    const {
        cart,
        euros = 50,
        removeFromCart,
        updateCartQuantity,
        checkoutCart,
    } = useGameStore();
    const { addNotification } = useUI();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        if ((euros || 50) < total) {
            addNotification("No tienes suficientes euros", "error");
            return;
        }

        const totalBoosters = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        checkoutCart();
        addNotification(
            `¡Compra realizada! ${totalBoosters} sobres añadidos`,
            "success"
        );
    };

    if (cart.length === 0) {
        return (
            <div className="bg-magic-purple rounded-lg p-6 text-center">
                <p className="text-gray-400">Tu carrito está vacío</p>
                <p className="text-sm text-gray-500 mt-2">
                    Añade sobres desde la tienda
                </p>
            </div>
        );
    }

    return (
        <div className="bg-magic-purple rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-magic-gold">
                🛒 Carrito de Compra
            </h3>

            <div className="space-y-3 mb-6">
                {cart.map((item) => (
                    <div
                        key={item.setCode}
                        className="bg-magic-black rounded-lg p-4 flex items-center gap-4"
                    >
                        {item.icon && (
                            <img
                                src={item.icon}
                                alt={item.setName}
                                className="w-10 h-10"
                            />
                        )}

                        <div className="flex-1">
                            <h4 className="font-semibold">{item.setName}</h4>
                            <p className="text-sm text-gray-400">
                                {item.price} monedas c/u
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    updateCartQuantity(
                                        item.setCode,
                                        item.quantity - 1
                                    )
                                }
                                className="w-8 h-8 bg-magic-purple hover:bg-gray-600 rounded flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-bold">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() =>
                                    updateCartQuantity(
                                        item.setCode,
                                        item.quantity + 1
                                    )
                                }
                                className="w-8 h-8 bg-magic-purple hover:bg-gray-600 rounded flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                            <p className="font-bold text-magic-gold">
                                €{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400">euros</p>
                        </div>

                        <button
                            onClick={() => removeFromCart(item.setCode)}
                            className="text-red-400 hover:text-red-300 text-xl"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-magic-gold">
                        €{total.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">Tus euros:</span>
                    <span
                        className={`font-bold ${
                            (euros || 50) >= total
                                ? "text-green-400"
                                : "text-red-400"
                        }`}
                    >
                        €{(euros || 50).toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={(euros || 50) < total}
                    className="w-full bg-magic-gold hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-magic-black font-bold py-3 rounded-lg transition-colors"
                >
                    {(euros || 50) < total
                        ? "Euros insuficientes"
                        : "Confirmar Compra"}
                </button>
            </div>
        </div>
    );
}
