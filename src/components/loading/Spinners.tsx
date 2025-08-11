export const MinimalSpinner = () => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]">
    <span className="sr-only">Loading...</span>
  </div>
);

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <MinimalSpinner />
  </div>
);

export const ComponentSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <MinimalSpinner />
  </div>
);