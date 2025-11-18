
// This file now acts as a "facade," re-exporting from the modular services.
// This ensures that any component importing from the old path still works,
// making the refactor a non-breaking change for the UI.

export * from './ai/deck';
export * from './ai/slide';
export * from './ai/image';
export * from './ai/event';
export * from './ai/research';
export * from './ai/prompts';
export * from './ai/types';
