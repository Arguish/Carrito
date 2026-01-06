// API de Scryfall para obtener datos de cartas
const BASE_URL = "https://api.scryfall.com";

// Obtener sets/expansiones disponibles
export async function getSets() {
    try {
        console.log("Fetching sets from Scryfall...");
        const response = await fetch(`${BASE_URL}/sets`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Sets fetched:", data.data?.length);

        // Palabras a excluir de los nombres de sets
        const excludedKeywords = [
            "Tokens",
            "Art Series",
            "Eternal",
            "Jumpstart",
        ];

        // Filtrar solo sets con cartas físicas y que no sean promos
        const filtered = data.data.filter((set) => {
            // Verificar que no contenga palabras excluidas
            const hasExcludedKeyword = excludedKeywords.some((keyword) =>
                set.name.includes(keyword)
            );

            return (
                set.card_count >= 100 &&
                set.set_type !== "promo" &&
                set.digital === false &&
                !hasExcludedKeyword
            );
        });

        console.log("Filtered sets:", filtered.length);
        return filtered;
    } catch (error) {
        console.error("Error fetching sets:", error);
        return [];
    }
}

// Obtener cartas de un set específico
export async function getCardsFromSet(setCode) {
    try {
        const response = await fetch(
            `${BASE_URL}/cards/search?q=set:${setCode}`
        );
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching cards:", error);
        return [];
    }
}

// Simular apertura de sobre (15 cartas random del set)
export async function openBooster(setCode, setInfo = {}) {
    try {
        const cards = await getCardsFromSet(setCode);

        if (cards.length === 0) return [];

        // Simulación de rareza de sobres de Magic
        // 10 comunes, 3 uncommon, 1 rara, 1 puede ser tierra básica o token
        const commons = cards.filter((c) => c.rarity === "common");
        const uncommons = cards.filter((c) => c.rarity === "uncommon");
        const rares = cards.filter(
            (c) => c.rarity === "rare" || c.rarity === "mythic"
        );

        const boosterCards = [];

        // 10 comunes
        for (let i = 0; i < 10; i++) {
            if (commons.length > 0) {
                const randomCard =
                    commons[Math.floor(Math.random() * commons.length)];
                boosterCards.push(formatCard(randomCard, setInfo));
            }
        }

        // 3 uncommons
        for (let i = 0; i < 3; i++) {
            if (uncommons.length > 0) {
                const randomCard =
                    uncommons[Math.floor(Math.random() * uncommons.length)];
                boosterCards.push(formatCard(randomCard, setInfo));
            }
        }

        // 1 rara o mítica (10% chance de mítica)
        const mythicChance = Math.random() < 0.1;
        const rarePool = mythicChance
            ? rares.filter((c) => c.rarity === "mythic")
            : rares;

        if (rarePool.length > 0) {
            const randomCard =
                rarePool[Math.floor(Math.random() * rarePool.length)];
            boosterCards.push(formatCard(randomCard, setInfo));
        }

        return boosterCards;
    } catch (error) {
        console.error("Error opening booster:", error);
        return [];
    }
}

// Formatear carta para nuestro uso
function formatCard(card, setInfo = {}) {
    // Asegurar precio mínimo de 0.10€
    let price = parseFloat(card.prices?.eur || "0.10");
    if (isNaN(price) || price <= 0) {
        price = 0.1;
    }

    return {
        id: card.id,
        name: card.name,
        image: card.image_uris?.normal || card.image_uris?.small || "",
        rarity: card.rarity,
        set: card.set,
        set_name: card.set_name,
        set_icon: setInfo.icon || "",
        set_card_count: setInfo.card_count || 0,
        type: card.type_line,
        manaCost: card.mana_cost || "",
        price: price,
    };
}
