import { watch } from "vue";
import useResponsePagination from "src/composables/responsePagination";
import useBackend from "./backend";

export default function useOrderList(params) {
  const { fetchOrders } = useBackend();

  const { page, currentPage, fetchPage, fetchAppend } =
    useResponsePagination(fetchOrders);

  //where it starts
  watch(currentPage, () => {
    fetchPage(params);
  });

  return {
    fetchOrders,
    fetchAppend,
    page,
  };
}
