import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGameStore = create(
    persist(
        (set, get) => ({
            euros: 50,
            collection: [],
            ownedSets: [],
            cart: [],
            unopenedBoosters: [],
            sellCart: [],

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

            sellCard: (cardId) =>
                set((state) => {
                    const card = state.collection.find((c) => c.id === cardId);
                    if (!card || card.quantity <= 0) return state;

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

            buyBooster: (cost) =>
                set((state) => {
                    if (state.coins < cost) return state;
                    return { coins: state.coins - cost };
                }),

            addToSellCart: (card) =>
                set((state) => {
                    const existingCard = state.sellCart.find(
                        (c) => c.id === card.id
                    );

                    let price = parseFloat(card.price);
                    if (isNaN(price) || price <= 0) {
                        price = 0.1;
                    }

                    const collectionCard = state.collection.find(
                        (c) => c.id === card.id
                    );
                    if (!collectionCard) return state;

                    const quantityInCart = existingCard
                        ? existingCard.quantity
                        : 0;

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

            removeFromSellCart: (cardId) =>
                set((state) => ({
                    sellCart: state.sellCart.filter((c) => c.id !== cardId),
                })),

            updateSellCartQuantity: (cardId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            sellCart: state.sellCart.filter(
                                (c) => c.id !== cardId
                            ),
                        };
                    }

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

            sellCartItems: () =>
                set((state) => {
                    const total = state.sellCart.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    );

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
                        euros: state.euros + total,
                        collection: newCollection,
                        sellCart: [],
                    };
                }),

            clearSellCart: () =>
                set({
                    sellCart: [],
                }),

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
                            { ...setInfo, quantity: 1, price: 5 },
                        ],
                    };
                }),

            removeFromCart: (setCode) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.setCode !== setCode),
                })),

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

            checkoutCart: () =>
                set((state) => {
                    const total = state.cart.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    );

                    if (state.euros < total) return state;

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
                        euros: state.euros - total,
                        cart: [],
                        unopenedBoosters: [
                            ...state.unopenedBoosters,
                            ...newBoosters,
                        ],
                    };
                }),

            openBoosterFromInventory: (boosterId) =>
                set((state) => ({
                    unopenedBoosters: state.unopenedBoosters.filter(
                        (b) => b.id !== boosterId
                    ),
                })),

            reset: () =>
                set({
                    euros: 50,
                    collection: [],
                    ownedSets: [],
                    cart: [],
                    unopenedBoosters: [],
                    sellCart: [],
                }),
        }),
        {
            name: "magic-collection-storage",
            partialize: (state) => ({
                euros: state.euros,
                collection: state.collection,
                ownedSets: state.ownedSets,
                cart: state.cart,
                unopenedBoosters: state.unopenedBoosters,
                sellCart: state.sellCart,
            }),
        }
    )
);
