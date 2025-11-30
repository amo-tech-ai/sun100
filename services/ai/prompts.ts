
import { Type, FunctionDeclaration } from '@google/genai';

// This file centralizes all FunctionDeclarations used by the AI services.

export const generateDeckOutlineFunctionDeclaration: FunctionDeclaration = {
    name: 'generateDeckOutline',
    description: 'Generates a strategic, investor-ready 10-slide pitch deck outline tailored to the specific startup stage and industry.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A professional, catchy title for the pitch deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of 10 slide objects forming a cohesive narrative arc.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'The headline of the slide.' },
                        content: { type: Type.STRING, description: 'The slide body content, concise and impact-oriented, with bullet points separated by newlines.' },
                        imageUrl: { type: Type.STRING, description: 'A highly detailed, style-specific image generation prompt for the slide visual.' },
                        type: { type: Type.STRING, description: "The specific category of the slide (e.g., 'problem', 'solution', 'traction')." }
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
    description: 'Rewrites slide content to improve clarity, impact, and persuasion based on specific instructions.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            newTitle: { type: Type.STRING, description: 'The revised, punchier title.' },
            newContent: { type: Type.STRING, description: 'The rewritten content, formatted as clean bullet points.' },
        },
        required: ['newTitle', 'newContent'],
    }
};

export const analyzeSlideContentFunctionDeclaration: FunctionDeclaration = {
    name: 'analyzeSlideContent',
    description: 'Acts as a VC associate to analyze a slide for clarity, impact, and tone.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            clarity: {
                type: Type.OBJECT, properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING, description: "Specific advice on how to improve clarity." }
                }, required: ['rating', 'feedback']
            },
            impact: {
                type: Type.OBJECT, properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING, description: "Specific advice on how to increase investor impact." }
                }, required: ['rating', 'feedback']
            },
            tone: {
                type: Type.OBJECT, properties: {
                    rating: { type: Type.STRING, description: "Rating: 'Good', 'Average', or 'Needs Improvement'." },
                    feedback: { type: Type.STRING, description: "Specific advice on professional tone." }
                }, required: ['rating', 'feedback']
            }
        },
        required: ['clarity', 'impact', 'tone']
    }
};

export const chooseLayoutFunctionDeclaration: FunctionDeclaration = {
    name: 'chooseLayout',
    description: 'Selects the optimal visual layout template for a slide based on its content type and density.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            layout: { type: Type.STRING, description: `The key of the suggested layout (e.g., 'minimalist', 'vibrantProblem').` }
        },
        required: ['layout']
    }
};

export const generateAllSuggestionsFunctionDeclaration: FunctionDeclaration = {
    name: 'generateAllSuggestions',
    description: 'Generates a comprehensive set of improvement suggestions including copy edits, visual ideas, and research topics.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            copilotSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 strategic prompts for an AI copilot to improve the narrative.' },
            imageSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 creative, detailed prompts to generate high-quality visuals.' },
            researchSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 specific search queries to find supporting market data or benchmarks.' },
        },
        required: ['copilotSuggestions', 'imageSuggestions', 'researchSuggestions']
    }
};

export const suggestChartFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestChart',
    description: 'Extracts numerical data from text and structures it for a bar chart.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
                description: 'An array of data points.',
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
    description: 'Extracts percentage allocation data from text and structures it for a pie chart.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
                description: 'An array of data slices.',
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
    description: 'Generates four strategic, forward-looking milestones for a startup roadmap.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            milestones: {
                type: Type.ARRAY,
                description: 'An array of exactly 4 short, action-oriented milestone titles.',
                items: { type: Type.STRING }
            }
        },
        required: ['milestones']
    }
};

export const generateHeadlineVariationsFunctionDeclaration: FunctionDeclaration = {
    name: 'generateHeadlineVariations',
    description: 'Generates five compelling, high-impact headline variations for a slide.',
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
    description: 'Identifies and extracts key quantifiable business metrics from a block of text.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            metrics: {
                type: Type.ARRAY,
                description: 'An array of extracted metrics.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING, description: "The name of the metric (e.g. 'CAC')." },
                        value: { type: Type.STRING, description: "The value (e.g. '$50')." }
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
    description: 'Structures pricing and feature information into a comparison table format.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            tiers: {
                type: Type.ARRAY,
                description: 'An array of pricing tiers (e.g., Free, Pro, Enterprise).',
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
    description: 'Summarizes a biography into a concise, credibility-building profile.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: 'A powerful one-sentence summary focusing on experience and expertise.' },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 key high-status credentials or achievements.' }
        },
        required: ['summary', 'highlights']
    }
};

export const generateEventDescriptionFunctionDeclaration: FunctionDeclaration = {
    name: 'generateEventDescription',
    description: 'Generates a persuasive, exciting event description optimized for attendance conversion.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            description: {
                type: Type.STRING,
                description: 'The generated event description.'
            }
        },
        required: ['description']
    }
};

export const generateEventTitlesFunctionDeclaration: FunctionDeclaration = {
    name: 'generateEventTitles',
    description: 'Generates 3 catchy, memorable, and distinct event title options.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            titles: {
                type: Type.ARRAY,
                description: 'An array of 3 title strings.',
                items: { type: Type.STRING }
            }
        },
        required: ['titles']
    }
};

export const generateSocialMediaCopyFunctionDeclaration: FunctionDeclaration = {
    name: 'generateSocialMediaCopy',
    description: "Generates platform-optimized promotional copy for Twitter, LinkedIn, and Instagram.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            twitter: { type: Type.STRING, description: 'Concise, hashtag-optimized tweet.' },
            linkedin: { type: Type.STRING, description: 'Professional, value-driven LinkedIn post.' },
            instagram: { type: Type.STRING, description: 'Visual-focused, emoji-rich Instagram caption.' }
        },
        required: ['twitter', 'linkedin', 'instagram']
    }
};

export const suggestVenuesFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestVenues',
    description: 'Suggests specific real-world venues suitable for an event.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            venues: {
                type: Type.ARRAY,
                description: 'List of venue suggestions.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        mapLink: { type: Type.STRING }
                    },
                    required: ['name', 'reason']
                }
            }
        },
        required: ['venues']
    }
};

export const structureAgendaFunctionDeclaration: FunctionDeclaration = {
    name: 'structureAgenda',
    description: 'Organizes unstructured event details into a clear, timed agenda.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            schedule: {
                type: Type.ARRAY,
                description: 'An array of agenda items.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        time: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        speaker: { type: Type.STRING }
                    },
                    required: ['time', 'topic']
                }
            }
        },
        required: ['schedule']
    }
};

export const generateFinancialsFunctionDeclaration: FunctionDeclaration = {
    name: 'generateFinancials',
    description: 'Generates a 3-year financial projection table.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Time periods (e.g., "Year 1", "Year 2").'
            },
            rows: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        values: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['label', 'values']
                }
            },
            summary: { type: Type.STRING, description: 'A brief analysis of the financial trajectory.' }
        },
        required: ['headers', 'rows', 'summary']
    }
};

export const generateBudgetFunctionDeclaration: FunctionDeclaration = {
    name: 'generateBudget',
    description: 'Allocates a budget into realistic line items for an event.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            total: { type: Type.NUMBER },
            perHead: { type: Type.NUMBER },
            items: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        notes: { type: Type.STRING }
                    },
                    required: ['category', 'amount', 'notes']
                }
            }
        },
        required: ['total', 'perHead', 'items']
    }
};

export const generateEmailSequenceFunctionDeclaration: FunctionDeclaration = {
    name: 'generateEmailSequence',
    description: 'Creates a comprehensive 3-email sequence (Invite, Remind, Follow-up) for an event.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            invitation: {
                type: Type.OBJECT,
                properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } },
                required: ['subject', 'body']
            },
            reminder: {
                type: Type.OBJECT,
                properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } },
                required: ['subject', 'body']
            },
            followUp: {
                type: Type.OBJECT,
                properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } },
                required: ['subject', 'body']
            }
        },
        required: ['invitation', 'reminder', 'followUp']
    }
};

export const generateDeckUpdateSuggestionsFunctionDeclaration: FunctionDeclaration = {
    name: 'generateDeckUpdateSuggestions',
    description: 'Identifies discrepancies between website content and a pitch deck, suggesting updates.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            suggestions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        slideTitle: { type: Type.STRING },
                        currentValue: { type: Type.STRING },
                        newValue: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ['slideTitle', 'currentValue', 'newValue', 'reason']
                }
            }
        },
        required: ['suggestions']
    }
};

export const generateSWOTAnalysisFunctionDeclaration: FunctionDeclaration = {
    name: 'generateSWOTAnalysis',
    description: 'Generates a strategic SWOT analysis comparing a company to its competitors.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Headers: ["Competitor", "Strengths", "Weaknesses", "Opportunities", "Threats"]'
            },
            rows: {
                type: Type.ARRAY,
                items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Row data matching the headers.'
                }
            }
        },
        required: ['headers', 'rows']
    }
};

export const analyzeFundingGoalFunctionDeclaration: FunctionDeclaration = {
    name: 'analyzeFundingGoal',
    description: 'Analyzes a funding target to recommend suitable investor classes and strategic next steps.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            investorTypes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of investor categories (e.g., Angel, Seed VC).' },
            strategicAdvice: { type: Type.STRING, description: 'High-level strategy for raising this round.' },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 actionable next steps.' }
        },
        required: ['investorTypes', 'strategicAdvice', 'nextSteps']
    }
};

export const generateOnePagerFunctionDeclaration: FunctionDeclaration = {
    name: 'generateOnePager',
    description: 'Synthesizes startup data into a dense, high-impact One-Pager format.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headline: { type: Type.STRING, description: "A punchy 5-10 word value proposition." },
            problem_summary: { type: Type.STRING, description: "2-3 sentences articulating the pain point." },
            solution_summary: { type: Type.STRING, description: "2-3 sentences explaining the product solution." },
            market_opportunity: { type: Type.STRING, description: "TAM/SAM/SOM narrative with data." },
            traction_highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key quantitative achievements." },
            business_model: { type: Type.STRING, description: "Explanation of monetization strategy." },
            ask: { type: Type.STRING, description: "Funding amount and use of funds." },
            contact_info: { 
                type: Type.OBJECT, 
                properties: { 
                    email: { type: Type.STRING }, 
                    website: { type: Type.STRING } 
                } 
            }
        },
        required: ["headline", "problem_summary", "solution_summary", "market_opportunity", "traction_highlights", "business_model", "ask"]
    }
};

export const generateInvestorUpdateFunctionDeclaration: FunctionDeclaration = {
    name: 'generateInvestorUpdate',
    description: 'Drafts a structured, metric-driven monthly investor update email.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            subject_line: { type: Type.STRING },
            status_emoji: { type: Type.STRING, description: "Green, Yellow, or Red circle." },
            status_summary: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            lowlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            kpi_summary: { type: Type.STRING, description: "Markdown table of metrics." },
            ask: { type: Type.STRING }
        },
        required: ["subject_line", "status_emoji", "status_summary", "highlights", "lowlights", "kpi_summary", "ask"]
    }
};

export const generateInvestmentMemoFunctionDeclaration: FunctionDeclaration = {
    name: 'generateInvestmentMemo',
    description: 'Generates a critical Investment Memo analyzing a startup\'s potential and risks.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            investment_thesis: { type: Type.STRING, description: "Why this startup is a good investment." },
            key_risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 major risks." },
            market_dynamics: { type: Type.STRING, description: "Analysis of market trends and timing." },
            competitor_analysis: { type: Type.STRING, description: "How they stack up against incumbents." },
            team_assessment: { type: Type.STRING, description: "Evaluation of the founding team's fit." },
            verdict_score: { type: Type.NUMBER, description: "0-100 probability of success." },
            verdict_summary: { type: Type.STRING, description: "Final recommendation (Invest/Pass)." }
        },
        required: ["investment_thesis", "key_risks", "market_dynamics", "competitor_analysis", "team_assessment", "verdict_score", "verdict_summary"]
    }
};

export const generateMarketSizingFunctionDeclaration: FunctionDeclaration = {
    name: 'generateMarketSizing',
    description: 'Calculates TAM, SAM, and SOM based on industry data and logic.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            icp: { type: Type.STRING, description: "Ideal Customer Profile." },
            beachhead: { type: Type.STRING, description: "Initial entry market." },
            tam: { 
                type: Type.OBJECT, 
                properties: { value: { type: Type.STRING }, description: { type: Type.STRING }, sourceUrl: { type: Type.STRING } },
                required: ['value', 'description']
            },
            sam: { 
                type: Type.OBJECT, 
                properties: { value: { type: Type.STRING }, description: { type: Type.STRING }, sourceUrl: { type: Type.STRING } },
                required: ['value', 'description']
            },
            som: { 
                type: Type.OBJECT, 
                properties: { value: { type: Type.STRING }, description: { type: Type.STRING }, sourceUrl: { type: Type.STRING } },
                required: ['value', 'description']
            },
            methodology: { type: Type.STRING, description: "Explanation of the bottom-up calculation logic." }
        },
        required: ['icp', 'beachhead', 'tam', 'sam', 'som', 'methodology']
    }
};

export const generateGTMStrategyFunctionDeclaration: FunctionDeclaration = {
    name: 'generateGTMStrategy',
    description: 'Generates a concise Go-To-Market strategy overview.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            strategy_summary: { type: Type.STRING },
            channels: { type: Type.ARRAY, items: { type: Type.STRING } },
            key_metrics: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['strategy_summary', 'channels', 'key_metrics']
    }
};

export const generateFullGTMStrategyFunctionDeclaration: FunctionDeclaration = {
    name: 'generateFullGTMStrategy',
    description: 'Generates a comprehensive, multi-section GTM strategy document.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            executiveSummary: { type: Type.STRING },
            icp: {
                type: Type.OBJECT,
                properties: {
                    personaName: { type: Type.STRING },
                    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    role: { type: Type.STRING }
                },
                required: ['personaName', 'painPoints', 'motivations', 'role']
            },
            valueProposition: {
                type: Type.OBJECT,
                properties: {
                    headline: { type: Type.STRING },
                    benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                    differentiators: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['headline', 'benefits', 'differentiators']
            },
            channels: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['Inbound', 'Outbound', 'Partnership', 'Community'] },
                        tactic: { type: Type.STRING },
                        priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                    },
                    required: ['name', 'type', 'tactic', 'priority']
                }
            },
            pricingStrategy: {
                type: Type.OBJECT,
                properties: {
                    model: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    tiers: { 
                        type: Type.ARRAY, 
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
                required: ['model', 'recommendation', 'tiers']
            },
            launchRoadmap: {
                type: Type.OBJECT,
                properties: {
                    phase1: { 
                        type: Type.OBJECT, 
                        properties: { name: {type: Type.STRING}, duration: {type: Type.STRING}, focus: {type: Type.STRING}, tasks: {type: Type.ARRAY, items: {type: Type.STRING}} },
                        required: ['name', 'duration', 'focus', 'tasks']
                    },
                    phase2: { 
                        type: Type.OBJECT, 
                        properties: { name: {type: Type.STRING}, duration: {type: Type.STRING}, focus: {type: Type.STRING}, tasks: {type: Type.ARRAY, items: {type: Type.STRING}} },
                        required: ['name', 'duration', 'focus', 'tasks']
                    },
                    phase3: { 
                        type: Type.OBJECT, 
                        properties: { name: {type: Type.STRING}, duration: {type: Type.STRING}, focus: {type: Type.STRING}, tasks: {type: Type.ARRAY, items: {type: Type.STRING}} },
                        required: ['name', 'duration', 'focus', 'tasks']
                    }
                },
                required: ['phase1', 'phase2', 'phase3']
            },
            risks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        risk: { type: Type.STRING },
                        mitigation: { type: Type.STRING },
                        severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                    },
                    required: ['risk', 'mitigation', 'severity']
                }
            }
        },
        required: ['executiveSummary', 'icp', 'valueProposition', 'channels', 'pricingStrategy', 'launchRoadmap', 'risks']
    }
};

export const analyzeInvestorFitFunctionDeclaration: FunctionDeclaration = {
    name: 'analyzeInvestorFit',
    description: 'Analyzes the compatibility between a startup and an investor.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            matchScore: { type: Type.NUMBER, description: 'A 0-100 score indicating fit.' },
            status: { type: Type.STRING, description: "'High Fit', 'Potential', or 'Low Fit'." },
            reasoning: { type: Type.STRING, description: 'A concise summary of why this score was given.' },
            alignment: {
                type: Type.OBJECT,
                properties: {
                    stage: { type: Type.BOOLEAN },
                    check_size: { type: Type.BOOLEAN },
                    industry: { type: Type.BOOLEAN },
                    geo: { type: Type.BOOLEAN },
                },
                required: ['stage', 'check_size', 'industry', 'geo']
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of key alignment points.' },
            risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of potential blockers or mismatches.' },
            recommendedAction: { type: Type.STRING, description: 'Specific advice for the founder.' }
        },
        required: ['matchScore', 'status', 'reasoning', 'alignment', 'strengths', 'risks', 'recommendedAction']
    }
};

export const rankInvestorsFunctionDeclaration: FunctionDeclaration = {
    name: 'rankInvestors',
    description: 'Ranks a list of investors based on fit.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            matches: {
                type: Type.ARRAY,
                description: 'The top 5 matched investors.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        investorId: { type: Type.STRING },
                        investorName: { type: Type.STRING },
                        matchScore: { type: Type.NUMBER },
                        reasoning: { type: Type.STRING }
                    },
                    required: ['investorId', 'investorName', 'matchScore', 'reasoning']
                }
            }
        },
        required: ['matches']
    }
};

export const auditDataRoomFunctionDeclaration: FunctionDeclaration = {
    name: 'auditDataRoom',
    description: 'Audits a list of filenames for due diligence readiness.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            found_categories: { type: Type.ARRAY, items: { type: Type.STRING } },
            missing_items: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['score', 'status', 'found_categories', 'missing_items', 'warnings', 'recommendations']
    }
};

export const analyzeStartupStrategyFunctionDeclaration: FunctionDeclaration = {
    name: 'analyzeStartupStrategy',
    description: 'Performs a strategic analysis (SWOT, Investor Readiness) of a startup.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            investorReadinessScore: { type: Type.NUMBER },
            readinessReasoning: { type: Type.STRING },
            swot: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['strengths', 'weaknesses', 'opportunities', 'threats']
            },
            marketTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyCompetitors: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['investorReadinessScore', 'readinessReasoning', 'swot', 'marketTrends', 'keyCompetitors']
    }
};
    
export const enrichStartupProfileFunctionDeclaration: FunctionDeclaration = {
    name: 'enrichStartupProfile',
    description: 'Generates professional startup profile content from a website URL or brief description.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            tagline: { type: Type.STRING, description: "A catchy, one-sentence value proposition (max 120 chars)." },
            description: { type: Type.STRING, description: "A concise 2-3 sentence company description." },
            industry: { type: Type.STRING, description: "The primary industry/sector." },
            mission: { type: Type.STRING, description: "A powerful mission statement." },
        },
        required: ['tagline', 'description', 'industry', 'mission']
    }
};
