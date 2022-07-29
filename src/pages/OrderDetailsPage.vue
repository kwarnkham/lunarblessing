<template>
  <q-page padding v-if="order">
    <div class="text-subtitle1 text-center">Order Details</div>
    <div>
      Code:
      <q-btn
        :label="order.code"
        dense
        @click="copyLinkToClipboard(order.code)"
      />
    </div>
    <div class="text-subtitle2">
      The status of the order is
      <span class="text-weight-bold">
        "{{ parseOrderStatus(order.status) }}"
      </span>
      <div class="text-overline">({{ parseDate(order.updated_at) }})</div>
      <div
        class="row justify-around"
        v-if="order.status == 1 && !isAdmin(userStore.getUser)"
      >
        <q-btn
          label="Cancel Order"
          no-caps
          @click="cancel"
          v-if="!order.screenshot"
        />
        <q-btn
          label="Pay order"
          no-caps
          @click="showPaymentsDialog"
          v-if="!order.screenshot"
        />
        <q-btn
          label="Show paid screenshot"
          no-caps
          @click="showPaidScreenshot"
          v-else
        />
      </div>
      <div class="text-center" v-if="isAdmin(userStore.getUser)">
        <q-btn label="Update Order" no-caps @click="update" />
      </div>
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
      <div class="q-pa-sm rounded-borders bg-info text-white q-mb-sm">
        We will try to process the order as soon as possible. It usually takes
        up to 2 days to delivery the order.
      </div>
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
            <td class="text-right">
              {{ formatCurrency(item.pivot.sale_price) }}
            </td>
            <td class="text-right">
              {{ formatCurrency(item.pivot.sale_price * item.pivot.quantity) }}
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
                formatCurrency(
                  order.items.reduce(
                    (carry, value) => value.pivot.sale_price + carry,
                    0
                  )
                )
              }}
            </td>
            <td class="text-right">
              {{
                formatCurrency(
                  order.items.reduce(
                    (carry, value) => value.pivot.sale_price + carry,
                    0
                  ) *
                    order.items.reduce(
                      (carry, value) => value.pivot.quantity + carry,
                      0
                    )
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
import { useRoute, useRouter } from "vue-router";
import { fasChevronDown } from "@quasar/extras/fontawesome-v6";
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import { useUserStore } from "src/stores/user";
import PaymentsDialog from "src/components/PaymentsDialog";
import PictureDialog from "src/components/PictureDialog";

const route = useRoute();
const userStore = useUserStore();
const { parseDate, isAdmin, formatCurrency, copyLinkToClipboard } =
  useUtility();
const order = ref(null);
const { dialog } = useQuasar();
const { infoNotify, parseOrderStatus } = useApp();
const { updateOrder } = useBackend();

const showPaymentsDialog = () => {
  dialog({
    component: PaymentsDialog,
    componentProps: {
      order: order.value,
    },
  }).onOk((data) => {
    order.value = data;
  });
};
const showPaidScreenshot = () => {
  if (order.value.screenshot)
    dialog({
      title: "Paid screenshot",
      component: PictureDialog,
      componentProps: {
        src: `${process.env.ASSET_URL}/order_paid/${order.value.screenshot}`,
      },
    });
};
const cancel = () => {
  dialog({
    title: "Cancel the order? :-(",
    cancel: {
      label: "No, keep it",
      noCaps: true,
    },
    ok: {
      label: "Yes, cancel it",
      noCaps: true,
    },
  }).onOk(() => {
    updateOrder(order.value, { status: 5 }).then((data) => {
      if (data) {
        order.value = data;
        infoNotify("Order has been canceled");
      }
    });
  });
};
const update = () => {
  dialog({
    title: "Update order status",
    prompt: {
      model: order.value.status,
      type: "tel",
      isValid: (val) => [1, 2, 3, 4, 5].includes(Number(val)),
    },
  }).onOk((status) => {
    if (order.value.status != status)
      updateOrder(order.value, { status }).then((data) => {
        if (data) {
          order.value = data;
          infoNotify("Order has been updated to " + parseOrderStatus(status));
        }
      });
  });
};
const { fetchAnOrder } = useBackend();
const router = useRouter();
onMounted(() => {
  fetchAnOrder(route.params.id).then((data) => {
    if (data) order.value = data;
    else router.replace({ name: "index" });
  });
});
</script>
