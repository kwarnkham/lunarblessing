<template>
  <q-page padding class="column" :style-fn="pageOptions">
    <div class="col scroll q-mb-sm">
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
          <tr v-for="i in 100" :key="i">
            <td class="text-left">Frozen Yogurt</td>
            <td class="text-left">159</td>
            <td class="text-right">6</td>
            <td class="text-right">24</td>
            <td class="text-right">4</td>
          </tr>
          <tr>
            <td class="text-right" colspan="2">Total</td>
            <td class="text-right">24</td>
            <td class="text-right">24</td>
            <td class="text-right">4</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div>
      <q-btn :label="'Checkout'" class="fit" push color="positive" />
    </div>
  </q-page>
</template>

<script setup>
import useUtility from "src/composables/utility";

const { pageOptions } = useUtility();
</script>
