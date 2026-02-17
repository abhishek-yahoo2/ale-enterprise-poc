import React from 'react';
import {CapitalCallTabs} from '../components/CapitalCallTabs';
import {CapitalCallFilters} from '../components/CapitalCallFilters';
import {CapitalCallGrid} from '../components/CapitalCallGrid';

export default function CapitalCallDashboard() {
  return (
    <div>
      <CapitalCallTabs />
      <CapitalCallFilters />
      <CapitalCallGrid />
    </div>
  );
}
