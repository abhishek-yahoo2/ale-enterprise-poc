import { capitalCallMock, capitalCallMockApi } from "../mocks/capitalCallMock";

export const useCapitalCall = () => {

  const getByStatus = (status: string) => {
    return capitalCallMock.filter(
      (item) => item.status === status
    );
  };

  const search = (filters: any) => {
    //generate capitalcallmockapi search method that accepts CapitalCallSearchFilters and pagination and sorting parameters and returns filtered data based on the filters
    //for now, just filter by aleBatchId if it exists in the filters
    console.log("SEARCH FILTERS", filters);
    return capitalCallMockApi.search(filters, 0, 10, null, 'ASC');
    
    // return capitalCallMock.filter(item =>
    //   !filters.aleBatchId || item.aleBatchId.includes(filters.aleBatchId)
    // );
  };

  return { getByStatus, search };
};
