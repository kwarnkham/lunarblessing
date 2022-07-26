<template>
  <q-page padding>
    <q-list v-if="orderPage">
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
            <q-item-label>Status: {{ order.status }}</q-item-label>
            <q-item-label caption lines="3">
              The amount of this order is
              {{
                order.items.reduce(
                  (carry, el) => el.pivot.sale_price + carry,
                  0
                )
              }}. There are
              {{
                order.items.reduce((carry, el) => el.pivot.quantity + carry, 0)
              }}
              item(s) in total.
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              {{ parseDate(order.updated_at) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </template>
    </q-list>
  </q-page>
</template>

<script setup>
import useBackend from "src/composables/backend";
import useUtility from "src/composables/utility";
import { onMounted, ref } from "vue";
const orderPage = ref(null);
const { parseDate } = useUtility();
const { fetchOrders } = useBackend();
onMounted(() => {
  fetchOrders().then((data) => {
    orderPage.value = data;
  });
});
</script>
