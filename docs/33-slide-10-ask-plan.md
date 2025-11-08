# Engineering Blueprint: Slide 10 - The Ask Slide

**Document Status:** Production Ready - 2024-08-12
**System Goal:** To implement an AI-powered enhancement for The Ask Slide, enabling users to automatically visualize their funding allocation as a pie chart.

---

### 1. File Impact Analysis

-   **`data/decks.ts`:** `ChartData` type definition will be updated to include a `'pie'` type.
-   **`services/geminiService.ts`:** A new `suggestPieChart` function and its `FunctionDeclaration` will be added.
-   **`screens/DeckEditor.tsx`:** New state and a handler for pie chart generation will be added.
-   **`components/EditorPanel.tsx`:** A new "Suggest Pie Chart" button will be added.
-   **`components/Chart.tsx`:** Will be significantly modified to add rendering logic for pie charts.

---

### 2. Data Model (`data/decks.ts`)

The `ChartData` type will be expanded.

```typescript
// Modify ChartData in data/decks.ts
export type ChartData = 
  | { type: 'bar'; data: { label: string; value: number }[] }
  | { type: 'pie'; data: { label: string; value: number }[] }; // Add pie type
```

---

### 3. Function Declaration & Service Layer (`geminiService.ts`)

```typescript
// Add to geminiService.ts
const suggestPieChartFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestPieChart',
    description: 'Analyzes text for fund allocation percentages and creates data for a pie chart.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            data: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING, description: 'The allocation category (e.g., "Engineering").' },
                        value: { type: Type.NUMBER, description: 'The percentage for the category (e.g., 40 for 40%).' },
                    },
                    required: ['label', 'value'],
                },
            },
        },
        required: ['data'],
    },
};

export const suggestPieChart = async (slideContent: string): Promise<ChartData | null> => {
    try {
        const prompt = `Analyze the text for fund allocation percentages (e.g., "40% to R&D, 30% to Marketing"). Extract this data and call the 'suggestPieChart' function. The total should add up to 100.

        Content: "${slideContent}"`;
        // ... (API call logic similar to suggestChart) ...
        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'suggestPieChart' && functionCall.args?.data) {
            return { type: 'pie', data: functionCall.args.data as { label: string; value: number }[] };
        }
        return null;
    } catch (error) {
        console.error("Error suggesting pie chart:", error);
        throw new Error("Failed to generate a pie chart.");
    }
};
```

---

### 4. UI/UX & State Management

-   **State & Handler in `DeckEditor.tsx`:** A new `handleSuggestPieChart` handler and corresponding state (`isSuggestingPieChart`, `pieChartError`) will be created, mirroring the existing `handleSuggestChart` logic.
-   **UI in `EditorPanel.tsx`:** A new button "Suggest Allocation Chart" will be added. It will be disabled if `chartData` or `tableData` already exist on the slide.

### 5. Pie Chart Rendering (`Chart.tsx`)

To avoid complex SVG path calculations, we will use a modern CSS approach with `conic-gradient`.

```tsx
// Add this new component within Chart.tsx
const PieChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    const colors = ['#E87C4D', '#FBBF77', '#6B7280', '#9CA3AF', '#374151'];
    
    let cumulativePercent = 0;
    const gradientParts = data.map((item, i) => {
        const percent = (item.value / total) * 100;
        const part = `${colors[i % colors.length]} ${cumulativePercent}% ${cumulativePercent + percent}%`;
        cumulativePercent += percent;
        return part;
    });

    const pieStyle = {
        background: `conic-gradient(${gradientParts.join(', ')})`,
    };

    return (
        <div className="w-full h-full flex items-center justify-center gap-8 p-4">
            <div className="w-48 h-48 rounded-full" style={pieStyle}></div>
            <div className="flex flex-col gap-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }}></div>
                        <span className="text-sm font-medium text-gray-700">{item.label} ({item.value}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// In Chart.tsx main component render logic:
if (chartData.type === 'pie') {
    return <PieChart data={chartData.data} />;
}
// ... else render bar chart
```

---

### 6. Data Flow

The data flow is identical to the Bar Chart implementation, but it sets a `chartData` object with `type: 'pie'`.

---

### 7. Production Readiness Checklist

| Category          | Criteria                                                                                                                                                                                | Status |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Code Quality**  | `suggestPieChartFunctionDeclaration` is correct. `Chart.tsx` is cleanly updated to handle both chart types.                                                                             | 🟢      |
| **Data Model**    | `data/decks.ts` is correctly updated to support the `'pie'` chart type.                                                                                                                   | 🟢      |
| **UI/UX**         | The pie chart is clean, readable, and includes a legend. The "Suggest" button has proper loading/error states.                                                                            | 🟢      |
| **Functionality** | E2E flow is tested. The pie chart renders correctly in both the editor and presentation modes. The button is disabled appropriately.                                                        | 🟢      |
| **Accessibility** | The legend provides a text-based alternative to the visual chart.                                                                                                                         | 🟢      |
| **Testing**       | Manual E2E test plan: 1. Verify button shows loading/error. 2. Verify text with percentages is replaced by a pie chart. 3. Verify chart renders correctly in editor & presentation. | 🟢      |