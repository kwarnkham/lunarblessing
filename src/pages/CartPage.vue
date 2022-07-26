<template>
  <q-page padding class="column" :style-fn="pageOptions">
    <div class="col scroll q-mb-sm" v-if="getItems.length">
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
          <tr v-for="(item, i) in getItems" :key="item.id">
            <td class="text-left">{{ i + 1 }}</td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-right">{{ item.quantity }}</td>
            <td class="text-right">{{ item.price }}</td>
            <td class="text-right">{{ item.price * item.quantity }}</td>
          </tr>
          <tr>
            <td class="text-right" colspan="2">Total</td>
            <td class="text-right">
              {{ getItems.reduce((carry, value) => value.quantity + carry, 0) }}
            </td>
            <td class="text-right">
              {{ getItems.reduce((carry, value) => value.price + carry, 0) }}
            </td>
            <td class="text-right">
              {{
                getItems.reduce((carry, value) => value.price + carry, 0) *
                getItems.reduce((carry, value) => value.quantity + carry, 0)
              }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div v-if="getItems.length">
      <q-btn :label="'Checkout'" class="fit" push color="positive" />
    </div>
    <div v-else class="col flex flex-center">
      <q-btn
        label="No items in cart yet. Browse here."
        no-caps
        push
        @click="
          $router.replace({
            name: 'lamp',
          })
        "
      />
    </div>
  </q-page>
</template>

<script setup>
import useUtility from "src/composables/utility";
import { useCartStore } from "src/stores/cart";

const { pageOptions } = useUtility();
const { getItems } = useCartStore();
</script>
