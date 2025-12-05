# Services - Business Logic & API Layer

> **Service layer:** All API calls, business logic, and data transformations. Components should NEVER call APIs directly.

---

## 🎯 Service Layer Principles

### Single Responsibility
- **One service per domain** - `deckService.ts`, `crmService.ts`, `vcService.ts`
- **Clear boundaries** - Don't mix concerns (e.g., don't put CRM logic in deck service)
- **Reusable functions** - Services used by multiple components

### Type Safety
- **All functions return typed data** - Use interfaces, not `any`
- **Validate responses** - Check structure before returning
- **Throw typed errors** - Use custom error classes if needed

---

## 📁 Service Structure

### Standard Service File Pattern
```typescript
// services/deckService.ts
import { supabase } from '@/lib/supabaseClient';
import { callEdgeFunction } from './edgeFunctionService';

// Types/Interfaces (or import from types file)
export interface Deck {
  id: string;
  title: string;
  slides: Slide[];
  organization_id: string;
  created_at: string;
}

export interface DeckParams {
  businessContext: string;
  deckType: 'seed' | 'series-a' | 'series-b';
  theme: string;
  companyDetails: CompanyDetails;
  financials: Financials;
}

// Service Functions
export async function getDecks(): Promise<Deck[]> {
  try {
    const { data, error } = await supabase
      .from('pitch_decks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Failed to fetch decks:', error);
    throw new Error('Could not load pitch decks');
  }
}

export async function generateDeck(params: DeckParams): Promise<Deck> {
  try {
    const result = await callEdgeFunction('generate-deck', params);
    if (!result.data) {
      throw new Error('No deck data returned');
    }
    return result.data as Deck;
  } catch (error: any) {
    console.error('Deck generation failed:', error);
    throw new Error('Failed to generate deck. Please try again.');
  }
}

export async function deleteDeck(deckId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('pitch_decks')
      .delete()
      .eq('id', deckId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Failed to delete deck:', error);
    throw new Error('Could not delete deck');
  }
}
```

---

## 🔧 Service Patterns

### 1. **Fetch Data (GET)**
```typescript
export async function getItems(): Promise<Item[]> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Fetch failed:', error);
    throw new Error('Could not load items');
  }
}
```

### 2. **Fetch Single Item (GET by ID)**
```typescript
export async function getItemById(id: string): Promise<Item | null> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    console.error('Fetch failed:', error);
    throw new Error('Could not load item');
  }
}
```

### 3. **Create Item (POST)**
```typescript
export async function createItem(item: Omit<Item, 'id' | 'created_at'>): Promise<Item> {
  try {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');
    return data;
  } catch (error: any) {
    console.error('Create failed:', error);
    throw new Error('Could not create item');
  }
}
```

### 4. **Update Item (PATCH)**
```typescript
export async function updateItem(id: string, updates: Partial<Item>): Promise<Item> {
  try {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Item not found');
    return data;
  } catch (error: any) {
    console.error('Update failed:', error);
    throw new Error('Could not update item');
  }
}
```

### 5. **Delete Item (DELETE)**
```typescript
export async function deleteItem(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Delete failed:', error);
    throw new Error('Could not delete item');
  }
}
```

### 6. **Call Edge Function (AI Operation)**
```typescript
export async function processWithAI(input: string): Promise<AIResult> {
  try {
    const result = await callEdgeFunction('ai-function-name', { input });
    
    if (!result.data) {
      throw new Error('No data returned from AI');
    }

    // Validate response structure
    if (!result.data.output) {
      throw new Error('Invalid AI response format');
    }

    return result.data as AIResult;
  } catch (error: any) {
    console.error('AI processing failed:', error);
    throw new Error('AI operation failed. Please try again.');
  }
}
```

---

## 🤖 AI Service Patterns (`services/ai/`)

### Standard AI Service Structure
```typescript
// services/ai/deck.ts
import { callEdgeFunction } from '../edgeFunctionService';

export interface GenerateDeckParams {
  businessContext: string;
  deckType: string;
  theme: string;
}

export interface DeckGenerationResult {
  deck: Deck;
  metadata: {
    model: string;
    duration: number;
  };
}

export async function generateFullDeck(params: GenerateDeckParams): Promise<DeckGenerationResult> {
  try {
    // Validate inputs
    if (!params.businessContext || params.businessContext.trim().length === 0) {
      throw new Error('Business context is required');
    }

    // Call Edge Function
    const result = await callEdgeFunction('generate-deck', params);

    // Validate response
    if (!result.data || !result.data.deck) {
      throw new Error('Invalid deck generation response');
    }

    return result.data as DeckGenerationResult;
  } catch (error: any) {
    console.error('Deck generation failed:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('API key')) {
      throw new Error('AI service configuration error. Please contact support.');
    }
    if (error.message.includes('timeout')) {
      throw new Error('Deck generation timed out. Please try again.');
    }
    
    throw new Error('Failed to generate deck. Please try again.');
  }
}
```

### Market Research Services (New)
```typescript
// services/ai/slide.ts - Market research functions
export async function generateMarketData(
  industry: string, 
  location: string
): Promise<{ tam: string; sam: string; som: string; sources: string[]; summary: string }> {
  try {
    const result = await callEdgeFunction('slide-ai', {
      action: 'generateMarketData',
      industry,
      location
    });
    
    if (!result.data) {
      throw new Error('No market data returned');
    }
    
    return result.data;
  } catch (error: any) {
    console.error('Market data generation failed:', error);
    throw new Error('Failed to generate market data. Please try again.');
  }
}

export async function generateTrends(
  industry: string
): Promise<{ trends: string[]; narrative: string }> {
  try {
    const result = await callEdgeFunction('slide-ai', {
      action: 'generateTrends',
      industry
    });
    
    if (!result.data) {
      throw new Error('No trends data returned');
    }
    
    return result.data;
  } catch (error: any) {
    console.error('Trends generation failed:', error);
    throw new Error('Failed to generate trends. Please try again.');
  }
}

export async function generateCompetitorMatrix(
  context: string
): Promise<CompetitorMatrix> {
  try {
    const result = await callEdgeFunction('slide-ai', {
      action: 'generateCompetitorMatrix',
      context
    });
    
    if (!result.data) {
      throw new Error('No competitor matrix returned');
    }
    
    return result.data;
  } catch (error: any) {
    console.error('Competitor matrix generation failed:', error);
    throw new Error('Failed to generate competitor matrix. Please try again.');
  }
}
```

---

## 🔄 Component Usage Pattern

### How Components Should Use Services
```typescript
// ✅ GOOD - Component using service
import { generateDeck } from '@/services/deckService';

function DeckGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const deck = await generateDeck(formData);
      navigate(`/pitch-decks/${deck.id}/edit`);
      showToast('Deck generated successfully!', 'success');
    } catch (error: any) {
      setError(error.message);
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Deck'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### ❌ NEVER Do This in Components
```typescript
// ❌ BAD - Component calling API directly
function DeckGenerator() {
  const handleGenerate = async () => {
    const response = await fetch('/api/generate-deck', {...});
    const data = await response.json();
    // No error handling, no typing, no reusability
  };
}

// ❌ BAD - Component calling Supabase directly
function DeckList() {
  const [decks, setDecks] = useState([]);
  
  useEffect(() => {
    supabase.from('pitch_decks').select('*').then(res => setDecks(res.data));
    // No error handling, no typing, logic duplicated across components
  }, []);
}
```

---

## 🚨 Error Handling Best Practices

### User-Friendly Error Messages
```typescript
// ✅ GOOD - Specific, actionable error messages
try {
  await saveData(data);
} catch (error: any) {
  if (error.message.includes('network')) {
    throw new Error('Network error. Please check your internet connection.');
  }
  if (error.message.includes('unauthorized')) {
    throw new Error('Your session has expired. Please log in again.');
  }
  if (error.message.includes('validation')) {
    throw new Error('Please check your input and try again.');
  }
  throw new Error('Something went wrong. Please try again.');
}

// ❌ BAD - Generic, unhelpful errors
try {
  await saveData(data);
} catch (error) {
  throw error; // Don't expose technical errors to users
}
```

### Logging for Debugging
```typescript
// ✅ GOOD - Log details for debugging, throw user-friendly message
export async function processData(input: string): Promise<Result> {
  try {
    const result = await apiCall(input);
    return result;
  } catch (error: any) {
    // Log full error for developers
    console.error('processData failed:', {
      input,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Throw user-friendly message
    throw new Error('Failed to process data. Please try again.');
  }
}
```

---

## 📊 Service Organization

### Current Service Files
```
services/
├── ai/                      # AI-specific services
│   ├── deck.ts             # Deck generation, modification
│   ├── slide.ts            # Slide analysis, content modification, market research
│   ├── image.ts            # Image generation
│   └── research.ts         # Research queries
├── deckService.ts          # Pitch deck CRUD operations
├── crmService.ts           # CRM operations (leads, contacts, etc.)
├── vcService.ts            # VC directory operations
├── investorService.ts      # Investor docs operations
├── authService.ts          # Authentication helpers
├── edgeFunctionService.ts  # Generic Edge Function caller
└── storageService.ts       # Supabase Storage operations
```

### When to Create a New Service File
- **New domain area** - CRM, events, billing, etc.
- **Related operations** - All user-related operations in `userService.ts`
- **Separation of concerns** - Don't mix AI logic with database CRUD

---

## 🔐 Authentication in Services

### Check User Session
```typescript
import { supabase } from '@/lib/supabaseClient';

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function checkAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}
```

### Protected Service Operations
```typescript
export async function createDeck(params: DeckParams): Promise<Deck> {
  // Verify user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to create a deck');
  }

  // Proceed with operation
  const { data, error } = await supabase
    .from('pitch_decks')
    .insert({
      ...params,
      user_id: user.id,
      organization_id: user.user_metadata.organization_id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## 💡 Best Practices

1. **Always return typed data** - Use interfaces, not `any`
2. **Validate inputs** - Check required fields before API calls
3. **Handle all error cases** - Network, validation, auth, etc.
4. **Log errors for debugging** - `console.error()` with context
5. **Throw user-friendly messages** - Don't expose technical details
6. **Keep functions focused** - One function = one responsibility
7. **Reuse logic** - Don't duplicate API calls across services
8. **Test with edge cases** - Empty data, null values, errors
9. **Document complex logic** - Add JSDoc comments
10. **Use consistent naming** - `getItems()`, `createItem()`, `updateItem()`, `deleteItem()`

---

## 🧪 Testing Services

### Manual Testing Pattern
```typescript
// Test in browser console or component
import { generateDeck } from '@/services/deckService';

const testParams = {
  businessContext: 'AI startup',
  deckType: 'seed',
  theme: 'modern'
};

generateDeck(testParams)
  .then(deck => console.log('Success:', deck))
  .catch(error => console.error('Error:', error));
```

### Service Testing Checklist
- [ ] Test with valid inputs
- [ ] Test with invalid/missing inputs
- [ ] Test error handling (network failure, API error)
- [ ] Test authentication requirements
- [ ] Test response validation
- [ ] Verify user-friendly error messages

---

**Remember:** Services are the bridge between UI and backend. Keep them clean, typed, and well-tested. Components should NEVER know about Supabase or Edge Functions - that's the service layer's job.
