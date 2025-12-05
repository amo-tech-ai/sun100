# Screens - Page-Level Components

> **Screen components:** Top-level page components that map to routes. Compose smaller components and orchestrate business logic.

---

## 🎯 Screen Component Principles

### Page-Level Orchestration
- **Screens are route endpoints** - One screen = one route
- **Compose smaller components** - Don't write all logic in screen
- **Fetch data at screen level** - Pass down to child components
- **Handle routing** - Navigation, redirects, query params

### Clear Responsibility
- **Screen handles:** Data fetching, routing, layout structure
- **Components handle:** UI rendering, user interactions
- **Services handle:** API calls, business logic

---

## 📁 Screen Organization

### Screen File Pattern
```typescript
// screens/PitchDecks.tsx - List view
// screens/DeckEditor.tsx - Edit view
// screens/PresentationScreen.tsx - Present view
```

### Naming Conventions
- **Descriptive names** - `PitchDecks`, `DeckEditor`, `Dashboard`
- **Not generic** - Avoid `Home`, `Main`, `Page1`
- **Match route** - `/pitch-decks` → `PitchDecks.tsx`

---

## 🧩 Standard Screen Structure

### Basic Screen Template
```typescript
// screens/PitchDecks.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeckCard } from '@/components/DeckCard';
import { getDecks, deleteDeck } from '@/services/deckService';
import { useToast } from '@/contexts/ToastContext';

export function PitchDecks() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State management
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetching
  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDecks();
      setDecks(data);
    } catch (err: any) {
      setError(err.message);
      showToast('Failed to load decks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers
  const handleCreateNew = () => {
    navigate('/pitch-decks/new');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDeck(id);
      setDecks(prev => prev.filter(d => d.id !== id));
      showToast('Deck deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  // Render states
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading pitch decks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button onClick={loadDecks} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pitch Decks</h1>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-blue-700"
        >
          Create New Deck
        </button>
      </div>

      {/* Empty state */}
      {decks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No pitch decks yet</p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-blue-700"
          >
            Create Your First Deck
          </button>
        </div>
      ) : (
        /* Deck list */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Common Screen Patterns

### 1. **List View Screen (Index)**
```typescript
// screens/PitchDecks.tsx
export function PitchDecks() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Title</h1>
        <button onClick={handleCreate}>Create New</button>
      </header>

      {isLoading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState onCreateClick={handleCreate} />
      ) : (
        <ItemGrid items={items} onDelete={handleDelete} />
      )}
    </div>
  );
}
```

### 2. **Detail/Edit View Screen**
```typescript
// screens/DeckEditor.tsx
export function DeckEditor() {
  const { id } = useParams();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDeck(id);
    }
  }, [id]);

  const loadDeck = async (deckId: string) => {
    setIsLoading(true);
    try {
      const data = await getDeckById(deckId);
      setDeck(data);
      setSelectedSlide(data.slides[0] || null);
    } catch (error: any) {
      showToast(error.message, 'error');
      navigate('/pitch-decks');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (!deck) return <NotFoundState />;

  return (
    <div className="flex h-screen">
      <Sidebar slides={deck.slides} onSelectSlide={setSelectedSlide} />
      <EditorPanel slide={selectedSlide} onUpdate={handleUpdate} />
      <RightSidebar slide={selectedSlide} />
    </div>
  );
}
```

### 3. **Wizard/Multi-Step Screen**
```typescript
// screens/WizardSteps.tsx
export function WizardSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WizardData>({});

  const steps = [
    <Step1 data={formData} onNext={handleNext} />,
    <Step2 data={formData} onNext={handleNext} onBack={handleBack} />,
    <Step3 data={formData} onSubmit={handleSubmit} onBack={handleBack} />
  ];

  const handleNext = (stepData: Partial<WizardData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (finalData: Partial<WizardData>) => {
    const completeData = { ...formData, ...finalData };
    try {
      await processWizard(completeData);
      navigate('/success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['Step 1', 'Step 2', 'Step 3'].map((label, i) => (
            <div
              key={i}
              className={`flex-1 text-center ${
                i <= currentStep ? 'text-brand-blue' : 'text-gray-400'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Current step */}
      {steps[currentStep]}
    </div>
  );
}
```

### 4. **Dashboard Screen**
```typescript
// screens/Dashboard.tsx
export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (!stats) return <ErrorState />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Decks" value={stats.totalDecks} />
        <KPICard title="Active Users" value={stats.activeUsers} />
        <KPICard title="Revenue" value={`$${stats.revenue}`} />
        <KPICard title="Churn Rate" value={`${stats.churnRate}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats.revenueData} />
        <UserGrowthChart data={stats.userGrowthData} />
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ActivityFeed items={stats.recentActivity} />
      </div>
    </div>
  );
}
```

---

## 🗺️ Routing Patterns

### Route Parameters
```typescript
// Route: /pitch-decks/:id/edit
export function DeckEditor() {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    if (id) {
      loadDeck(id);
    }
  }, [id]);
}
```

### Query Parameters
```typescript
// Route: /pitch-decks?filter=seed&sort=date
import { useSearchParams } from 'react-router-dom';

export function PitchDecks() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filter = searchParams.get('filter') || 'all';
  const sort = searchParams.get('sort') || 'date';

  const handleFilterChange = (newFilter: string) => {
    setSearchParams({ filter: newFilter, sort });
  };
}
```

### Programmatic Navigation
```typescript
import { useNavigate } from 'react-router-dom';

export function LoginScreen() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(credentials);
      navigate('/dashboard'); // Redirect after login
    } catch (error) {
      showToast('Login failed', 'error');
    }
  };
}
```

---

## 🔐 Protected Screens

### Authentication Check
```typescript
// screens/Dashboard.tsx
import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <LoadingState />;
  if (!user) return null; // Will redirect

  return <div>Dashboard content...</div>;
}
```

### Using ProtectedRoute Wrapper
```typescript
// App.tsx - Better approach
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🎨 Layout Patterns

### Dashboard Layout
```typescript
// screens/DashboardLayout.tsx
export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6">
          <Outlet /> {/* Child routes render here */}
        </div>
      </main>
    </div>
  );
}
```

### Public Layout
```typescript
// screens/PublicLayout.tsx
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-brand-off-white">
      <Header />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  );
}
```

---

## 📊 Data Fetching Patterns

### Fetch on Mount
```typescript
export function Screen() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    loadData();
  }, []); // Empty deps = run once on mount

  const loadData = async () => {
    const result = await fetchData();
    setData(result);
  };
}
```

### Fetch on Param Change
```typescript
export function Screen() {
  const { id } = useParams();
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]); // Re-run when id changes
}
```

### Polling/Auto-refresh
```typescript
export function Screen() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    loadData(); // Initial load

    const interval = setInterval(loadData, 30000); // Refresh every 30s
    
    return () => clearInterval(interval); // Cleanup
  }, []);
}
```

---

## 🚨 Error Handling

### Screen-Level Error Handling
```typescript
export function Screen() {
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setError(null);
    try {
      const data = await fetchData();
      setData(data);
    } catch (err: any) {
      setError(err.message);
      showToast('Failed to load data', 'error');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading Page
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-blue-500 text-white rounded">
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
```

---

## 💡 Best Practices

1. **One screen = one route** - Clear mapping
2. **Fetch data at screen level** - Pass to components
3. **Use layout components** - DashboardLayout, PublicLayout
4. **Handle loading states** - Always show feedback
5. **Handle error states** - User-friendly messages
6. **Handle empty states** - "Create first item" prompts
7. **Use route params** - For dynamic routes
8. **Use query params** - For filters, sorting
9. **Protect routes** - Authentication checks
10. **Compose smaller components** - Don't write everything in screen

---

## 🧪 Screen Testing Checklist

- [ ] Screen renders without errors
- [ ] Data loads correctly on mount
- [ ] Loading state displays while fetching
- [ ] Error state shows on failure
- [ ] Empty state shows when no data
- [ ] Navigation works (links, buttons)
- [ ] Route params handled correctly
- [ ] Query params handled correctly
- [ ] Authentication enforced (if protected)
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] User interactions trigger expected behavior
- [ ] Browser back/forward work correctly

---

## 📝 Screen Documentation

### Add Comments for Complex Screens
```typescript
/**
 * DeckEditor - Main pitch deck editing screen
 * 
 * Features:
 * - Slide outline (left sidebar)
 * - Content editor (center panel)
 * - AI tools (right sidebar)
 * 
 * State Management:
 * - Deck data from session storage
 * - Auto-save on changes
 * - Sync with Supabase on manual save
 */
export function DeckEditor() {
  // ...
}
```

---

**Remember:** Screens orchestrate the page. They fetch data, handle routing, manage layout, and compose smaller components. Keep business logic in services, UI logic in components.
