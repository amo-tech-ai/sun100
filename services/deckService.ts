import { Deck, Slide, mockDeck } from '../data/decks';

export const getDecks = async (): Promise<Deck[]> => {
    const decks: Deck[] = [];
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
    const storedDeck = sessionStorage.getItem(`deck-${id}`);
    if (storedDeck) {
        return JSON.parse(storedDeck);
    }
    // Fallback for mock environment if sessionStorage is empty
    if (id.startsWith('mock-deck-')) {
         return mockDeck;
    }
    return null;
};

export const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck | null> => {
    const deck = await getDeckById(id);
    if (!deck) return null;
    const updatedDeck = { ...deck, ...updates };
    sessionStorage.setItem(`deck-${id}`, JSON.stringify(updatedDeck));
    return updatedDeck;
};

export const updateSlide = async (id: string, updates: Partial<Slide>): Promise<Slide | null> => {
    // This is more complex without a backend, as we need to find which deck the slide belongs to.
    // For this implementation, we'll assume the full deck object is updated in the component
    // and saved back to sessionStorage, so this function is more of a placeholder.
    console.log(`Updating slide ${id} with`, updates);
    // The main logic will be in DeckEditor.tsx's useEffect hook.
    return null;
};
