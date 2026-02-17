# ALE -- Frontend Developer Specification (React + TypeScript + Copilot)

## 1. Purpose

This document defines **frontend developer specifications**, **component architecture**, **state management patterns**, and **Copilot prompt templates** for building the ALE application using **React + TypeScript**.

The goal is to ensure:
- Consistent component architecture across all modules
- Type-safe development with TypeScript
- Reusable UI components and patterns
- Predictable state management
- Seamless integration with backend APIs
- Production-ready, maintainable frontend code

---

## 2. Technology Stack (MANDATORY)

### 2.1 Core Technologies

**Framework & Language**
- React 18.x
- TypeScript 5.x
- Vite (build tool and dev server)

**State Management**
- React Query (TanStack Query) v5 - Server state
- Zustand - Client state
- React Hook Form - Form state

**UI Framework & Styling**
- Tailwind CSS 3.x - Utility-first styling
- shadcn/ui - Component library
- Lucide React - Icons
- Radix UI - Headless components

**Data Fetching & API**
- Axios - HTTP client
- React Query - Caching, synchronization

**Routing**
- React Router v6

**Utilities**
- date-fns - Date manipulation
- zod - Schema validation
- clsx / tailwind-merge - Class merging

**Development Tools**
- ESLint - Code linting
- Prettier - Code formatting
- Vitest - Unit testing
- React Testing Library - Component testing
- MSW (Mock Service Worker) - API mocking

### 2.2 Project Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── Router.tsx
│   └── providers/
│       ├── QueryProvider.tsx
│       ├── AuthProvider.tsx
│       └── ThemeProvider.tsx
├── features/
│   ├── document-tracker/
│   │   ├── api/
│   │   │   ├── documentTrackerApi.ts
│   │   │   └── types.ts
│   │   ├── components/
│   │   │   ├── DocumentTrackerFilters.tsx
│   │   │   ├── DocumentTrackerGrid.tsx
│   │   │   └── DocumentDetailsPage.tsx
│   │   ├── hooks/
│   │   │   ├── useDocumentSearch.ts
│   │   │   └── useDocumentDetails.ts
│   │   ├── store/
│   │   │   └── documentTrackerStore.ts
│   │   └── utils/
│   │       └── documentHelpers.ts
│   ├── capital-call/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── utils/
│   └── alternative-data/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       └── utils/
├── components/
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── common/
│   │   ├── DataGrid/
│   │   │   ├── DataGrid.tsx
│   │   │   ├── types.ts
│   │   │   └── hooks.ts
│   │   ├── FilterContainer/
│   │   ├── Pagination/
│   │   ├── ExportButton/
│   │   └── LoadingSpinner/
│   └── layout/
│       ├── AppLayout.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── interceptors.ts
│   │   └── types.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── constants/
│       ├── routes.ts
│       ├── apiEndpoints.ts
│       └── permissions.ts
├── hooks/
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── types/
│   ├── api.ts
│   ├── auth.ts
│   └── common.ts
└── styles/
    └── globals.css
```

### 2.3 Design System & Color Rules

**Primary Color Palette**
- Primary Brand Color: `#0a7a82` (Teal)
  - Used for: Header, primary buttons, active nav items, links
  - Light variant: `#0d9ba6`
  - Dark variant: `#084d52`
- Secondary Color: `#f59e0b` (Amber)
  - Used for: Warnings, secondary actions, accents
- Success: `#16a34a` (Green)
  - Status indicators, success messages
- Error: `#dc2626` (Red)
  - Error states, validation errors
- Warning: `#f59e0b` (Amber)
  - Warning messages
- Info: `#3b82f6` (Blue)
  - Informational messages

**Layout Architecture**
- Navigation: Left sidebar drawer (toggleable on mobile, always visible on desktop)
- Header: Minimal design with menu toggle and user controls
- Primary color (`#0a7a82`) used for header background and sidebar
- All primary action buttons use the primary color

**Color Implementation Rules**
```javascript
// tailwind.config.js - Primary colors
{
  colors: {
    primary: '#0a7a82',
    'primary-light': '#0d9ba6',
    'primary-dark': '#084d52',
    // ... other colors
  }
}
```

```css
/* globals.css - CSS Variables */
:root {
  --color-primary: #0a7a82;
  --color-primary-light: #0d9ba6;
  --color-primary-dark: #084d52;
  /* ... other variables */
}
```

**Button Styling Rules**
- Primary buttons: `bg-primary text-white hover:bg-primary-dark`
- Secondary buttons: `bg-secondary text-white hover:bg-yellow-600`
- Outline buttons: `border border-primary text-primary hover:bg-primary/10`
- Use consistent padding and border-radius

**Navigation & Layout Rules**
- Left drawer sidebar: Fixed width (w-64), primary color background (#0a7a82)
- Sidebar menu items: White text with hover state (primary-light background)
- Active menu item: Highlighted with primary-light background
- Mobile: Sidebar slides in with backdrop overlay, toggle via header menu button
- Desktop: Sidebar always visible (md: and above)
- Header stays sticky at top with shadow

---

## 3. Core Architecture Patterns

### 3.1 Component Architecture

**Component Types**

1. **Feature Components** (Smart Components)
   - Located in `features/{module}/components/`
   - Contain business logic
   - Connect to API and state
   - Handle user interactions

2. **UI Components** (Presentational Components)
   - Located in `components/ui/`
   - Pure, reusable components
   - No business logic
   - Accept props only

3. **Common Components**
   - Located in `components/common/`
   - Shared across features
   - Configurable via props
   - Examples: DataGrid, FilterContainer, Pagination

**Component Pattern**
```typescript
// Feature Component
interface DocumentTrackerFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  initialFilters?: SearchFilters;
}

export const DocumentTrackerFilters: React.FC<DocumentTrackerFiltersProps> = ({
  onSearch,
  onReset,
  initialFilters
}) => {
  // Business logic
  // API calls
  // State management
  
  return (
    // JSX
  );
};

// UI Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

### 3.2 TypeScript Standards

**Type Definitions**

```typescript
// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  errorCode: string;
  message: string;
  path: string;
  correlationId: string;
}

// Search Types
export interface SearchRequest {
  filters: Record<string, any>;
  pagination: {
    page: number;
    size: number;
  };
  sort: Array<{
    field: string;
    direction: 'ASC' | 'DESC';
  }>;
}

// Feature-Specific Types
export interface DocumentTracker {
  id: number;
  genId: string;
  documentType: string;
  receivedAt: string;
  status: SubIdStatus;
  severity: Severity;
}

export enum SubIdStatus {
  PROCESS_FAILED = 'PROCESS_FAILED',
  PROCESS_COMPLETED = 'PROCESS_COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export enum Severity {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  INFO = 'INFO'
}
```

**Type Safety Rules**
- ✅ Always define interfaces for props
- ✅ Use enums for fixed values
- ✅ Use strict TypeScript (`strict: true`)
- ✅ Avoid `any` - use `unknown` if type is truly unknown
- ✅ Use utility types (Partial, Pick, Omit, etc.)
- ❌ Never use `@ts-ignore` without justification

### 3.3 State Management Strategy

**Server State (React Query)**
```typescript
// hooks/useDocumentSearch.ts
export const useDocumentSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchRequest>({
    filters: {},
    pagination: { page: 0, size: 25 },
    sort: []
  });

  const query = useQuery({
    queryKey: ['documents', searchParams],
    queryFn: () => documentApi.search(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    searchParams,
    setSearchParams,
    refetch: query.refetch
  };
};

// Mutations
export const useSubmitCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.submit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call submitted successfully');
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.message);
    }
  });
};
```

**Client State (Zustand)**
```typescript
// store/documentTrackerStore.ts
interface DocumentTrackerState {
  filters: SearchFilters;
  selectedDocument: DocumentTracker | null;
  setFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;
  setSelectedDocument: (doc: DocumentTracker | null) => void;
}

export const useDocumentTrackerStore = create<DocumentTrackerState>((set) => ({
  filters: {},
  selectedDocument: null,
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
  setSelectedDocument: (doc) => set({ selectedDocument: doc })
}));
```

**Form State (React Hook Form + Zod)**
```typescript
const capitalCallSchema = z.object({
  aleBatchId: z.string().regex(/^ALE-\d{6}$/, 'Invalid batch ID format'),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  totalAmount: z.number().min(0.01, 'Amount must be greater than 0'),
  breakdowns: z.array(z.object({
    category: z.string(),
    percentage: z.number().min(0).max(100)
  }))
}).refine((data) => {
  const total = data.breakdowns.reduce((sum, b) => sum + b.percentage, 0);
  return total <= 100;
}, {
  message: 'Total percentage cannot exceed 100%'
});

type CapitalCallForm = z.infer<typeof capitalCallSchema>;

const { register, handleSubmit, formState: { errors }, watch } = useForm<CapitalCallForm>({
  resolver: zodResolver(capitalCallSchema)
});
```

### 3.4 API Integration

**API Client Setup**
```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add correlation ID
    config.headers['X-Correlation-ID'] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    
    if (error.response?.status === 423) {
      // Handle locked resource
      toast.error('This item is locked by another user');
    }
    
    return Promise.reject(error.response?.data || error);
  }
);
```

**API Service Pattern**
```typescript
// features/document-tracker/api/documentTrackerApi.ts
export const documentTrackerApi = {
  search: async (request: SearchRequest): Promise<PaginatedResponse<DocumentTracker>> => {
    const { data } = await apiClient.post('/api/document-tracker/search', request);
    return data;
  },

  getDetails: async (genId: string): Promise<DocumentDetails> => {
    const { data } = await apiClient.get(`/api/document-tracker/${genId}/details`);
    return data;
  },

  export: async (request: SearchRequest): Promise<Blob> => {
    const { data } = await apiClient.post('/api/document-tracker/export', request, {
      responseType: 'blob'
    });
    return data;
  }
};
```

---

## 4. Module Specifications

## 4.1 Document Tracker Module

### User Stories Implementation

**US 1.1 - Access Document Tracker**
**US 1.2 - Search & Filter Documents**
**US 1.3 - Grid Operations**
**US 1.4 - Track Document Status**

### Component Structure

```
features/document-tracker/
├── components/
│   ├── DocumentTrackerPage.tsx          # Main page
│   ├── DocumentTrackerFilters.tsx       # Filter container
│   ├── DocumentTrackerGrid.tsx          # Data grid
│   ├── DocumentDetailsPage.tsx          # Details page
│   ├── SubDocumentStatus.tsx            # Status visualization
│   └── StatusBadge.tsx                  # Status badge component
├── hooks/
│   ├── useDocumentSearch.ts
│   ├── useDocumentDetails.ts
│   └── useDocumentExport.ts
├── api/
│   └── documentTrackerApi.ts
└── types.ts
```

### Type Definitions

```typescript
// features/document-tracker/types.ts
export interface DocumentTracker {
  id: number;
  genId: string;
  documentType: string;
  receivedAt: string;
  createdAt: string;
  createdBy: string;
}

export interface DocumentDetails {
  genId: string;
  documentType: string;
  receivedAt: string;
  subDocuments: SubDocument[];
}

export interface SubDocument {
  id: number;
  subId: string;
  status: SubIdStatus;
  statusMessage: string;
  processedAt: string;
  severity: Severity;
}

export enum SubIdStatus {
  PROCESS_FAILED = 'PROCESS_FAILED',
  PROCESS_COMPLETED = 'PROCESS_COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export enum Severity {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface DocumentSearchFilters {
  genId?: string;
  documentType?: string;
  fromDate?: Date;
  toDate?: Date;
}
```

### Filter Container Component

```typescript
// DocumentTrackerFilters.tsx
interface DocumentTrackerFiltersProps {
  onSearch: (filters: DocumentSearchFilters) => void;
  onReset: () => void;
  initialFilters?: DocumentSearchFilters;
}

export const DocumentTrackerFilters: React.FC<DocumentTrackerFiltersProps> = ({
  onSearch,
  onReset,
  initialFilters
}) => {
  const { register, handleSubmit, reset } = useForm<DocumentSearchFilters>({
    defaultValues: initialFilters
  });

  const handleReset = () => {
    reset({});
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSearch)} className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-4 gap-4">
        <Input
          label="Gen ID"
          placeholder="GEN12345678"
          {...register('genId')}
        />
        
        <Select
          label="Document Type"
          {...register('documentType')}
        >
          <option value="">All Types</option>
          <option value="TYPE1">Type 1</option>
          <option value="TYPE2">Type 2</option>
        </Select>
        
        <DatePicker
          label="From Date"
          {...register('fromDate')}
        />
        
        <DatePicker
          label="To Date"
          {...register('toDate')}
        />
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button type="submit" variant="primary">
          Search
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
};
```

### Data Grid Component

```typescript
// DocumentTrackerGrid.tsx
interface DocumentTrackerGridProps {
  data: PaginatedResponse<DocumentTracker>;
  onRowClick: (document: DocumentTracker) => void;
  onSort: (field: string, direction: 'ASC' | 'DESC') => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
}

export const DocumentTrackerGrid: React.FC<DocumentTrackerGridProps> = ({
  data,
  onRowClick,
  onSort,
  onPageChange,
  onExport
}) => {
  const columns: ColumnDef<DocumentTracker>[] = [
    {
      accessorKey: 'genId',
      header: 'Gen ID',
      cell: ({ row }) => (
        <button
          onClick={() => onRowClick(row.original)}
          className="text-blue-600 hover:underline"
        >
          {row.original.genId}
        </button>
      )
    },
    {
      accessorKey: 'documentType',
      header: 'Document Type'
    },
    {
      accessorKey: 'receivedAt',
      header: 'Received At',
      cell: ({ row }) => formatDateTime(row.original.receivedAt)
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Documents ({data.pagination.totalElements})
        </h2>
        <ExportButton onClick={onExport} />
      </div>
      
      <DataGrid
        columns={columns}
        data={data.content}
        onSort={onSort}
      />
      
      <Pagination
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
```

### Details Page Component

```typescript
// DocumentDetailsPage.tsx
export const DocumentDetailsPage: React.FC = () => {
  const { genId } = useParams<{ genId: string }>();
  const { data, isLoading, error } = useDocumentDetails(genId!);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <NotFound />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Document Details</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Gen ID" value={data.genId} />
          <InfoField label="Document Type" value={data.documentType} />
          <InfoField label="Received At" value={formatDateTime(data.receivedAt)} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Sub Documents</h2>
        
        <div className="space-y-4">
          {data.subDocuments.map((subDoc) => (
            <SubDocumentCard key={subDoc.id} subDocument={subDoc} />
          ))}
        </div>
      </div>
    </div>
  );
};

// SubDocumentCard.tsx
interface SubDocumentCardProps {
  subDocument: SubDocument;
}

const SubDocumentCard: React.FC<SubDocumentCardProps> = ({ subDocument }) => {
  const severityConfig = {
    ERROR: { color: 'red', icon: AlertCircle },
    SUCCESS: { color: 'green', icon: CheckCircle },
    WARNING: { color: 'yellow', icon: AlertTriangle },
    INFO: { color: 'blue', icon: Info }
  };

  const config = severityConfig[subDocument.severity];
  const Icon = config.icon;

  return (
    <div className={`border-l-4 border-${config.color}-500 bg-${config.color}-50 p-4 rounded`}>
      <div className="flex items-center gap-2">
        <Icon className={`text-${config.color}-600`} size={20} />
        <span className="font-semibold">{subDocument.subId}</span>
        <StatusBadge status={subDocument.status} severity={subDocument.severity} />
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{subDocument.statusMessage}</p>
      <p className="mt-1 text-xs text-gray-500">
        Processed: {formatDateTime(subDocument.processedAt)}
      </p>
    </div>
  );
};
```

### Custom Hooks

```typescript
// hooks/useDocumentSearch.ts
export const useDocumentSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchRequest>({
    filters: {},
    pagination: { page: 0, size: 25 },
    sort: []
  });

  const query = useQuery({
    queryKey: ['documents', searchParams],
    queryFn: () => documentTrackerApi.search(searchParams),
    staleTime: 5 * 60 * 1000
  });

  const handleSearch = (filters: DocumentSearchFilters) => {
    setSearchParams(prev => ({
      ...prev,
      filters,
      pagination: { ...prev.pagination, page: 0 }
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page }
    }));
  };

  const handleSort = (field: string, direction: 'ASC' | 'DESC') => {
    setSearchParams(prev => ({
      ...prev,
      sort: [{ field, direction }]
    }));
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    handleSearch,
    handlePageChange,
    handleSort
  };
};

// hooks/useDocumentDetails.ts
export const useDocumentDetails = (genId: string) => {
  return useQuery({
    queryKey: ['document-details', genId],
    queryFn: () => documentTrackerApi.getDetails(genId),
    enabled: !!genId
  });
};

// hooks/useDocumentExport.ts
export const useDocumentExport = () => {
  return useMutation({
    mutationFn: (request: SearchRequest) => documentTrackerApi.export(request),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });
};
```

---

## 4.2 Capital Call Module

### User Stories Implementation

**US 2.1 - Navigate to Capital Call Dashboard**
**US 2.2 - Advanced Filtering with Retention**
**US 2.3 - Grid Behavior & Visual Indicators**
**US 2.4 - Work Item Locking & Unlocking**
**US 2.5 - Edit Capital Call Details**

### Component Structure

```
features/capital-call/
├── components/
│   ├── CapitalCallPage.tsx              # Main page with tabs
│   ├── CapitalCallFilters.tsx           # Filter container
│   ├── CapitalCallGrid.tsx              # Data grid with locking
│   ├── CapitalCallDetails.tsx           # Details page
│   ├── BreakdownSection.tsx             # Breakdown editing
│   ├── CommentsSection.tsx              # Comments
│   ├── LockIndicator.tsx                # Lock icon/status
│   └── UnlockDialog.tsx                 # Force unlock dialog
├── hooks/
│   ├── useCapitalCallSearch.ts
│   ├── useCapitalCallDetails.ts
│   ├── useCapitalCallMutations.ts
│   └── useLocking.ts
├── store/
│   └── capitalCallStore.ts
└── types.ts
```

### Type Definitions

```typescript
// features/capital-call/types.ts
export interface CapitalCall {
  id: number;
  aleBatchId: string;
  fromDate: string | null;
  toDate: string | null;
  dayType: string | null;
  totalAmount: number;
  workflowStatus: WorkflowStatus;
  lockedBy: string | null;
  lockedAt: string | null;
  clientName: string;
  assetDescription: string;
  isSensitive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface CapitalCallDetails extends CapitalCall {
  breakdowns: Breakdown[];
  comments: Comment[];
  auditTrail: AuditEntry[];
}

export interface Breakdown {
  id: number;
  category: BreakdownCategory;
  percentage: number;
  calculatedAmount: number;
}

export enum BreakdownCategory {
  MANAGEMENT_FEES = 'MANAGEMENT_FEES',
  PERFORMANCE_FEES = 'PERFORMANCE_FEES',
  OPERATING_EXPENSES = 'OPERATING_EXPENSES',
  DISTRIBUTIONS = 'DISTRIBUTIONS',
  OTHER = 'OTHER'
}

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Comment {
  id: number;
  text: string;
  createdBy: string;
  createdAt: string;
}

export interface CapitalCallSearchFilters {
  aleBatchId?: string;
  toeReference?: string;
  fromDate?: Date;
  toDate?: Date;
  dayType?: string;
  clientName?: string;
  workflowStatus?: WorkflowStatus;
}
```

### Filter Container with Conditional Fields

```typescript
// CapitalCallFilters.tsx
export const CapitalCallFilters: React.FC<CapitalCallFiltersProps> = ({
  onSearch,
  onReset,
  initialFilters
}) => {
  const { register, handleSubmit, watch, reset } = useForm<CapitalCallSearchFilters>({
    defaultValues: initialFilters
  });

  // Watch for date and batch ID changes
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const aleBatchId = watch('aleBatchId');
  const toeReference = watch('toeReference');

  // Hide Day Type when dates or batch/TOE is present
  const shouldHideDayType = !!(fromDate || toDate || aleBatchId || toeReference);

  const handleReset = () => {
    reset({});
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSearch)} className="bg-white p-4 rounded-lg shadow">
      {/* Row 1 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Input
          label="ALE Batch ID"
          placeholder="ALE-123456"
          {...register('aleBatchId')}
        />
        
        <Input
          label="TOE Reference"
          {...register('toeReference')}
        />
        
        <Input
          label="Client Name"
          {...register('clientName')}
        />
        
        <Select
          label="Status"
          {...register('workflowStatus')}
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
        </Select>
      </div>

      {/* Row 2 - Conditional Day Type */}
      <div className="grid grid-cols-4 gap-4">
        <DatePicker
          label="From Effective Date"
          {...register('fromDate')}
        />
        
        <DatePicker
          label="To Effective Date"
          {...register('toDate')}
        />
        
        {!shouldHideDayType && (
          <Select
            label="Day Type"
            {...register('dayType')}
          >
            <option value="">Select</option>
            <option value="BUSINESS">Business Day</option>
            <option value="CALENDAR">Calendar Day</option>
          </Select>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="submit" variant="primary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
};
```

### Data Grid with Locking and Color Coding

```typescript
// CapitalCallGrid.tsx
interface CapitalCallGridProps {
  data: PaginatedResponse<CapitalCall>;
  onRowClick: (capitalCall: CapitalCall) => void;
  onUnlock: (id: number) => void;
  userPermissions: string[];
}

export const CapitalCallGrid: React.FC<CapitalCallGridProps> = ({
  data,
  onRowClick,
  onUnlock,
  userPermissions
}) => {
  const currentUser = useAuth().user;
  const canUnlock = userPermissions.includes('RULE_UNLOCK_WORK_ITEM');

  const handleRowClick = (capitalCall: CapitalCall) => {
    if (capitalCall.lockedBy && capitalCall.lockedBy !== currentUser.username) {
      // Show lock dialog
      toast.warning(`This item is locked by ${capitalCall.lockedBy}`);
      return;
    }
    onRowClick(capitalCall);
  };

  const columns: ColumnDef<CapitalCall>[] = [
    {
      accessorKey: 'lock',
      header: '',
      cell: ({ row }) => row.original.lockedBy && (
        <LockIndicator
          lockedBy={row.original.lockedBy}
          canUnlock={canUnlock}
          onUnlock={() => onUnlock(row.original.id)}
        />
      ),
      size: 40
    },
    {
      accessorKey: 'assetDescription',
      header: 'Asset Description',
      cell: ({ row }) => (
        <button
          onClick={() => handleRowClick(row.original)}
          className="text-blue-600 hover:underline"
        >
          {row.original.assetDescription}
        </button>
      )
    },
    {
      accessorKey: 'clientName',
      header: 'Client Name'
    },
    {
      accessorKey: 'aleBatchId',
      header: 'ALE Batch ID'
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => formatCurrency(row.original.totalAmount)
    },
    {
      accessorKey: 'workflowStatus',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.workflowStatus} />
    }
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        columns={columns}
        data={data.content}
        getRowClassName={(row) => row.isSensitive ? 'bg-red-50' : ''}
      />
      
      <Pagination
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
      />
    </div>
  );
};

// LockIndicator.tsx
interface LockIndicatorProps {
  lockedBy: string;
  canUnlock: boolean;
  onUnlock: () => void;
}

const LockIndicator: React.FC<LockIndicatorProps> = ({ lockedBy, canUnlock, onUnlock }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Lock className="text-red-600" size={16} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Locked by: {lockedBy}</p>
            {canUnlock && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDialog(true)}
                className="mt-2"
              >
                Force Unlock
              </Button>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UnlockDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={onUnlock}
        lockedBy={lockedBy}
      />
    </>
  );
};
```

### Details Page with Edit Mode

```typescript
// CapitalCallDetails.tsx
export const CapitalCallDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data, isLoading } = useCapitalCallDetails(Number(id));
  const { mutate: save } = useSaveCapitalCall();
  const { mutate: submit } = useSubmitCapitalCall();
  const { mutate: approve } = useApproveCapitalCall();
  const { acquireLock, releaseLock } = useLocking('CapitalCall', id!);

  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty }
  } = useForm<CapitalCallForm>({
    resolver: zodResolver(capitalCallSchema),
    defaultValues: data
  });

  // Watch total amount for breakdown calculations
  const totalAmount = watch('totalAmount');
  const breakdowns = watch('breakdowns');

  // Auto-calculate breakdown amounts
  useEffect(() => {
    if (isEditMode && breakdowns) {
      breakdowns.forEach((breakdown, index) => {
        const calculatedAmount = (totalAmount * breakdown.percentage) / 100;
        setValue(`breakdowns.${index}.calculatedAmount`, calculatedAmount);
      });
    }
  }, [totalAmount, breakdowns, isEditMode]);

  const handleEdit = async () => {
    await acquireLock(user.username);
    setIsEditMode(true);
  };

  const handleSave = async (formData: CapitalCallForm) => {
    await save(formData, {
      onSuccess: () => {
        releaseLock();
        navigate('/capital-call');
        toast.success('Changes saved successfully');
      }
    });
  };

  const handleCancel = () => {
    releaseLock();
    setIsEditMode(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <NotFound />;

  const canEdit = user.permissions.includes('RULE_EDIT');
  const canSubmit = user.permissions.includes('RULE_SUBMIT');
  const canApprove = user.permissions.includes('RULE_APPROVE');

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Capital Call Details</h1>
        
        <div className="flex gap-2">
          {!isEditMode && canEdit && (
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          
          {isEditMode && (
            <>
              <Button type="submit" disabled={!isDirty}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
          
          {!isEditMode && data.workflowStatus === 'DRAFT' && canSubmit && (
            <Button onClick={() => submit(data.id)}>
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
          )}
          
          {!isEditMode && data.workflowStatus === 'SUBMITTED' && canApprove && (
            <Button onClick={() => approve(data.id)} variant="success">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ALE Batch ID"
              {...register('aleBatchId')}
              disabled={!isEditMode}
              error={errors.aleBatchId?.message}
            />
            
            <Input
              label="Client Name"
              value={data.clientName}
              disabled
            />
            
            <Input
              label="Total Amount"
              type="number"
              step="0.01"
              {...register('totalAmount', { valueAsNumber: true })}
              disabled={!isEditMode}
              error={errors.totalAmount?.message}
            />
            
            <DatePicker
              label="From Date"
              {...register('fromDate')}
              disabled={!isEditMode}
            />
            
            <DatePicker
              label="To Date"
              {...register('toDate')}
              disabled={!isEditMode}
            />
            
            <div>
              <label className="text-sm font-medium">Status</label>
              <StatusBadge status={data.workflowStatus} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Section */}
      <BreakdownSection
        control={control}
        isEditMode={isEditMode}
        totalAmount={totalAmount}
        errors={errors}
      />

      {/* Comments Section */}
      <CommentsSection
        comments={data.comments}
        isEditMode={isEditMode}
        onAddComment={(text) => {/* Add comment */}}
      />
    </form>
  );
};
```

### Breakdown Section Component

```typescript
// BreakdownSection.tsx
interface BreakdownSectionProps {
  control: Control<CapitalCallForm>;
  isEditMode: boolean;
  totalAmount: number;
  errors: FieldErrors<CapitalCallForm>;
}

export const BreakdownSection: React.FC<BreakdownSectionProps> = ({
  control,
  isEditMode,
  totalAmount,
  errors
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'breakdowns'
  });

  const totalPercentage = fields.reduce((sum, field) => sum + (field.percentage || 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Breakdown</CardTitle>
          {isEditMode && (
            <Button
              type="button"
              size="sm"
              onClick={() => append({
                category: BreakdownCategory.OTHER,
                percentage: 0,
                calculatedAmount: 0
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Row
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Percentage (%)</TableHead>
              <TableHead>Amount</TableHead>
              {isEditMode && <TableHead className="w-16"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Controller
                    control={control}
                    name={`breakdowns.${index}.category`}
                    render={({ field }) => (
                      <Select {...field} disabled={!isEditMode}>
                        {Object.values(BreakdownCategory).map(cat => (
                          <option key={cat} value={cat}>
                            {cat.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </TableCell>
                
                <TableCell>
                  <Controller
                    control={control}
                    name={`breakdowns.${index}.percentage`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        disabled={!isEditMode}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    )}
                  />
                </TableCell>
                
                <TableCell>
                  <Controller
                    control={control}
                    name={`breakdowns.${index}.calculatedAmount`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={formatCurrency(field.value)}
                        disabled
                      />
                    )}
                  />
                </TableCell>
                
                {isEditMode && (
                  <TableCell>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className={cn(
                "font-bold",
                totalPercentage > 100 && "text-red-600"
              )}>
                {totalPercentage.toFixed(2)}%
                {totalPercentage > 100 && (
                  <span className="ml-2 text-xs">(Exceeds 100%)</span>
                )}
              </TableCell>
              <TableCell className="font-bold">
                {formatCurrency(totalAmount)}
              </TableCell>
              {isEditMode && <TableCell></TableCell>}
            </TableRow>
          </TableFooter>
        </Table>
        
        {errors.breakdowns && (
          <p className="text-sm text-red-600 mt-2">
            {errors.breakdowns.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
```

### Locking Hook

```typescript
// hooks/useLocking.ts
export const useLocking = (entityType: string, entityId: string) => {
  const queryClient = useQueryClient();

  const acquireLock = useMutation({
    mutationFn: (username: string) =>
      apiClient.post('/api/locks/acquire', { entityType, entityId, username }),
    onError: (error: ErrorResponse) => {
      if (error.errorCode === 'LOCK_423') {
        toast.error(error.message);
      }
    }
  });

  const releaseLock = useMutation({
    mutationFn: (username: string) =>
      apiClient.post('/api/locks/release', { entityType, entityId, username }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityType.toLowerCase()] });
    }
  });

  const forceUnlock = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/locks/force-unlock`, { entityType, entityId }),
    onSuccess: () => {
      toast.success('Lock removed successfully');
      queryClient.invalidateQueries({ queryKey: [entityType.toLowerCase()] });
    }
  });

  return {
    acquireLock: acquireLock.mutate,
    releaseLock: releaseLock.mutate,
    forceUnlock: forceUnlock.mutate,
    isAcquiring: acquireLock.isPending,
    isReleasing: releaseLock.isPending
  };
};
```

### Filter State Persistence

```typescript
// store/capitalCallStore.ts
interface CapitalCallState {
  filters: CapitalCallSearchFilters;
  activeTab: string;
  setFilters: (filters: CapitalCallSearchFilters) => void;
  setActiveTab: (tab: string) => void;
  resetFilters: () => void;
}

export const useCapitalCallStore = create<CapitalCallState>()(
  persist(
    (set) => ({
      filters: {},
      activeTab: 'ssi-verification',
      setFilters: (filters) => set({ filters }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      resetFilters: () => set({ filters: {} })
    }),
    {
      name: 'capital-call-filters', // localStorage key
      partialize: (state) => ({ filters: state.filters, activeTab: state.activeTab })
    }
  )
);

// Usage in component
const CapitalCallPage = () => {
  const { filters, activeTab, setFilters, setActiveTab } = useCapitalCallStore();

  // Filters persist across tab switches and page reloads
};
```

---

## 4.3 Alternative Data Management Module

### User Stories Implementation

**US 3.1 - Search & Advanced Search**
**US 3.2 - Custom Grid Views**
**US 3.3 - Navigate to Linked Detail Pages**
**US 3.4 - Edit & Audit Trail**

### Component Structure

```
features/alternative-data/
├── components/
│   ├── AlternativeDataPage.tsx
│   ├── AlternativeDataFilters.tsx
│   ├── AlternativeDataGrid.tsx
│   ├── ColumnPreferenceDialog.tsx
│   ├── AdvancedSearchDialog.tsx
│   ├── ClientDetailsPage.tsx
│   ├── AccountDetailsPage.tsx
│   └── AuditTrailDialog.tsx
├── hooks/
│   ├── useAlternativeDataSearch.ts
│   ├── useColumnPreferences.ts
│   └── useAuditTrail.ts
└── types.ts
```

### Type Definitions

```typescript
// features/alternative-data/types.ts
export interface AlternativeDataRecord {
  id: number;
  clientName: string;
  accountNumber: string;
  fundFamily: string;
  assetDescription: string;
  dataSource: string;
  reportDate: string;
  status: DataStatus;
  // ... other fields
}

export interface ColumnPreference {
  id: number;
  userId: string;
  moduleName: string;
  viewName: string;
  columns: string[];
  displayOrder: string[];
  isDefault: boolean;
}

export interface AuditEntry {
  id: number;
  entityType: string;
  entityId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  timestamp: string;
}

export const AVAILABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'clientName', label: 'Client Name' },
  { key: 'accountNumber', label: 'Account Number' },
  { key: 'fundFamily', label: 'Fund Family' },
  { key: 'assetDescription', label: 'Asset Description' },
  { key: 'dataSource', label: 'Data Source' },
  { key: 'reportDate', label: 'Report Date' },
  { key: 'status', label: 'Status' },
  // ... up to 40+ columns
];
```

### Column Preference Dialog

```typescript
// ColumnPreferenceDialog.tsx
interface ColumnPreferenceDialogProps {
  open: boolean;
  onClose: () => void;
  currentPreference?: ColumnPreference;
}

export const ColumnPreferenceDialog: React.FC<ColumnPreferenceDialogProps> = ({
  open,
  onClose,
  currentPreference
}) => {
  const [viewName, setViewName] = useState(currentPreference?.viewName || '');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    currentPreference?.columns || []
  );

  const { mutate: savePreference } = useSaveColumnPreference();

  const availableColumns = AVAILABLE_COLUMNS.filter(
    col => !selectedColumns.includes(col.key)
  );

  const handleAddColumn = (columnKey: string) => {
    if (selectedColumns.length >= 40) {
      toast.error('Maximum 40 columns allowed');
      return;
    }
    setSelectedColumns([...selectedColumns, columnKey]);
  };

  const handleRemoveColumn = (columnKey: string) => {
    setSelectedColumns(selectedColumns.filter(k => k !== columnKey));
  };

  const handleSave = () => {
    if (!viewName.trim()) {
      toast.error('Please enter a view name');
      return;
    }

    savePreference({
      viewName,
      columns: selectedColumns,
      moduleName: 'ALTERNATIVE_DATA'
    }, {
      onSuccess: () => {
        toast.success('Column preference saved');
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Column Preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            label="View Name"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="My Custom View"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Available Columns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Available Columns</CardTitle>
              </CardHeader>
              <CardContent className="h-96 overflow-y-auto">
                <div className="space-y-2">
                  {availableColumns.map(col => (
                    <div
                      key={col.key}
                      className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <span className="text-sm">{col.label}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddColumn(col.key)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Columns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Selected Columns ({selectedColumns.length}/40)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96 overflow-y-auto">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="selected-columns">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {selectedColumns.map((colKey, index) => {
                          const col = AVAILABLE_COLUMNS.find(c => c.key === colKey);
                          return (
                            <Draggable key={colKey} draggableId={colKey} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex justify-between items-center p-2 mb-2 bg-blue-50 rounded"
                                >
                                  <div className="flex items-center gap-2">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{col?.label}</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveColumn(colKey)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

### Grid with Column-Level Search

```typescript
// AlternativeDataGrid.tsx
export const AlternativeDataGrid: React.FC<AlternativeDataGridProps> = ({
  data,
  columnPreference,
  onColumnSearch
}) => {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const handleColumnFilterChange = (columnKey: string, value: string) => {
    const newFilters = { ...columnFilters, [columnKey]: value };
    setColumnFilters(newFilters);
    
    // Debounce the search
    debouncedSearch(newFilters);
  };

  const debouncedSearch = useDebouncedCallback((filters) => {
    onColumnSearch(filters);
  }, 500);

  const visibleColumns = columnPreference?.columns || DEFAULT_COLUMNS;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {/* Column Headers */}
          <TableRow>
            {visibleColumns.map(colKey => {
              const col = AVAILABLE_COLUMNS.find(c => c.key === colKey);
              return (
                <TableHead key={colKey}>
                  {col?.label}
                </TableHead>
              );
            })}
          </TableRow>
          
          {/* Column Search Row */}
          <TableRow className="bg-gray-50">
            {visibleColumns.map(colKey => (
              <TableHead key={colKey}>
                <Input
                  placeholder="Search..."
                  size="sm"
                  value={columnFilters[colKey] || ''}
                  onChange={(e) => handleColumnFilterChange(colKey, e.target.value)}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {data.content.map(record => (
            <TableRow key={record.id}>
              {visibleColumns.map(colKey => (
                <TableCell key={colKey}>
                  {renderCell(record, colKey)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to render cell content with hyperlinks
const renderCell = (record: AlternativeDataRecord, columnKey: string) => {
  const value = record[columnKey as keyof AlternativeDataRecord];

  // Hyperlinked columns
  if (columnKey === 'clientName') {
    return (
      <Link to={`/alternative-data/client/${record.id}`} className="text-blue-600 hover:underline">
        {value}
      </Link>
    );
  }

  if (columnKey === 'accountNumber') {
    return (
      <Link to={`/alternative-data/account/${record.id}`} className="text-blue-600 hover:underline">
        {value}
      </Link>
    );
  }

  if (columnKey === 'fundFamily') {
    return (
      <Link to={`/alternative-data/fund/${record.id}`} className="text-blue-600 hover:underline">
        {value}
      </Link>
    );
  }

  if (columnKey === 'assetDescription') {
    return (
      <Link to={`/alternative-data/asset/${record.id}`} className="text-blue-600 hover:underline">
        {value}
      </Link>
    );
  }

  // Regular cell
  return value?.toString() || '-';
};
```

### Audit Trail Dialog

```typescript
// AuditTrailDialog.tsx
interface AuditTrailDialogProps {
  open: boolean;
  onClose: () => void;
  entityType: string;
  entityId: string;
}

export const AuditTrailDialog: React.FC<AuditTrailDialogProps> = ({
  open,
  onClose,
  entityType,
  entityId
}) => {
  const [selectedField, setSelectedField] = useState<string>('');
  const { data: auditTrail, isLoading } = useAuditTrail(entityType, entityId, selectedField);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>History Audit Trail</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            label="Select Field"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option value="">All Fields</option>
            <option value="clientName">Client Name</option>
            <option value="accountNumber">Account Number</option>
            <option value="status">Status</option>
            {/* ... other fields */}
          </Select>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditTrail?.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.fieldName}</TableCell>
                    <TableCell>
                      <span className="text-red-600">{entry.oldValue || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600">{entry.newValue || '-'}</span>
                    </TableCell>
                    <TableCell>{entry.changedBy}</TableCell>
                    <TableCell>{formatDateTime(entry.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 5. Common Components Library

### 5.1 DataGrid Component

```typescript
// components/common/DataGrid/DataGrid.tsx
interface DataGridProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onSort?: (field: string, direction: 'ASC' | 'DESC') => void;
  onRowClick?: (row: T) => void;
  getRowClassName?: (row: T) => string;
  loading?: boolean;
}

export function DataGrid<T>({
  columns,
  data,
  onSort,
  onRowClick,
  getRowClassName,
  loading = false
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  useEffect(() => {
    if (sorting.length > 0 && onSort) {
      const { id, desc } = sorting[0];
      onSort(id, desc ? 'DESC' : 'ASC');
    }
  }, [sorting, onSort]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  onClick={header.