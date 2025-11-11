export interface Event {
    id: number | string;
    title: string;
    date: string; // ISO string format from backend
    location: string;
    description: string;
}

// Simulate a backend API call
export const getEvents = async (): Promise<Event[]> => {
    // In a real app, this would be:
    // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`);
    // if (!response.ok) {
    //     throw new Error('Failed to fetch events');
    // }
    // return response.json();

    console.log("Fetching events from simulated backend...");

    // Mock data to simulate backend response
    const backendEvents: Event[] = [
        { id: 101, title: "AI for Founders: A Practical Workshop", date: "2024-10-10T10:00:00Z", location: "Virtual", description: "Learn how to leverage generative AI to accelerate your startup's growth. Fetched from backend." },
        { id: 102, title: "Investor Readiness Bootcamp", date: "2024-11-05T13:00:00Z", location: "New York, NY", description: "A full-day, in-person event to get your pitch and financials ready for investors. Fetched from backend." },
        { id: 103, title: "Community Mixer & Demo Night", date: "2024-11-20T18:00:00Z", location: "San Francisco, CA", description: "Connect with the Sun AI community and see demos from the latest batch of startups. Fetched from backend." },
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate a potential error (10% chance of failure)
    if (Math.random() < 0.1) { 
        throw new Error("Network error: Could not connect to the server.");
    }

    return backendEvents;
};