# Components - React UI Components

> **Component library:** Reusable UI components, shared components, and domain-specific components.

---

## 🎯 Component Principles

### Functional Components Only
- **No class components** - Use functional components with hooks
- **Named exports preferred** - `export function Button()` not `export default`
- **One component per file** - Unless tightly coupled utility components
- **Props interface at top** - Define types before component

### Composition Over Configuration
- **Small, focused components** - Single responsibility
- **Compose larger components** - From smaller ones
- **Use children prop** - For flexible layouts
- **Avoid prop drilling** - Use Context for deep data

---

## 📁 Component Organization

```
components/
├── ui/              # Base UI components (Button, Input, Modal)
├── common/          # Shared components (Header, Sidebar, Footer)
├── dashboard/       # Dashboard-specific components
├── investor/        # Investor docs components
├── crm/            # CRM components
└── [feature]/      # Feature-specific components
```

---

## 🧩 Component Structure Pattern

### Standard Component Template
```typescript
// components/DeckCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Props interface (always define first)
interface DeckCardProps {
  deck: Deck;
  onDelete?: (id: string) => void;
  className?: string;
}

// Component function
export function DeckCard({ deck, onDelete, className = '' }: DeckCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/pitch-decks/${deck.id}/edit`);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(deck.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
      <p className="text-gray-600 mb-4">{deck.slides.length} slides</p>
      
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 🎨 UI Component Patterns

### Base UI Components (`components/ui/`)

#### Button Component
```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  isLoading = false, 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50';
  const variantStyles = {
    primary: 'bg-brand-blue text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
```

#### Input Component
```typescript
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
```

---

## 🔧 Common Component Patterns

### 1. **Loading States**
```typescript
export function DataList() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <p>Error: {error}</p>
        <button onClick={loadItems} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-gray-500 text-center py-8">No items found</div>;
  }

  return (
    <div className="grid gap-4">
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### 2. **Form Handling**
```typescript
export function DeckForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deckType: 'seed'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createDeck(formData);
      showToast('Deck created successfully!', 'success');
      navigate('/pitch-decks');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        required
      />
      <Button type="submit" isLoading={isSubmitting}>
        Create Deck
      </Button>
    </form>
  );
}
```

### 3. **Modal/Dialog Pattern**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

### 4. **List with Empty State**
```typescript
interface ItemListProps {
  items: Item[];
  onItemClick?: (item: Item) => void;
  emptyMessage?: string;
}

export function ItemList({ 
  items, 
  onItemClick, 
  emptyMessage = 'No items found' 
}: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        <Button onClick={() => navigate('/create')}>
          Create First Item
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map(item => (
        <div
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🪝 Custom Hooks

### When to Create a Custom Hook
- **Reusable logic** - Used in multiple components
- **Complex state management** - Multiple useState/useEffect
- **External data fetching** - API calls, subscriptions

### Custom Hook Pattern
```typescript
// hooks/useDeckEditor.ts
export function useDeckEditor(deckId: string) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  const loadDeck = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDeckById(deckId);
      setDeck(data);
      if (data.slides.length > 0) {
        setSelectedSlide(data.slides[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSlide = useCallback((slideId: string, updates: Partial<Slide>) => {
    setDeck(prev => {
      if (!prev) return null;
      return {
        ...prev,
        slides: prev.slides.map(s => 
          s.id === slideId ? { ...s, ...updates } : s
        )
      };
    });
  }, []);

  return { 
    deck, 
    selectedSlide, 
    setSelectedSlide, 
    updateSlide, 
    isLoading, 
    error,
    refresh: loadDeck
  };
}
```

---

## 🎨 Styling Best Practices

### Tailwind CSS Usage
```typescript
// ✅ GOOD - Responsive, mobile-first
<div className="
  px-4 py-6           /* Base mobile styles */
  md:px-8 md:py-10   /* Tablet */
  lg:px-12 lg:py-16  /* Desktop */
  bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
">
  Content
</div>

// ✅ GOOD - Using design tokens
<button className="bg-brand-blue text-white hover:bg-blue-700">
  Submit
</button>

// ❌ BAD - Inline styles
<div style={{ padding: '24px', background: '#1E293B' }}>
  Content
</div>
```

### Conditional Classes
```typescript
// ✅ GOOD - Using template literals
<div className={`
  px-4 py-2 rounded
  ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
`}>
  {children}
</div>

// ✅ GOOD - Using classnames utility (if installed)
import classNames from 'classnames';

<div className={classNames(
  'px-4 py-2 rounded',
  {
    'bg-blue-500 text-white': isActive,
    'bg-gray-200 text-gray-800': !isActive,
    'opacity-50 cursor-not-allowed': isDisabled
  }
)}>
  {children}
</div>
```

---

## ♿ Accessibility

### Keyboard Navigation
```typescript
export function KeyboardAccessibleCard({ item, onClick }: Props) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(item);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyPress={handleKeyPress}
      className="p-4 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue"
    >
      {item.title}
    </div>
  );
}
```

### ARIA Labels
```typescript
// ✅ GOOD - ARIA labels for icon buttons
<button
  aria-label="Delete deck"
  onClick={handleDelete}
  className="text-red-500 hover:text-red-700"
>
  <TrashIcon />
</button>

// ✅ GOOD - ARIA labels for dynamic content
<div role="alert" aria-live="polite">
  {error && <p>{error}</p>}
</div>
```

---

## 🚨 Error Boundaries

### Error Boundary Component
```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## 💡 Best Practices

1. **Always define props interface** - TypeScript types at top of file
2. **Use functional components** - No class components
3. **Prefer named exports** - Easier to track usage
4. **Keep components small** - Single responsibility
5. **Extract custom hooks** - For reusable logic
6. **Handle loading/error states** - Always provide user feedback
7. **Use semantic HTML** - `<button>`, `<nav>`, `<main>`, etc.
8. **Add ARIA labels** - For accessibility
9. **Use Tailwind classes** - Avoid inline styles
10. **Test with browser tools** - `@browser` for UI testing

---

## 🧪 Component Testing Checklist

- [ ] Component renders without errors
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Empty states show appropriate message
- [ ] User interactions trigger expected behavior
- [ ] Form validation works
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: ARIA labels present
- [ ] Responsive design: mobile, tablet, desktop
- [ ] Hover states and transitions work

---

**Remember:** Components are the UI building blocks. Keep them simple, reusable, accessible, and well-typed. Let services handle the business logic.
