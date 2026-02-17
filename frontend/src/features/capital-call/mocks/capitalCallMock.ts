export type CapitalCallStatus =
  | "FOR_REVIEW"
  | "SSI_VERIFICATION"
  | "APPROVED"
  | "REJECTED";

export type SensitivityType = "SENSITIVE" | "NON_SENSITIVE";

export interface BreakdownRow {
  id: string;
  investorName: string;
  percentage: number;
  amount: number;
}

export interface Comment {
  id: string;
  user: string;
  comment: string;
  createdAt: string;
}

export interface CapitalCallItem {
  id: string;
  aleBatchId: string;
  toeReference: string;
  fundName: string;
  fundFamily: string;
  effectiveDate: string;
  dayType?: string;
  totalAmount: number;
  currency: string;
  status: CapitalCallStatus;
  sensitivity: SensitivityType;
  lockedBy?: string | null;
  breakdown: BreakdownRow[];
  comments: Comment[];
  createdAt: string;
}

export const capitalCallMock: CapitalCallItem[] = [
  {
    id: "CC-1001",
    aleBatchId: "ALE-2026-001",
    toeReference: "TOE-77881",
    fundName: "Global Infra Fund I",
    fundFamily: "Infrastructure",
    effectiveDate: "2026-02-01",
    dayType: "Business",
    totalAmount: 5000000,
    currency: "USD",
    status: "FOR_REVIEW",
    sensitivity: "SENSITIVE",
    lockedBy: null,
    breakdown: [
      {
        id: "BR-1",
        investorName: "Blackstone Capital",
        percentage: 40,
        amount: 2000000,
      },
      {
        id: "BR-2",
        investorName: "Temasek Holdings",
        percentage: 60,
        amount: 3000000,
      },
    ],
    comments: [
      {
        id: "C-1",
        user: "Reviewer1",
        comment: "Awaiting SSI validation.",
        createdAt: "2026-02-10T10:00:00Z",
      },
    ],
    createdAt: "2026-02-09T09:30:00Z",
  },
  {
    id: "CC-1002",
    aleBatchId: "ALE-2026-002",
    toeReference: "TOE-77882",
    fundName: "Tech Growth Fund II",
    fundFamily: "Technology",
    effectiveDate: "2026-02-05",
    totalAmount: 2000000,
    currency: "USD",
    status: "SSI_VERIFICATION",
    sensitivity: "NON_SENSITIVE",
    lockedBy: "User1",
    breakdown: [
      {
        id: "BR-3",
        investorName: "Sequoia Capital",
        percentage: 100,
        amount: 2000000,
      },
    ],
    comments: [],
    createdAt: "2026-02-11T08:00:00Z",
  },
];

//implement mock API calls for capital call data
export const capitalCallMockApi = {
  //implement getCountsForSubTab that accepts subTab id and returns count for that subtab based on the mock data
  getCountForSubTab: (subTabId: string): number => {
    switch (subTabId) {
      case "SSI_VERIFICATION_NEEDED":
        return capitalCallMock.filter(cc => cc.status === "SSI_VERIFICATION").length;
      case "TRANSACTION_TO_BE_PROCESSED":
        return capitalCallMock.filter(cc => cc.status === "FOR_REVIEW").length;
      case "MISSING_FUND_DOCUMENT":
        return capitalCallMock.filter(cc => cc.status === "FOR_REVIEW" && cc.sensitivity === "SENSITIVE").length;
      case "MISSING_CLIENT_INSTRUCTION":
        return capitalCallMock.filter(cc => cc.status === "FOR_REVIEW" && cc.sensitivity === "NON_SENSITIVE").length;
      case "MISSING_CLIENT_AND_FUND_INSTRUCTION":
        return capitalCallMock.filter(cc => cc.status === "FOR_REVIEW").length;
      default:
        return 0;
    }
  },
  
  getCounts: async (queue: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Return counts based on mock data
    const counts = {
      "FOR_REVIEW": capitalCallMock.filter(cc => cc.status === "FOR_REVIEW").length,
      "SSI_VERIFICATION": capitalCallMock.filter(cc => cc.status === "SSI_VERIFICATION").length,
      "APPROVED": capitalCallMock.filter(cc => cc.status === "APPROVED").length,
      "REJECTED": capitalCallMock.filter(cc => cc.status === "REJECTED").length,
    };
    return { data: counts };
  },
  // Add more mock API methods as needed (e.g., getById, submit, approve, reject)
  getById: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const capitalCall = capitalCallMock.find(cc => cc.id === id);
    if (!capitalCall) {
      throw new Error('Capital call not found');
    }
    return { data: capitalCall };
  },
  submit: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = capitalCallMock.findIndex(cc => cc.id === id);
    if (index === -1) {
      throw new Error('Capital call not found');
    }
    capitalCallMock[index].status = "FOR_REVIEW";
    return { data: capitalCallMock[index] };
  },
  approve: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = capitalCallMock.findIndex(cc => cc.id === id);
    if (index === -1) {
      throw new Error('Capital call not found');
    }
    capitalCallMock[index].status = "APPROVED";
    return { data: capitalCallMock[index] };
  },
  reject: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = capitalCallMock.findIndex(cc => cc.id === id);
    if (index === -1) {
      throw new Error('Capital call not found');
    }
    capitalCallMock[index].status = "REJECTED";
    return { data: capitalCallMock[index] };
  },
  unlock: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = capitalCallMock.findIndex(cc => cc.id === id);
    if (index === -1) {
      throw new Error('Capital call not found');
    }
    capitalCallMock[index].lockedBy = null;
    return { data: capitalCallMock[index] };
  },
  //implement search with filters using CapitalCallSearchFilters and paginationa nd sorting
  //add page, size, sortField, sortDirection parameters to the search function
  search: async (filters: any, page: number, size: number, sortField: string | null, sortDirection: 'ASC' | 'DESC' ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let results = capitalCallMock;
    // Apply filters
    if (filters.status) {
      results = results.filter(cc => cc.status === filters.status);
    }
    if (filters.fundName) {
      results = results.filter(cc => cc.fundName.toLowerCase().includes(filters.fundName.toLowerCase()));
    }
    // Apply sorting
    if (sortField) {
      results = results.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'ASC' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'ASC' ? 1 : -1;
        return 0;
      }
      );
    }
    // Apply pagination
    const totalElements = results.length;
    const totalPages = Math.ceil(totalElements / size);
    const paginatedResults = results.slice(page * size, (page + 1) * size);
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

};

