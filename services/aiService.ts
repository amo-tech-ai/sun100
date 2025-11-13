// This file now acts as a "facade" for the AI services.
// It re-exports all the functions from the smaller, domain-specific modules.
// This allows us to refactor the service layer internally without having to
// change any import paths in the UI components (e.g., DeckEditor, EventWizard).

export * from './ai/deck';
export * from './ai/slide';
export * from './ai/image';
export * from './ai/event';
export * from './ai/research';
export * from './ai/types';