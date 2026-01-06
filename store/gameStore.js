import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store para gestionar la colección, monedas y sobres
export const useGameStore = create(
    persist(
        (set, get) => ({
            // Estado inicial
            coins: 1000, // Monedas iniciales para empezar
            collection: [], // Array de cartas en la colección {id, name, image, rarity, set, quantity}
            ownedSets: [], // Sets completados
            cart: [], // Carrito de compra {setCode, setName, icon, quantity, price}
            unopenedBoosters: [], // Sobres sin abrir {id, setCode, setName, icon}
            sellCart: [], // Carrito de venta de cartas {id, name, image, rarity, quantity, price}

            // Añadir carta a la colección
            addCard: (card) =>
                set((state) => {
                    const existingCard = state.collection.find(
                        (c) => c.id === card.id
                    );

                    if (existingCard) {
                        return {
                            collection: state.collection.map((c) =>
                                c.id === card.id
                                    ? { ...c, quantity: c.quantity + 1 }
                                    : c
                            ),
                        };
                    }

                    return {
                        collection: [
                            ...state.collection,
                            { ...card, quantity: 1 },
                        ],
                    };
                }),

            // Añadir múltiples cartas (al abrir un sobre)
            addCards: (cards) =>
                set((state) => {
                    let newCollection = [...state.collection];

                    cards.forEach((card) => {
                        const existingIndex = newCollection.findIndex(
                            (c) => c.id === card.id
                        );

                        if (existingIndex >= 0) {
                            newCollection[existingIndex] = {
                                ...newCollection[existingIndex],
                                quantity:
                                    newCollection[existingIndex].quantity + 1,
                            };
                        } else {
                            newCollection.push({ ...card, quantity: 1 });
                        }
                    });

                    return { collection: newCollection };
                }),

            // Vender una carta
            sellCard: (cardId) =>
                set((state) => {
                    const card = state.collection.find((c) => c.id === cardId);
                    if (!card || card.quantity <= 0) return state;

                    // Precio según rareza
                    const prices = {
                        common: 10,
                        uncommon: 25,
                        rare: 100,
                        mythic: 300,
                    };

                    const price = prices[card.rarity] || 10;

                    return {
                        coins: state.coins + price,
                        collection: state.collection
                            .map((c) =>
                                c.id === cardId
                                    ? { ...c, quantity: c.quantity - 1 }
                                    : c
                            )
                            .filter((c) => c.quantity > 0),
                    };
                }),

            // Comprar un sobre
            buyBooster: (cost) =>
                set((state) => {
                    if (state.coins < cost) return state;
                    return { coins: state.coins - cost };
                }),

            // Añadir carta al carrito de venta
            addToSellCart: (card) =>
                set((state) => {
                    const existingCard = state.sellCart.find(
                        (c) => c.id === card.id
                    );

                    // Precio según rareza
                    const prices = {
                        common: 10,
                        uncommon: 25,
                        rare: 100,
                        mythic: 300,
                    };

                    const price = prices[card.rarity] || 10;

                    // Verificar que la carta exista en la colección
                    const collectionCard = state.collection.find(
                        (c) => c.id === card.id
                    );
                    if (!collectionCard) return state;

                    // Verificar cuántas ya están en el carrito
                    const quantityInCart = existingCard
                        ? existingCard.quantity
                        : 0;

                    // No permitir agregar más de las que se tienen
                    if (quantityInCart >= collectionCard.quantity) return state;

                    if (existingCard) {
                        return {
                            sellCart: state.sellCart.map((c) =>
                                c.id === card.id
                                    ? { ...c, quantity: c.quantity + 1 }
                                    : c
                            ),
                        };
                    }

                    return {
                        sellCart: [
                            ...state.sellCart,
                            { ...card, quantity: 1, price },
                        ],
                    };
                }),

            // Eliminar del carrito de venta
            removeFromSellCart: (cardId) =>
                set((state) => ({
                    sellCart: state.sellCart.filter((c) => c.id !== cardId),
                })),

            // Actualizar cantidad en carrito de venta
            updateSellCartQuantity: (cardId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            sellCart: state.sellCart.filter(
                                (c) => c.id !== cardId
                            ),
                        };
                    }

                    // Verificar límite de la colección
                    const collectionCard = state.collection.find(
                        (c) => c.id === cardId
                    );
                    if (!collectionCard || quantity > collectionCard.quantity)
                        return state;

                    return {
                        sellCart: state.sellCart.map((c) =>
                            c.id === cardId ? { ...c, quantity } : c
                        ),
                    };
                }),

            // Confirmar venta del carrito
            sellCartItems: () =>
                set((state) => {
                    const total = state.sellCart.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    );

                    // Actualizar colección eliminando las cartas vendidas
                    let newCollection = [...state.collection];
                    state.sellCart.forEach((item) => {
                        newCollection = newCollection
                            .map((c) =>
                                c.id === item.id
                                    ? {
                                          ...c,
                                          quantity: c.quantity - item.quantity,
                                      }
                                    : c
                            )
                            .filter((c) => c.quantity > 0);
                    });

                    return {
                        coins: state.coins + total,
                        collection: newCollection,
                        sellCart: [],
                    };
                }),

            // Vaciar carrito de venta
            clearSellCart: () =>
                set({
                    sellCart: [],
                }),

            // Añadir sobres al carrito
            addToCart: (setInfo) =>
                set((state) => {
                    const existingItem = state.cart.find(
                        (item) => item.setCode === setInfo.setCode
                    );

                    if (existingItem) {
                        return {
                            cart: state.cart.map((item) =>
                                item.setCode === setInfo.setCode
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }

                    return {
                        cart: [
                            ...state.cart,
                            { ...setInfo, quantity: 1, price: 200 },
                        ],
                    };
                }),

            // Eliminar del carrito
            removeFromCart: (setCode) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.setCode !== setCode),
                })),

            // Actualizar cantidad en carrito
            updateCartQuantity: (setCode, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            cart: state.cart.filter(
                                (item) => item.setCode !== setCode
                            ),
                        };
                    }
                    return {
                        cart: state.cart.map((item) =>
                            item.setCode === setCode
                                ? { ...item, quantity }
                                : item
                        ),
                    };
                }),

            // Confirmar compra del carrito
            checkoutCart: () =>
                set((state) => {
                    const total = state.cart.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    );

                    if (state.coins < total) return state;

                    // Crear sobres sin abrir
                    const newBoosters = [];
                    state.cart.forEach((item) => {
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

                    return {
                        coins: state.coins - total,
                        cart: [],
                        unopenedBoosters: [
                            ...state.unopenedBoosters,
                            ...newBoosters,
                        ],
                    };
                }),

            // Abrir un sobre (eliminar del inventario)
            openBoosterFromInventory: (boosterId) =>
                set((state) => ({
                    unopenedBoosters: state.unopenedBoosters.filter(
                        (b) => b.id !== boosterId
                    ),
                })),

            // Resetear todo
            reset: () =>
                set({
                    coins: 1000,
                    collection: [],
                    ownedSets: [],
                    cart: [],
                    unopenedBoosters: [],
                    sellCart: [],
                }),
        }),
        {
            name: "magic-collection-storage",
            // Opciones adicionales para asegurar la persistencia
            partialize: (state) => ({
                coins: state.coins,
                collection: state.collection,
                ownedSets: state.ownedSets,
                cart: state.cart,
                unopenedBoosters: state.unopenedBoosters,
                sellCart: state.sellCart,
            }),
        }
    )
);
