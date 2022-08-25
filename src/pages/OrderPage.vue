<template>
  <q-page padding :style-fn="pageOptions" class="column bg-grey-4">
    <q-form
      @submit.prevent="filter"
      ref="orderFilterForm"
      class="row justify-between"
    >
      <q-input dense outlined label="Code" v-model="code" class="col-6" />
      <q-input dense outlined label="Mobile" v-model="mobile" class="col-6" />
      <q-select
        outlined
        v-model="status"
        class="col-12 q-mt-xs"
        dense
        :options="statuses"
        label="Status"
        hide-dropdown-icon
      />
      <div class="col-12 text-center">
        <q-btn :icon="fasMagnifyingGlass" type="submit" flat dense />
      </div>
    </q-form>
    <q-list
      v-if="page"
      class="col scroll-y"
      v-scroll="debounce(fetchMore, 300)"
    >
      <template v-for="order in page.data" :key="order">
        <q-item
          clickable
          @click="
            $router.push({
              name: 'orderDetails',
              params: {
                id: order.id,
              },
            })
          "
        >
          <q-item-section>
            <q-item-label>
              Code : <strong>{{ order.code }}</strong>
            </q-item-label>
            <q-item-label caption lines="3">
              The amount of this order is
              {{
                formatCurrency(
                  order.items.reduce(
                    (carry, el) => el.pivot.sale_price + carry,
                    0
                  )
                )
              }}
              MMK. There are
              {{
                order.items.reduce((carry, el) => el.pivot.quantity + carry, 0)
              }}
              item(s) in total.
            </q-item-label>
            <q-item-label>
              {{ parseDate(order.updated_at) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label
              :class="{
                'text-positive': order.status == 4,
                'text-negative': order.status == 5,
              }"
              class="text-info"
            >
              {{ parseOrderStatus(order.status) }}
            </q-item-label>
            <q-item-label>
              <q-icon
                :name="getStatusIcon(order.status)"
                size="sm"
                :color="
                  order.status == 4
                    ? 'positive'
                    : order.status == 5
                    ? 'negative'
                    : 'info'
                "
              />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </template>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar, debounce } from "quasar";
import useApp from "src/composables/app";
import useUtility from "src/composables/utility";
import { computed, ref, watch } from "vue";
import { fasMagnifyingGlass } from "@quasar/extras/fontawesome-v6";
import useOrderList from "src/composables/orderList.js";
import { useUserStore } from "src/stores/user";
const { parseDate, formatCurrency, pageOptions } = useUtility();
const { dialog, loading, localStorage } = useQuasar();

const userStore = useUserStore();
const mobile = ref("");
const statuses = [
  {
    label: "All",
    value: 0,
  },
  {
    label: "Pending",
    value: 1,
  },
  {
    label: "Confirmed",
    value: 2,
  },
  {
    label: "Dispatched",
    value: 3,
  },
  {
    label: "Completed",
    value: 4,
  },
  {
    label: "Canceled",
    value: 5,
  },
];
const status = ref(localStorage.getItem("orderStatusFilter") ?? statuses[0]);
const code = ref("");
const { parseOrderStatus, getStatusIcon } = useApp();
const { isAdmin } = useApp();
const params = computed(() => ({
  order_in: isAdmin(userStore.getUser) ? "asc" : "desc",
  per_page: "20",
  status: status.value.value,
  mobile: mobile.value,
  code: code.value,
}));
const fetchMore = (verticalScrollPosition) => {
  const el = document.querySelector(".scroll-y");
  if (el.scrollHeight - 100 <= verticalScrollPosition + el.clientHeight) {
    fetchAppend(params.value);
  }
};
const filter = () => {
  loading.show();
  fetchOrders(params.value)
    .then((response) => {
      if (response) page.value = response;
    })
    .finally(() => {
      loading.hide();
    });
};
const { page, fetchOrders, fetchAppend } = useOrderList(params.value);
watch(page, () => {
  if (page.value?.data.length <= 0) {
    dialog({
      title: "No order found",
    });
  }
});
watch(status, () => {
  localStorage.set("orderStatusFilter", status.value);
});
</script>
