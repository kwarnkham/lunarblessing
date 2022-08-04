import { computed, ref, watch } from "vue";
import useResponsePagination from "src/composables/responsePagination";
import useBackend from "./backend";

export default function useOrderList(options = {}) {
  const status = ref("1");
  const params = computed(() => ({ ...options, status: status.value }));
  const { fetchOrders } = useBackend();

  const { page, currentPage, fetchPage, max } =
    useResponsePagination(fetchOrders);

  //where it starts
  watch(currentPage, () => {
    fetchPage(params.value);
  });

  return {
    fetchOrders,
    page,
    status,
    params,
    currentPage,
    max,
  };
}
