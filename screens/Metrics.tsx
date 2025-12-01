
import React from 'react';
import { MetricsTable } from '../components/investor/MetricsTable';

const Metrics: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-brand-blue mb-6">Manage Metrics</h1>
      <MetricsTable />
    </div>
  );
};

export default Metrics;
