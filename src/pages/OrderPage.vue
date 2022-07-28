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
            <q-item-label>
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
const orderPage = ref(null);
const { parseDate, formatCurrency } = useUtility();
const { fetchOrders } = useBackend();
const { dialog } = useQuasar();
const router = useRouter();
const { parseOrderStatus } = useApp();
onMounted(() => {
  fetchOrders().then((data) => {
    orderPage.value = data;
    if (data.data.length <= 0) {
      dialog({
        title: "You don't have any order yet.",
      }).onDismiss(() => {
        router.replace({ name: "lamp" });
      });
    }
  });
});
</script>
