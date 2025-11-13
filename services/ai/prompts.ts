import { Type, FunctionDeclaration } from '@google/genai';

// This file centralizes all FunctionDeclarations used by the AI services.

export const generateDeckOutlineFunctionDeclaration: FunctionDeclaration = {
    name: 'generateDeckOutline',
    description: 'Generates a complete 10-slide pitch deck outline for a startup.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A catchy title for the entire pitch deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of 10 slide objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'The title of the slide.' },
                        content: { type: Type.STRING, description: 'The content of the slide, with bullet points separated by newlines.' },
                        imageUrl: { type: Type.STRING, description: 'A descriptive prompt for an image to be generated for this slide.' },
                        type: { type: Type.STRING, description: "The type of slide (e.g., 'problem', 'solution')." }
                    },
                    required: ['title', 'content', 'imageUrl', 'type']
                }
            }
        },
        required: ['title', 'slides']
    }
};

export const rewriteSlideFunctionDeclaration: FunctionDeclaration = {
    name: 'rewriteSlide',
    description: 'Rewrites the title and content of a presentation slide based on a given instruction.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            newTitle: { type: Type.STRING, description: 'The new, rewritten title for the slide.' },
            newContent: { type: Type.STRING, description: 'The new, rewritten content for the slide, with bullet points separated by newlines.' },
        },
        required: ['newTitle', 'newContent'],
    }
};

export const analyzeSlideContentFunctionDeclaration: FunctionDeclaration = {
    name: 'analyzeSlideContent',
    description: 'Analyzes a slide for clarity, impact, and tone, providing ratings and feedback.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            clarity: {
                type: Type.OBJECT, properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING }
                }, required: ['rating', 'feedback']
            },
            impact: {
                type: Type.OBJECT, properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING }
                }, required: ['rating', 'feedback']
            },
            tone: {
                type: Type.OBJECT, properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING }
                }, required: ['rating', 'feedback']
            }
        },
        required: ['clarity', 'impact', 'tone']
    }
};

export const chooseLayoutFunctionDeclaration: FunctionDeclaration = {
    name: 'chooseLayout',
    description: 'Suggests the most effective layout for a slide based on its content.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            layout: { type: Type.STRING, description: `The key of the suggested layout (e.g., 'minimalist').` }
        },
        required: ['layout']
    }
};

export const generateAllSuggestionsFunctionDeclaration: FunctionDeclaration = {
    name: 'generateAllSuggestions',
    description: 'Generates contextual suggestions for improving a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            copilotSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 actionable prompts for an AI copilot to improve the content.' },
            imageSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 creative prompts to generate a relevant image.' },
            researchSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 Google search queries to find supporting data.' },
        },
        required: ['copilotSuggestions', 'imageSuggestions', 'researchSuggestions']
    }
};

export const suggestChartFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestChart',
    description: 'Analyzes slide content for data and suggests a bar chart representation.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
                description: 'An array of data objects for the chart.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.NUMBER }
                    },
                    required: ['label', 'value']
                }
            }
        },
        required: ['data']
    }
};

export const suggestPieChartFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestPieChart',
    description: 'Analyzes slide content for percentage allocations and suggests a pie chart.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
                description: 'An array of data objects for the pie chart.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.NUMBER }
                    },
                    required: ['label', 'value']
                }
            }
        },
        required: ['data']
    }
};

export const createRoadmapContentFunctionDeclaration: FunctionDeclaration = {
    name: 'createRoadmapContent',
    description: 'Generates four forward-looking milestones for a startup roadmap.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            milestones: {
                type: Type.ARRAY,
                description: 'An array of exactly 4 milestone titles.',
                items: { type: Type.STRING }
            }
        },
        required: ['milestones']
    }
};

export const generateHeadlineVariationsFunctionDeclaration: FunctionDeclaration = {
    name: 'generateHeadlineVariations',
    description: 'Generates five compelling headline variations for a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headlines: {
                type: Type.ARRAY,
                description: 'An array of 5 headline strings.',
                items: { type: Type.STRING }
            }
        },
        required: ['headlines']
    }
};

export const extractMetricsFunctionDeclaration: FunctionDeclaration = {
    name: 'extractMetrics',
    description: 'Extracts quantifiable business metrics from text.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            metrics: {
                type: Type.ARRAY,
                description: 'An array of key metrics found in the text.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING }
                    },
                    required: ['label', 'value']
                }
            }
        },
        required: ['metrics']
    }
};

export const generatePricingTableFunctionDeclaration: FunctionDeclaration = {
    name: 'generatePricingTable',
    description: 'Converts unstructured text about pricing into a structured format.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            tiers: {
                type: Type.ARRAY,
                description: 'An array of pricing tier objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        price: { type: Type.STRING },
                        features: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['name', 'price', 'features']
                }
            }
        },
        required: ['tiers']
    }
};

export const summarizeBioFunctionDeclaration: FunctionDeclaration = {
    name: 'summarizeBio',
    description: 'Summarizes a professional biography and extracts key highlights.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: 'A compelling one-sentence summary.' },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 2-3 key credentials.' }
        },
        required: ['summary', 'highlights']
    }
};

export const generateEventDescriptionFunctionDeclaration: FunctionDeclaration = {
    name: 'generateEventDescription',
    description: 'Generates a compelling one-paragraph event description.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            description: {
                type: Type.STRING,
                description: 'The generated event description text.'
            }
        },
        required: ['description']
    }
};

export const generateEventTitlesFunctionDeclaration: FunctionDeclaration = {
    name: 'generateEventTitles',
    description: 'Generates 3 creative and engaging alternative titles for an event.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            titles: {
                type: Type.ARRAY,
                description: 'An array of exactly 3 alternative event titles.',
                items: { type: Type.STRING }
            }
        },
        required: ['titles']
    }
};

export const generateSocialMediaCopyFunctionDeclaration: FunctionDeclaration = {
    name: 'generateSocialMediaCopy',
    description: "Generates tailored promotional copy for an event for Twitter, LinkedIn, and Instagram.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            twitter: { type: Type.STRING, description: 'A short, engaging post for Twitter, under 280 characters.' },
            linkedin: { type: Type.STRING, description: 'A professional post for LinkedIn.' },
            instagram: { type: Type.STRING, description: 'An engaging caption for Instagram.' }
        },
        required: ['twitter', 'linkedin', 'instagram']
    }
};

export const structureAgendaFunctionDeclaration: FunctionDeclaration = {
    name: 'structureAgenda',
    description: 'Formats a raw list of event topics into a structured, timed agenda.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            schedule: {
                type: Type.ARRAY,
                description: 'An array of agenda item objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        time: { type: Type.STRING, description: 'The start time of the item (e.g., "6:00 PM").' },
                        topic: { type: Type.STRING, description: 'The title or description of the item.' },
                        speaker: { type: Type.STRING, description: 'Optional: The name of the speaker.' }
                    },
                    required: ['time', 'topic']
                }
            }
        },
        required: ['schedule']
    }
};
