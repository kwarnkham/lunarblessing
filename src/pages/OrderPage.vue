<template>
  <q-page padding :style-fn="pageOptions" class="column">
    <q-form
      @submit.prevent="filter"
      ref="orderFilterForm"
      class="row justify-between"
    >
      <q-input dense outlined label="id" v-model="id" class="col-5" />
      <q-input dense outlined label="mobile" v-model="mobile" class="col-5" />
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
    <q-list v-if="orderPage" class="col scroll-y">
      <template v-for="order in orderPage.data" :key="order">
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
            <q-item-label :class="{ 'text-positive': order.status == 2 }">
              {{ parseOrderStatus(order.status) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </template>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import useBackend from "src/composables/backend";
import useUtility from "src/composables/utility";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fasMagnifyingGlass } from "@quasar/extras/fontawesome-v6";
const orderPage = ref(null);
const { parseDate, formatCurrency, pageOptions } = useUtility();
const { fetchOrders } = useBackend();
const { dialog, loading } = useQuasar();
const router = useRouter();
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
const status = ref(statuses[0]);
const id = ref("");
const { parseOrderStatus } = useApp();

const filter = () => {};
onMounted(() => {
  loading.show();
  fetchOrders()
    .then((data) => {
      if (data) {
        orderPage.value = data;
      }
      if (orderPage.value.data.length <= 0) {
        dialog({
          title: "You don't have any order yet.",
        }).onDismiss(() => {
          router.replace({ name: "lamp" });
        });
      }
    })
    .finally(() => {
      loading.hide();
    });
});
</script>
