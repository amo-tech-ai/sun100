
import { useState, useCallback } from 'react';
import { summarizeBio, extractMetrics } from '../services/ai/slide';
import { analyzeStartupStrategy, extractStartupMetadata } from '../services/ai/investor';
import { BioSummary, ExtractedMetric, StartupStrategicAnalysis, StartupMetadata } from '../services/ai/types';
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
    error: string | null;
    handleSummarize: () => Promise<void>;
    handleExtractMetrics: () => Promise<void>;
    handleStrategicAnalysis: () => Promise<void>;
    handleAnalyzeMetadata: () => Promise<void>;
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

    const [error, setError] = useState<string | null>(null);

    const handleSummarize = useCallback(async () => {
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
    }, [profile.bio]);

    const handleExtractMetrics = useCallback(async () => {
        setIsExtractingMetrics(true);
        setError(null);
        try {
            const textToAnalyze = `${profile.startup.tagline} ${profile.bio} ${profile.startup.traction}`;
            const { metrics } = await extractMetrics(textToAnalyze);
            setExtractedMetrics(metrics);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Metric extraction failed.");
        } finally {
            setIsExtractingMetrics(false);
        }
    }, [profile.bio, profile.startup.tagline, profile.startup.traction]);

    const handleStrategicAnalysis = useCallback(async () => {
        setIsAnalyzingStrategy(true);
        setError(null);
        try {
            const context = `Startup: ${profile.startup.name}. Industry: ${profile.startup.industry}. Stage: ${profile.startup.stage}. Traction: ${profile.startup.traction}. Tagline: ${profile.startup.tagline}. Founder Bio: ${profile.bio}`;
            const result = await analyzeStartupStrategy(context);
            setStrategicAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Strategic analysis failed.");
        } finally {
            setIsAnalyzingStrategy(false);
        }
    }, [profile]);

    const handleAnalyzeMetadata = useCallback(async () => {
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
    }, [profile.startup.description, profile.startup.tagline]);

    return {
        isSummarizing,
        summaryAndHighlights,
        isExtractingMetrics,
        extractedMetrics,
        isAnalyzingStrategy,
        strategicAnalysis,
        isAnalyzingMetadata,
        metadataAnalysis,
        error,
        handleSummarize,
        handleExtractMetrics,
        handleStrategicAnalysis,
        handleAnalyzeMetadata
    };
}