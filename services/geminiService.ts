import { GoogleGenAI, GenerateContentResponse, Type, Modality, FunctionDeclaration } from "@google/genai";
import { Slide, ChartData, TableData } from '../data/decks';
import { templates } from "../styles/templates";

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Type Definitions ---
export interface ExtractedMetric {
    label: string;
    value: string;
}

export interface BioSummary {
    summary: string;
    highlights: string[];
}


// --- Function Declarations ---

const generateDeckOutlineFunctionDeclaration: FunctionDeclaration = {
    name: 'generateDeckOutline',
    description: 'Generates a structured 10-slide pitch deck outline with a title and slide content.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A compelling title for the entire pitch deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of slide objects, typically 8-12 slides for a standard pitch deck.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING, description: 'A unique identifier for the slide (e.g., "slide-1")' },
                        title: { type: Type.STRING, description: 'The title of the slide.' },
                        content: { type: Type.STRING, description: 'Bulleted list of content points, separated by newlines.' },
                        imageUrl: { type: Type.STRING, description: '(Optional) A relevant search query for a background image.' },
                    },
                    required: ['id', 'title', 'content'],
                },
            },
        },
        required: ['title', 'slides'],
    },
};

const rewriteSlideFunctionDeclaration: FunctionDeclaration = {
    name: 'rewriteSlide',
    description: 'Revises and improves the title and content of a slide based on an instruction.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            newTitle: { type: Type.STRING, description: 'The revised, improved title for the slide.' },
            newContent: