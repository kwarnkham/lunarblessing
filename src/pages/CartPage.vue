<template>
  <q-page padding class="column" :style-fn="pageOptions">
    <div class="col scroll q-mb-sm" v-if="cartStore.getItems.length">
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
          <tr v-for="(item, i) in cartStore.getItems" :key="item.id">
            <td class="text-left">{{ i + 1 }}</td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-right">{{ item.quantity }}</td>
            <td class="text-right">{{ item.price }}</td>
            <td class="text-right">{{ item.price * item.quantity }}</td>
          </tr>
          <tr>
            <td class="text-right" colspan="2">Total</td>
            <td class="text-right">
              {{
                cartStore.getItems.reduce(
                  (carry, value) => value.quantity + carry,
                  0
                )
              }}
            </td>
            <td class="text-right">
              {{
                cartStore.getItems.reduce(
                  (carry, value) => value.price + carry,
                  0
                )
              }}
            </td>
            <td class="text-right">
              {{
                cartStore.getItems.reduce(
                  (carry, value) => value.price + carry,
                  0
                ) *
                cartStore.getItems.reduce(
                  (carry, value) => value.quantity + carry,
                  0
                )
              }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div v-if="cartStore.getItems.length">
      <q-btn
        :label="'Checkout'"
        class="fit"
        push
        color="positive"
        @click="
          $router.push({
            name: 'checkout',
          })
        "
      />
    </div>
  </q-page>
</template>

<script setup>
import useUtility from "src/composables/utility";
import { useCartStore } from "src/stores/cart";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const { pageOptions } = useUtility();
const cartStore = useCartStore();
const router = useRouter();
onMounted(() => {
  if (cartStore.getItems.length <= 0)
    router.replace({
      name: "lamp",
    });
});
</script>
