<template>
  <q-page padding class="column" :style-fn="pageOptions">
    <div class="col scroll q-mb-sm" v-if="cartStore.getItems.length">
      <div>Tap on <strong>Text</strong> to edit Text</div>
      <div>Tap on <strong>Quantity</strong> to edit Quantity</div>
      <div class="text-right">
        <q-btn label="Clear" no-caps flat @click="clearCart" />
      </div>
      <q-markup-table :separator="'cell'" flat bordered wrap-cells dense dark>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Name</th>
            <th class="text-right">Quote</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Amount (MMK)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in cartStore.getItems" :key="item.id">
            <td class="text-left">
              {{ i + 1 }}
            </td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-right" @click="editText(item)">
              {{ item.text }}
            </td>
            <td class="text-right">{{ item.price }}</td>
            <td class="text-right">
              <q-btn
                :label="item.quantity"
                dense
                flat
                @click="editQuantity(item)"
              />
            </td>
            <td class="text-right">{{ item.price * item.quantity }}</td>
          </tr>
          <tr>
            <td class="text-right" colspan="4">Total</td>
            <td class="text-right">
              <q-btn dense flat>
                {{
                  cartStore.getItems.reduce(
                    (carry, value) => Number(value.quantity) + carry,
                    0
                  )
                }}
              </q-btn>
            </td>

            <td class="text-right">
              {{
                cartStore.getItems.reduce(
                  (carry, value) => value.quantity * value.price + carry,
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
        no-caps
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
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
const { pageOptions } = useUtility();
const cartStore = useCartStore();
const router = useRouter();
const { dialog } = useQuasar();

const editQuantity = (item) => {
  dialog({
    title: `Edit quantity of ${item.name}`,
    persistent: true,
    prompt: {
      model: item.quantity,
      type: "tel",
      label: "Quantity",
      isValid: (val) => !isNaN(Number(val)),
    },
  }).onOk((qty) => {
    if (qty != item.quantity) {
      if (qty <= 0) {
        dialog({
          title: `Remove item (${item.name}) from the shopping cart?`,
          ok: {
            label: "Yes, remove",
            flat: true,
            noCaps: true,
          },
          cancel: {
            label: "Cancel",
            flat: true,
            noCaps: true,
          },
        })
          .onOk(() => {
            cartStore.removeItem(item);
          })
          .onCancel(() => {
            editQuantity(item);
          });
      } else {
        const temp = JSON.parse(JSON.stringify(item));
        temp.quantity = qty;
        cartStore.replaceItem(temp);
      }
    }
  });
};

const clearCart = () => {
  dialog({
    title: "Remove all items from cart?",
    cancel: true,
  }).onOk(() => {
    cartStore.clearCart();
    router.go(-1);
  });
};

const editText = (item) => {
  dialog({
    title: `Edit text of ${item.name}`,
    persistent: true,
    prompt: {
      model: item.text,
      type: "text",
      label: "Custom quote (Optional)",
    },
  }).onOk((text) => {
    if (text != item.text) {
      const temp = JSON.parse(JSON.stringify(item));
      temp.text = text;
      cartStore.replaceItem(temp);
    }
  });
};

watch(cartStore.getItems, (data) => {
  if (data.length <= 0)
    router.replace({
      name: "lamp",
    });
});
onMounted(() => {
  if (cartStore.getItems.length <= 0)
    router.replace({
      name: "lamp",
    });
});
</script>
