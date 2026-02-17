import type {
  AlternativeDataRecord,
  SearchResponse,
  SearchRequest,
  UserColumnPreference,
  SaveColumnPreferenceRequest,
} from '../types';
import {alternativeDataMock} from '../mocks/alternativeDataMock'

/* -------------------------------------------------- */
/* 🧪 MOCK DATA */
/* -------------------------------------------------- */

const clients = ['BlackRock', 'Vanguard', 'Fidelity', 'StateStreet'];
const funds = ['Global Equity', 'PE Growth', 'Infra Fund', 'Debt Alpha'];
const statuses = ['Active', 'Inactive', 'Pending'] as const;

const generateMockData = (): AlternativeDataRecord[] =>
  Array.from({ length: 100 }, (_, i) => ({
    id: `ALT-${1000 + i}`,
    client: clients[Math.floor(Math.random() * clients.length)],
    account: `ACC-${Math.floor(Math.random() * 9000 + 1000)}`,
    fundFamily: funds[Math.floor(Math.random() * funds.length)],
    assetDescription: `Asset ${i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    effectiveDate: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    ).toISOString(),
    amount: Number((Math.random() * 1000000).toFixed(2)),
    currency: 'USD',
    createdBy: 'system',
    createdDate: new Date().toISOString(),
    modifiedBy: 'system',
    modifiedDate: new Date().toISOString(),
  }));

let alternativeData: AlternativeDataRecord[] = [...alternativeDataMock]//generateMockData();

let columnPreference: UserColumnPreference = {
  columns: [
    'id',
    'client',
    'account',
    'fundFamily',
    'assetDescription',
    'status',
    'amount',
  ],
};

/* -------------------------------------------------- */
/* 🚀 MOCK API IMPLEMENTATION */
/* -------------------------------------------------- */

export const alternativeDataApi = {
  search: async (
    request: SearchRequest
  ): Promise<SearchResponse<AlternativeDataRecord>> => {
    await new Promise((r) => setTimeout(r, 400));

    let filtered = [...alternativeData];
    
    // Filtering
    if (request.filters?.clientName) {
      filtered = filtered.filter(
        (r) => r.client.includes(request.filters?.clientName)
      );
    }
console.log("FILERTERD",filtered,request)
    if (request.filters?.status) {
      filtered = filtered.filter(
        (r) => r.status === request.filters?.status
      );
    }

    if (request.filters?.search) {
      const keyword = request.filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.assetDescription.toLowerCase().includes(keyword) ||
          r.account.toLowerCase().includes(keyword)
      );
    }

    // Sorting
    if (request.sort?.field) {
      filtered.sort((a: any, b: any) => {
        const field = request.sort!.field;
        const direction = request.sort!.direction === 'DESC' ? -1 : 1;

        if (a[field] < b[field]) return -1 * direction;
        if (a[field] > b[field]) return 1 * direction;
        return 0;
      });
    }
console.log("REQUEST",request)
    // Pagination
    const page = request.pagination?.page;
    const size = request.pagination?.size;

    // const start = page * size;
    // const content = filtered.slice(start, start + size);
console.log("FILTERED",filtered.slice(page * size, (page + 1) * size))
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const paginatedResults = filtered.slice(page * size, (page + 1) * size);
    console.log("PAGINATED RESULTS", paginatedResults);
    return {
      data: paginatedResults,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalElements,
        totalPages,
      },
    };
  },

  getColumnPreferences: async (): Promise<UserColumnPreference> => {
    await new Promise((r) => setTimeout(r, 200));
    return columnPreference;
  },

  saveColumnPreferences: async (
    request: SaveColumnPreferenceRequest
  ): Promise<UserColumnPreference> => {
    await new Promise((r) => setTimeout(r, 300));

    columnPreference = {
      columns: request.columns.slice(0, 40), // enforce max 40 columns
    };

    return columnPreference;
  },

  export: async (): Promise<Blob> => {
    await new Promise((r) => setTimeout(r, 400));

    const csvContent =
      'ID,Client,Account,Fund,Status,Amount\n' +
      alternativeData
        .map(
          (r) =>
            `${r.id},${r.client},${r.account},${r.fundFamily},${r.status},${r.amount}`
        )
        .join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  },
};
