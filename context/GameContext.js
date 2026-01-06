"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

const GameContext = createContext();

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame debe usarse dentro de GameProvider");
    }
    return context;
}

export function GameProvider({ children }) {
    const [euros, setEuros] = useState(50);
    const [collection, setCollection] = useState([]);
    const [cart, setCart] = useState([]);
    const [unopenedBoosters, setUnopenedBoosters] = useState([]);
    const [sellCart, setSellCart] = useState([]);
    const [mounted, setMounted] = useState(false);

    // Cargar estado desde localStorage al montar
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("magic-collection-storage");
        if (saved) {
            try {
                const state = JSON.parse(saved);
                if (state.state) {
                    setEuros(state.state.euros || 50);
                    setCollection(state.state.collection || []);
                    setCart(state.state.cart || []);
                    setUnopenedBoosters(state.state.unopenedBoosters || []);
                    setSellCart(state.state.sellCart || []);
                }
            } catch (error) {
                console.error("Error loading saved state:", error);
            }
        }
    }, []);

    // Guardar estado en localStorage cuando cambia
    useEffect(() => {
        if (mounted) {
            const state = {
                state: {
                    euros,
                    collection,
                    cart,
                    unopenedBoosters,
                    sellCart,
                },
                version: 0,
            };
            localStorage.setItem(
                "magic-collection-storage",
                JSON.stringify(state)
            );
        }
    }, [euros, collection, cart, unopenedBoosters, sellCart, mounted]);

    // Añadir carta a la colección
    const addCard = useCallback((card) => {
        setCollection((prev) => {
            const existing = prev.find((c) => c.id === card.id);
            if (existing) {
                return prev.map((c) =>
                    c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { ...card, quantity: 1 }];
        });
    }, []);

    // Añadir múltiples cartas (al abrir un sobre)
    const addCards = useCallback((cards) => {
        setCollection((prev) => {
            let newCollection = [...prev];

            cards.forEach((card) => {
                const existingIndex = newCollection.findIndex(
                    (c) => c.id === card.id
                );

                if (existingIndex >= 0) {
                    newCollection[existingIndex] = {
                        ...newCollection[existingIndex],
                        quantity: newCollection[existingIndex].quantity + 1,
                    };
                } else {
                    newCollection.push({ ...card, quantity: 1 });
                }
            });

            return newCollection;
        });
    }, []);

    // Añadir carta al carrito de venta
    const addToSellCart = useCallback(
        (card) => {
            setSellCart((prev) => {
                const existingCard = prev.find((c) => c.id === card.id);

                // Asegurar precio mínimo de 0.10€
                let price = parseFloat(card.price);
                if (isNaN(price) || price <= 0) {
                    price = 0.1;
                }

                // Verificar que la carta exista en la colección
                const collectionCard = collection.find((c) => c.id === card.id);
                if (!collectionCard) return prev;

                // Verificar cuántas ya están en el carrito
                const quantityInCart = existingCard ? existingCard.quantity : 0;

                // No permitir agregar más de las que se tienen
                if (quantityInCart >= collectionCard.quantity) return prev;

                if (existingCard) {
                    return prev.map((c) =>
                        c.id === card.id
                            ? { ...c, quantity: c.quantity + 1 }
                            : c
                    );
                }

                return [...prev, { ...card, quantity: 1, price }];
            });
        },
        [collection]
    );

    // Eliminar del carrito de venta
    const removeFromSellCart = useCallback((cardId) => {
        setSellCart((prev) => prev.filter((c) => c.id !== cardId));
    }, []);

    // Actualizar cantidad en carrito de venta
    const updateSellCartQuantity = useCallback(
        (cardId, quantity) => {
            if (quantity <= 0) {
                removeFromSellCart(cardId);
                return;
            }

            setSellCart((prev) => {
                // Verificar límite de la colección
                const collectionCard = collection.find((c) => c.id === cardId);
                if (!collectionCard || quantity > collectionCard.quantity)
                    return prev;

                return prev.map((c) =>
                    c.id === cardId ? { ...c, quantity } : c
                );
            });
        },
        [collection, removeFromSellCart]
    );

    // Confirmar venta del carrito
    const sellCartItems = useCallback(() => {
        const total = sellCart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Actualizar colección eliminando las cartas vendidas
        setCollection((prev) => {
            let newCollection = [...prev];
            sellCart.forEach((item) => {
                newCollection = newCollection
                    .map((c) =>
                        c.id === item.id
                            ? { ...c, quantity: c.quantity - item.quantity }
                            : c
                    )
                    .filter((c) => c.quantity > 0);
            });
            return newCollection;
        });

        setEuros((prev) => prev + total);
        setSellCart([]);

        return { success: true, total };
    }, [sellCart]);

    // Vaciar carrito de venta
    const clearSellCart = useCallback(() => {
        setSellCart([]);
    }, []);

    // Añadir sobres al carrito
    const addToCart = useCallback((setInfo) => {
        setCart((prev) => {
            const existingItem = prev.find(
                (item) => item.setCode === setInfo.setCode
            );

            if (existingItem) {
                return prev.map((item) =>
                    item.setCode === setInfo.setCode
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...setInfo, quantity: 1, price: 5 }];
        });
    }, []);

    // Eliminar del carrito
    const removeFromCart = useCallback((setCode) => {
        setCart((prev) => prev.filter((item) => item.setCode !== setCode));
    }, []);

    // Actualizar cantidad en carrito
    const updateCartQuantity = useCallback(
        (setCode, quantity) => {
            if (quantity <= 0) {
                removeFromCart(setCode);
                return;
            }

            setCart((prev) =>
                prev.map((item) =>
                    item.setCode === setCode ? { ...item, quantity } : item
                )
            );
        },
        [removeFromCart]
    );

    // Confirmar compra del carrito
    const checkoutCart = useCallback(() => {
        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        if (euros < total) {
            return { success: false, message: "No tienes suficientes euros" };
        }

        // Crear sobres sin abrir
        const newBoosters = [];
        cart.forEach((item) => {
            for (let i = 0; i < item.quantity; i++) {
                newBoosters.push({
                    id: `${item.setCode}-${Date.now()}-${i}`,
                    setCode: item.setCode,
                    setName: item.setName,
                    icon: item.icon,
                    card_count: item.card_count || 0,
                });
            }
        });

        setEuros((prev) => prev - total);
        setCart([]);
        setUnopenedBoosters((prev) => [...prev, ...newBoosters]);

        return { success: true, message: "Compra realizada con éxito" };
    }, [cart, euros]);

    // Abrir un sobre (eliminar del inventario)
    const openBoosterFromInventory = useCallback((boosterId) => {
        setUnopenedBoosters((prev) => prev.filter((b) => b.id !== boosterId));
    }, []);

    // Resetear todo
    const reset = useCallback(() => {
        setEuros(50);
        setCollection([]);
        setCart([]);
        setUnopenedBoosters([]);
        setSellCart([]);
        localStorage.removeItem("magic-collection-storage");
    }, []);

    const value = {
        euros,
        collection,
        cart,
        unopenedBoosters,
        sellCart,
        addCard,
        addCards,
        addToSellCart,
        removeFromSellCart,
        updateSellCartQuantity,
        sellCartItems,
        clearSellCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        checkoutCart,
        openBoosterFromInventory,
        reset,
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
}
