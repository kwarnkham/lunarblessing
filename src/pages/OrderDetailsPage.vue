<template>
  <q-page padding v-if="order">
    <div class="text-subtitle1 text-center">Order Details</div>
    <div class="text-subtitle2">
      The status of the order is
      <span class="text-weight-bold">
        "{{ parseOrderStatus(order.status) }}"
      </span>
      <div class="text-overline">({{ parseDate(order.updated_at) }})</div>
      <q-expansion-item
        expand-separator
        label="Delivery Infomation"
        :expand-icon="fasChevronDown"
      >
        <q-card>
          <q-card-section>
            <div>Name : {{ order.name }}</div>
            <div>Mobile : {{ order.mobile }}</div>
            <div>Address : {{ order.address }}</div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-markup-table :separator="'cell'" flat bordered wrap-cells dense dark>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Name</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Amount (MMK)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in order.items" :key="item.id">
            <td class="text-left">{{ i + 1 }}</td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-right">{{ item.pivot.quantity }}</td>
            <td class="text-right">{{ item.pivot.sale_price }}</td>
            <td class="text-right">
              {{ item.pivot.sale_price * item.pivot.quantity }}
            </td>
          </tr>
          <tr>
            <td class="text-right" colspan="2">Total</td>
            <td class="text-right">
              {{
                order.items.reduce(
                  (carry, value) => value.pivot.quantity + carry,
                  0
                )
              }}
            </td>
            <td class="text-right">
              {{
                order.items.reduce(
                  (carry, value) => value.pivot.sale_price + carry,
                  0
                )
              }}
            </td>
            <td class="text-right">
              {{
                order.items.reduce(
                  (carry, value) => value.pivot.sale_price + carry,
                  0
                ) *
                order.items.reduce(
                  (carry, value) => value.pivot.quantity + carry,
                  0
                )
              }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>

<script setup>
import useBackend from "src/composables/backend";
import useUtility from "src/composables/utility";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { fasChevronDown } from "@quasar/extras/fontawesome-v6";
const route = useRoute();
const { parseDate } = useUtility();
const order = ref(null);
const parseOrderStatus = (status) => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Confirmed";
    case 3:
      return "Dispatched";
    case 4:
      return "Completed";
    case 5:
      return "Canceled";
    default:
      console.warn("unknown order status");
      return status;
  }
};
const { fetchAnOrder } = useBackend();
onMounted(() => {
  fetchAnOrder(route.params.id).then((data) => (order.value = data));
});
</script>
