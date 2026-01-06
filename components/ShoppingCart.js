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
            <div className="bg-magic-gray border border-magic-light-gray rounded p-6 text-center">
                <p className="text-gray-400">Tu carrito está vacío</p>
                <p className="text-sm text-gray-500 mt-2">
                    Añade sobres desde la tienda
                </p>
            </div>
        );
    }

    return (
        <div className="bg-magic-dark border border-magic-light-gray rounded p-6">
            <h3 className="text-lg font-bold mb-4 text-magic-gold uppercase tracking-wider">
                Carrito de Compra
            </h3>

            <div className="space-y-3 mb-6">
                {cart.map((item) => (
                    <div
                        key={item.setCode}
                        className="bg-magic-gray border border-magic-light-gray rounded p-3 hover:border-magic-gold"
                    >
                        <div className="flex items-start gap-3 mb-2">
                            {item.icon && (
                                <img
                                    src={item.icon}
                                    alt={item.setName}
                                    className="w-8 h-8 flex-shrink-0"
                                />
                            )}

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-magic-white text-sm truncate">
                                    {item.setName}
                                </h4>
                                <p className="text-xs text-gray-400">
                                    €{item.price.toFixed(2)} c/u
                                </p>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.setCode)}
                                className="text-magic-orange hover:text-red-400 text-xl font-bold flex-shrink-0"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateCartQuantity(
                                            item.setCode,
                                            item.quantity - 1
                                        )
                                    }
                                    className="w-7 h-7 bg-magic-light-gray hover:bg-magic-orange rounded flex items-center justify-center font-bold text-sm"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-bold text-magic-white text-sm">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        updateCartQuantity(
                                            item.setCode,
                                            item.quantity + 1
                                        )
                                    }
                                    className="w-7 h-7 bg-magic-light-gray hover:bg-magic-orange rounded flex items-center justify-center font-bold text-sm"
                                >
                                    +
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-magic-gold text-sm">
                                    €{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-magic-light-gray pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm uppercase tracking-wider text-gray-400">
                        Total:
                    </span>
                    <span className="text-2xl font-bold text-magic-gold">
                        €{total.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm uppercase tracking-wider text-gray-400">
                        Tus euros:
                    </span>
                    <span
                        className={`font-bold ${
                            (euros || 50) >= total
                                ? "text-green-400"
                                : "text-magic-orange"
                        }`}
                    >
                        €{(euros || 50).toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={(euros || 50) < total}
                    className="w-full bg-magic-orange hover:bg-orange-600 disabled:bg-magic-light-gray disabled:cursor-not-allowed text-white font-bold py-3 rounded uppercase tracking-wider text-sm"
                >
                    {(euros || 50) < total
                        ? "Euros insuficientes"
                        : "Confirmar Compra"}
                </button>
            </div>
        </div>
    );
}
