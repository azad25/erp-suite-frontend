import ConfigExample from '@/components/examples/ConfigExample';

export const metadata = {
  title: 'Environment Configuration Example',
};

export default function ConfigExamplePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Environment Configuration</h1>
        <p className="text-gray-500 mt-2">
          This page demonstrates how environment variables are used in the application.
        </p>
      </div>
      
      <ConfigExample />
    </div>
  );
}