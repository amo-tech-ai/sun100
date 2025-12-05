
import { useState, useCallback } from 'react';
import { summarizeBio, extractMetrics } from '../../services/ai/slide';
import { analyzeStartupStrategy, extractStartupMetadata, suggestDeckFocus } from '../../services/ai/investor';
import { BioSummary, ExtractedMetric, StartupStrategicAnalysis, StartupMetadata, DeckStrategy } from '../../services/ai/types';
import { UserProfile } from '../types/founder';

export interface UseFounderAIReturn {
    isSummarizing: boolean;
    summaryAndHighlights: BioSummary | null;
    isExtractingMetrics: boolean;
    extractedMetrics: ExtractedMetric[] | null;
    isAnalyzingStrategy: boolean;
    strategicAnalysis: StartupStrategicAnalysis | null;
    isAnalyzingMetadata: boolean;
    metadataAnalysis: StartupMetadata | null;
    isAnalyzingDeckFocus: boolean;
    deckStrategy: DeckStrategy | null;
    error: string | null;
    handleSummarize: () => Promise<void>;
    handleExtractMetrics: () => Promise<void>;
    handleStrategicAnalysis: () => Promise<void>;
    handleAnalyzeMetadata: () => Promise<void>;
    handleSuggestDeckFocus: () => Promise<void>;
}

export function useFounderAI(profile: UserProfile): UseFounderAIReturn {
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryAndHighlights, setSummaryAndHighlights] = useState<BioSummary | null>(null);

    const [isExtractingMetrics, setIsExtractingMetrics] = useState(false);
    const [extractedMetrics, setExtractedMetrics] = useState<ExtractedMetric[] | null>(null);

    const [isAnalyzingStrategy, setIsAnalyzingStrategy] = useState(false);
    const [strategicAnalysis, setStrategicAnalysis] = useState<StartupStrategicAnalysis | null>(null);

    const [isAnalyzingMetadata, setIsAnalyzingMetadata] = useState(false);
    const [metadataAnalysis, setMetadataAnalysis] = useState<StartupMetadata | null>(null);

    const [isAnalyzingDeckFocus, setIsAnalyzingDeckFocus] = useState(false);
    const [deckStrategy, setDeckStrategy] = useState<DeckStrategy | null>(null);

    const [error, setError] = useState<string | null>(null);

    const handleSummarize = useCallback(async () => {
        if (!profile?.bio) return;
        setIsSummarizing(true);
        setError(null);
        try {
            const result = await summarizeBio(profile.bio);
            setSummaryAndHighlights(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bio summarization failed.");
        } finally {
            setIsSummarizing(false);
        }
    }, [profile?.bio]);

    const handleExtractMetrics = useCallback(async () => {
        if (!profile?.startup) return;
        setIsExtractingMetrics(true);
        setError(null);
        try {
            const textToAnalyze = `
                Tagline: ${profile.startup.tagline}
                Description: ${profile.startup.description}
                Bio: ${profile.bio}
                Traction: ${profile.startup.traction}
                Funding: ${profile.startup.fundingGoal}
            `;
            const { metrics } = await extractMetrics(textToAnalyze);
            setExtractedMetrics(metrics);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Metric extraction failed.");
        } finally {
            setIsExtractingMetrics(false);
        }
    }, [profile?.bio, profile?.startup]);

    const handleStrategicAnalysis = useCallback(async () => {
        if (!profile?.startup) return;
        setIsAnalyzingStrategy(true);
        setError(null);
        try {
            // Detailed context for deeper AI analysis
            const context = `
                Startup Analysis Request:
                Name: ${profile.startup.name}
                Tagline: ${profile.startup.tagline}
                Description: ${profile.startup.description}
                Industry: ${profile.startup.industry}
                Stage: ${profile.startup.stage}
                Traction: ${profile.startup.traction}
                Business Model: ${profile.startup.businessModel}
                Funding Ask: ${profile.startup.fundingGoal}
                Founder Bio: ${profile.bio}
                Current Needs: ${profile.lookingFor?.join(', ') || 'None specified'}
                Website: ${profile.startup.website}
            `;
            const result = await analyzeStartupStrategy(context);
            setStrategicAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Strategic analysis failed.");
        } finally {
            setIsAnalyzingStrategy(false);
        }
    }, [profile]);

    const handleAnalyzeMetadata = useCallback(async () => {
        if (!profile?.startup) return;
        setIsAnalyzingMetadata(true);
        setError(null);
        try {
            const result = await extractStartupMetadata(profile.startup.description, profile.startup.tagline);
            setMetadataAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Metadata analysis failed.");
        } finally {
            setIsAnalyzingMetadata(false);
        }
    }, [profile?.startup]);

    const handleSuggestDeckFocus = useCallback(async () => {
        if (!profile?.startup) return;
        setIsAnalyzingDeckFocus(true);
        setError(null);
        try {
             const context = `
                Startup: ${profile.startup.name}
                Industry: ${profile.startup.industry}
                Stage: ${profile.startup.stage}
                Traction: ${profile.startup.traction}
                Description: ${profile.startup.description}
                Business Model: ${profile.startup.businessModel}
                Founder Bio: ${profile.bio}
             `;
            const result = await suggestDeckFocus(context);
            setDeckStrategy(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Deck focus suggestion failed.");
        } finally {
            setIsAnalyzingDeckFocus(false);
        }
    }, [profile]);

    return {
        isSummarizing,
        summaryAndHighlights,
        isExtractingMetrics,
        extractedMetrics,
        isAnalyzingStrategy,
        strategicAnalysis,
        isAnalyzingMetadata,
        metadataAnalysis,
        isAnalyzingDeckFocus,
        deckStrategy,
        error,
        handleSummarize,
        handleExtractMetrics,
        handleStrategicAnalysis,
        handleAnalyzeMetadata,
        handleSuggestDeckFocus
    };
}
