const BASE_URL = "https://api.scryfall.com";

export async function getSets() {
    try {
        console.log("Fetching sets from Scryfall...");
        const response = await fetch(`${BASE_URL}/sets`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Sets fetched:", data.data?.length);

        const excludedKeywords = [
            "Tokens",
            "Art Series",
            "Eternal",
            "Jumpstart",
        ];

        const filtered = data.data.filter((set) => {
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

function getRandomCard(cardPool) {
    if (!cardPool || cardPool.length === 0) return null;
    return cardPool[Math.floor(Math.random() * cardPool.length)];
}

function getRareOrMythic(rares, mythics) {
    const isMythic = Math.random() < 0.1351;
    const pool = isMythic && mythics.length > 0 ? mythics : rares;
    return getRandomCard(pool);
}

export async function openBooster(setCode, setInfo = {}) {
    try {
        const cards = await getCardsFromSet(setCode);

        if (cards.length === 0) return [];

        const commons = cards.filter((c) => c.rarity === "common");
        const uncommons = cards.filter((c) => c.rarity === "uncommon");
        const rares = cards.filter((c) => c.rarity === "rare");
        const mythics = cards.filter((c) => c.rarity === "mythic");
        const lands = cards.filter((c) =>
            c.type_line?.toLowerCase().includes("basic land")
        );

        const boosterCards = [];

        const landCard1 = getRandomCard(lands.length > 0 ? lands : commons);
        if (landCard1) boosterCards.push(formatCard(landCard1, setInfo));

        const landCard2 = getRandomCard(lands.length > 0 ? lands : commons);
        if (landCard2) boosterCards.push(formatCard(landCard2, setInfo));

        const rand = Math.random() * 100;
        let numCommons, numUncommons;

        if (rand < 35) {
            numCommons = 6;
            numUncommons = 1;
        } else if (rand < 75) {
            numCommons = 5;
            numUncommons = 2;
        } else if (rand < 87.5) {
            numCommons = 4;
            numUncommons = 3;
        } else if (rand < 94.5) {
            numCommons = 3;
            numUncommons = 4;
        } else if (rand < 98) {
            numCommons = 2;
            numUncommons = 5;
        } else {
            numCommons = 1;
            numUncommons = 6;
        }

        for (let i = 0; i < numCommons; i++) {
            const card = getRandomCard(commons);
            if (card) boosterCards.push(formatCard(card, setInfo));
        }
        for (let i = 0; i < numUncommons; i++) {
            const card = getRandomCard(uncommons);
            if (card) boosterCards.push(formatCard(card, setInfo));
        }

        for (let i = 0; i < 2; i++) {
            const wildcardRand = Math.random() * 100;
            let wildcardCard;

            if (wildcardRand < 49) {
                wildcardCard = getRandomCard(commons);
            } else if (wildcardRand < 73.5) {
                wildcardCard = getRandomCard(uncommons);
            } else {
                wildcardCard = getRareOrMythic(rares, mythics);
            }

            if (wildcardCard)
                boosterCards.push(formatCard(wildcardCard, setInfo));
        }

        for (let i = 0; i < 3; i++) {
            const rareCard = getRareOrMythic(rares, mythics);
            if (rareCard) boosterCards.push(formatCard(rareCard, setInfo));
        }

        return boosterCards;
    } catch (error) {
        console.error("Error opening booster:", error);
        return [];
    }
}

function formatCard(card, setInfo = {}) {
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
