# DataTable Component

A comprehensive, reusable data table component for the ERP frontend that provides search, pagination, sorting, actions, and more features with consistent theming.

## Features

- ✅ **Search**: Debounced search across multiple columns
- ✅ **Pagination**: Built-in pagination with customizable page sizes
- ✅ **Sorting**: Column sorting with visual indicators
- ✅ **Actions**: Row-level actions with icons and conditional visibility
- ✅ **Bulk Actions**: Multi-select with bulk operations
- ✅ **Loading States**: Skeleton loading animation
- ✅ **Error Handling**: Error states with retry functionality
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Dark Mode**: Full dark mode support
- ✅ **Accessibility**: Keyboard navigation and screen reader support
- ✅ **TypeScript**: Full TypeScript support with generics

## Basic Usage

```tsx
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

const columns: DataTableColumn<User>[] = [
  {
    key: "name",
    header: "Name",
    searchable: true,
  },
  {
    key: "email",
    header: "Email",
    searchable: true,
  },
  {
    key: "status",
    header: "Status",
    render: (user) => <Badge>{user.status}</Badge>,
  },
];

const actions: DataTableAction<User>[] = [
  {
    key: "edit",
    label: "Edit",
    icon: <EditIcon />,
    onClick: (user) => console.log("Edit:", user),
  },
];

<DataTable
  data={users}
  columns={columns}
  actions={actions}
  searchable={true}
  searchKeys={["name", "email"]}
  title="User Management"
  description="Manage system users"
/>
```

## Props

### DataTableProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Array of data items to display |
| `columns` | `DataTableColumn<T>[]` | - | Column definitions |
| `actions` | `DataTableAction<T>[]` | `[]` | Row-level actions |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `searchKeys` | `(keyof T)[]` | `[]` | Keys to search in |
| `pagination` | `PaginationProps` | - | Pagination configuration |
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `string \| null` | `null` | Error message to display |
| `onRetry` | `() => void` | - | Retry function for error state |
| `emptyMessage` | `string` | `"No data available"` | Message when no data |
| `title` | `string` | - | Table title |
| `description` | `string` | - | Table description |
| `showHeader` | `boolean` | `true` | Show header section |
| `className` | `string` | `""` | Additional CSS classes |
| `onRowClick` | `(item: T) => void` | - | Row click handler |
| `selectable` | `boolean` | `false` | Enable row selection |
| `selectedItems` | `T[]` | `[]` | Currently selected items |
| `onSelectionChange` | `(items: T[]) => void` | - | Selection change handler |
| `bulkActions` | `DataTableAction<T[]>[]` | `[]` | Bulk actions for selected items |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `onSort` | `(key: string, direction: 'asc' \| 'desc') => void` | - | Sort change handler |
| `sortColumn` | `string` | - | Currently sorted column |
| `sortDirection` | `'asc' \| 'desc'` | `'asc'` | Sort direction |

### DataTableColumn<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string` | - | Unique column identifier |
| `header` | `string` | - | Column header text |
| `width` | `string` | - | Column width (CSS value) |
| `render` | `(item: T, index: number) => React.ReactNode` | - | Custom render function |
| `sortable` | `boolean` | `false` | Enable sorting for this column |
| `searchable` | `boolean` | `false` | Include in search |

### DataTableAction<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string` | - | Unique action identifier |
| `label` | `string` | - | Action label |
| `icon` | `React.ReactNode` | - | Action icon |
| `onClick` | `(item: T) => void` | - | Click handler |
| `variant` | `Button variant` | `"ghost"` | Button variant |
| `size` | `"sm" \| "md"` | `"sm"` | Button size |
| `color` | `string` | - | Action color |
| `disabled` | `(item: T) => boolean` | - | Disable condition |
| `hidden` | `(item: T) => boolean` | - | Hide condition |

### PaginationProps

| Prop | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Current page number |
| `totalPages` | `number` | Total number of pages |
| `totalItems` | `number` | Total number of items |
| `itemsPerPage` | `number` | Items per page |
| `onPageChange` | `(page: number) => void` | Page change handler |

## Examples

### Basic Table with Search

```tsx
const columns: DataTableColumn<Product>[] = [
  {
    key: "name",
    header: "Product Name",
    searchable: true,
  },
  {
    key: "price",
    header: "Price",
    render: (product) => `$${product.price}`,
  },
];

<DataTable
  data={products}
  columns={columns}
  searchable={true}
  searchKeys={["name"]}
  title="Products"
/>
```

### Table with Actions

```tsx
const actions: DataTableAction<Product>[] = [
  {
    key: "view",
    label: "View",
    icon: <EyeIcon />,
    onClick: (product) => router.push(`/products/${product.id}`),
  },
  {
    key: "edit",
    label: "Edit",
    icon: <EditIcon />,
    onClick: (product) => router.push(`/products/${product.id}/edit`),
  },
  {
    key: "delete",
    label: "Delete",
    icon: <TrashIcon />,
    onClick: (product) => handleDelete(product),
    color: "error",
  },
];

<DataTable
  data={products}
  columns={columns}
  actions={actions}
/>
```

### Selectable Table with Bulk Actions

```tsx
const [selectedItems, setSelectedItems] = useState<Product[]>([]);

const bulkActions: DataTableAction<Product[]>[] = [
  {
    key: "export",
    label: "Export Selected",
    icon: <DownloadIcon />,
    onClick: (items) => exportProducts(items),
  },
  {
    key: "delete",
    label: "Delete Selected",
    icon: <TrashIcon />,
    onClick: (items) => deleteProducts(items),
    color: "error",
  },
];

<DataTable
  data={products}
  columns={columns}
  selectable={true}
  selectedItems={selectedItems}
  onSelectionChange={setSelectedItems}
  bulkActions={bulkActions}
/>
```

### Sortable Table

```tsx
const [sortColumn, setSortColumn] = useState("");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

const handleSort = (key: string, direction: "asc" | "desc") => {
  setSortColumn(key);
  setSortDirection(direction);
  // Implement your sorting logic here
};

const columns: DataTableColumn<Product>[] = [
  {
    key: "name",
    header: "Product Name",
    sortable: true,
  },
  {
    key: "price",
    header: "Price",
    sortable: true,
  },
];

<DataTable
  data={products}
  columns={columns}
  sortable={true}
  onSort={handleSort}
  sortColumn={sortColumn}
  sortDirection={sortDirection}
/>
```

### Table with Pagination

```tsx
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(10);

<DataTable
  data={products}
  columns={columns}
  pagination={{
    currentPage: currentPage,
    totalPages: totalPages,
    totalItems: 100,
    itemsPerPage: 10,
    onPageChange: setCurrentPage,
  }}
/>
```

### Loading and Error States

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleRetry = () => {
  setError(null);
  loadData();
};

<DataTable
  data={products}
  columns={columns}
  loading={loading}
  error={error}
  onRetry={handleRetry}
/>
```

## Styling

The DataTable component follows the ERP design system with:

- **Colors**: Uses the brand color scheme (`brand-500`, `brand-600`, etc.)
- **Dark Mode**: Full dark mode support with proper contrast
- **Typography**: Consistent text sizes and weights
- **Spacing**: Proper padding and margins following the design system
- **Borders**: Subtle borders with proper dark mode variants
- **Hover States**: Interactive hover effects
- **Focus States**: Accessible focus indicators

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: Meets WCAG AA standards
- **Semantic HTML**: Uses proper table elements

## Performance

- **Debounced Search**: 300ms debounce to prevent excessive API calls
- **Memoized Rendering**: Optimized re-renders with React.memo
- **Virtual Scrolling**: Ready for large datasets (can be extended)
- **Lazy Loading**: Supports lazy loading of data

## Best Practices

1. **Define proper TypeScript interfaces** for your data
2. **Use meaningful column keys** that match your data structure
3. **Implement proper error handling** for API calls
4. **Use the `render` prop** for complex column content
5. **Leverage conditional actions** with `hidden` and `disabled` props
6. **Implement proper loading states** for better UX
7. **Use bulk actions** for common operations on multiple items
8. **Follow the design system** for consistent styling

## Migration from Basic Tables

To migrate from basic table implementations:

1. **Replace table elements** with DataTable component
2. **Define columns array** with proper configuration
3. **Convert action buttons** to DataTableAction objects
4. **Add search functionality** with searchKeys
5. **Implement pagination** if needed
6. **Add loading and error states**

Example migration:

```tsx
// Before
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
      </tr>
    ))}
  </tbody>
</table>

// After
const columns: DataTableColumn<User>[] = [
  { key: "name", header: "Name", searchable: true },
  { key: "email", header: "Email", searchable: true },
];

<DataTable
  data={users}
  columns={columns}
  searchable={true}
  searchKeys={["name", "email"]}
/>
```
