import { Deck, Slide, mockDeck } from '../data/decks';

export const getDecks = async (): Promise<Deck[]> => {
    const decks: Deck[] = [];
    // Await a Promise to simulate async behavior
    await new Promise(resolve => setTimeout(resolve, 100));
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('deck-')) {
            const deck = JSON.parse(sessionStorage.getItem(key)!);
            decks.push(deck);
        }
    }
    // If no decks in session storage, return the mock deck for demo purposes
    if (decks.length === 0) {
        return [mockDeck];
    }
    return decks.sort((a, b) => b.id.localeCompare(a.id)); // Sort by creation time desc
};

export const getDeckById = async (id: string): Promise<Deck | null> => {
    // Await a Promise to simulate async behavior
    await new Promise(resolve => setTimeout(resolve, 50));
    const storedDeck = sessionStorage.getItem(`deck-${id}`);
    if (storedDeck) {
        return JSON.parse(storedDeck);
    }
    // Fallback for mock environment if sessionStorage is empty
    if (id === mockDeck.id) {
         return mockDeck;
    }
    return null;
};
