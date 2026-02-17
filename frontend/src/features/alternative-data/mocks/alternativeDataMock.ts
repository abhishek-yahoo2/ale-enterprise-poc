import type { AlternativeDataRecord } from '../types';

export const alternativeDataMock: AlternativeDataRecord[] = [
  {
    id: 'ALT-1001',
    client: 'BlackRock',
    account: 'ACC-1201',
    fundFamily: 'Global Equity',
    assetDescription: 'Infrastructure Debt - Series A',
    status: 'Active',
    effectiveDate: '2024-01-12T00:00:00.000Z',
    amount: 2500000,
    currency: 'USD',
    createdBy: 'system',
    createdDate: '2024-01-12T08:00:00.000Z',
    modifiedBy: 'system',
    modifiedDate: '2024-01-12T08:00:00.000Z',
  },
  {
    id: 'ALT-1002',
    client: 'Vanguard',
    account: 'ACC-1202',
    fundFamily: 'PE Growth',
    assetDescription: 'Private Equity Growth Fund I',
    status: 'Pending',
    effectiveDate: '2024-02-05T00:00:00.000Z',
    amount: 1800000,
    currency: 'USD',
    createdBy: 'admin',
    createdDate: '2024-02-05T09:30:00.000Z',
    modifiedBy: 'admin',
    modifiedDate: '2024-02-05T09:30:00.000Z',
  },
  {
    id: 'ALT-1003',
    client: 'Fidelity',
    account: 'ACC-1203',
    fundFamily: 'Infra Fund',
    assetDescription: 'Renewable Energy Portfolio',
    status: 'Active',
    effectiveDate: '2024-03-01T00:00:00.000Z',
    amount: 3200000,
    currency: 'USD',
    createdBy: 'system',
    createdDate: '2024-03-01T10:00:00.000Z',
    modifiedBy: 'analyst1',
    modifiedDate: '2024-03-02T11:00:00.000Z',
  },
  {
    id: 'ALT-1004',
    client: 'StateStreet',
    account: 'ACC-1204',
    fundFamily: 'Debt Alpha',
    assetDescription: 'Corporate Debt Structured Note',
    status: 'Inactive',
    effectiveDate: '2024-01-22T00:00:00.000Z',
    amount: 950000,
    currency: 'USD',
    createdBy: 'admin',
    createdDate: '2024-01-22T07:45:00.000Z',
    modifiedBy: 'admin',
    modifiedDate: '2024-01-25T09:15:00.000Z',
  },

  // ---------- AUTO-GENERATED STYLE ENTRIES BELOW ----------

  ...Array.from({ length: 46 }, (_, i) => {
    const index = i + 5;

    const clients = ['BlackRock', 'Vanguard', 'Fidelity', 'StateStreet'];
    const funds = ['Global Equity', 'PE Growth', 'Infra Fund', 'Debt Alpha'];
    const statuses: ('Active' | 'Inactive' | 'Pending')[] = [
      'Active',
      'Inactive',
      'Pending',
    ];

    return {
      id: `ALT-${1000 + index}`,
      client: clients[index % clients.length],
      account: `ACC-${1200 + index}`,
      fundFamily: funds[index % funds.length],
      assetDescription: `Alternative Asset Portfolio ${index}`,
      status: statuses[index % statuses.length],
      effectiveDate: `2024-${String((index % 12) + 1).padStart(2, '0')}-10T00:00:00.000Z`,
      amount: 500000 + index * 25000,
      currency: 'USD',
      createdBy: 'system',
      createdDate: `2024-${String((index % 12) + 1).padStart(2, '0')}-01T08:00:00.000Z`,
      modifiedBy: 'system',
      modifiedDate: `2024-${String((index % 12) + 1).padStart(2, '0')}-02T09:00:00.000Z`,
    };
  }),
];
