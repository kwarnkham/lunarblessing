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
        <q-icon
          :name="getStatusIcon(order.status)"
          :color="
            order.status == 4
              ? 'positive'
              : order.status == 5
              ? 'negative'
              : 'info'
          "
          size="sm"
        />
      </span>
      <div class="text-overline">({{ parseDate(order.updated_at) }})</div>
      <div class="row justify-evenly">
        <q-btn
          label="Cancel Order"
          no-caps
          @click="cancel"
          v-if="!order.screenshot && order.status == 1"
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

        <PicturesSelector
          v-model="selectedPictures"
          v-if="isAdmin(userStore.getUser) && !order.checked_screenshot"
        >
          <template #showSelectedPictures="{ showPicturesToUpload }">
            <q-btn
              no-caps
              outline
              color="accent"
              :icon="fasEye"
              @click="showPicturesToUpload"
            />
          </template>
          <template #deleteSelectedPictures="{ clearChosenImages }">
            <q-btn
              no-caps
              outline
              color="negative"
              :icon="fasTrash"
              @click="clearChosenImages"
            />
          </template>
          <template #imagePicker="{ chooseImages }">
            <q-btn
              color="indigo"
              @click="chooseImages"
              no-caps
              :label="'Upload Checked Screenshot'"
            />
          </template>
          <template #upload>
            <q-btn color="indigo" :label="'Save'" @click="uploadCheckPaid" />
          </template>
        </PicturesSelector>

        <div v-if="isAdmin(userStore.getUser) && order.checked_screenshot">
          <q-btn
            label="Show checked screenshot"
            no-caps
            @click="showCheckedScreenshot"
          />
        </div>
      </div>
      <div class="q-my-sm row justify-evenly" v-if="isAdmin(userStore.getUser)">
        <q-btn label="Update Order" no-caps @click="update" />
        <q-btn
          :icon="fasBell"
          flat
          :color="silent ? 'grey' : 'primary'"
          @click="silent = !silent"
        />
      </div>
      <q-expansion-item
        expand-separator
        label="Delivery Infomation"
        :expand-icon="fasChevronDown"
      >
        <q-card>
          <q-card-section v-if="isAdmin(userStore.getUser)">
            <q-input v-model="order.name" label="Name" />
            <q-input v-model="order.mobile" label="Mobile" />
            <q-input v-model="order.address" label="Address" type="textarea" />
            <q-input v-model="order.note" label="Note" type="textarea" />
            <div class="text-right q-mt-xs">
              <q-btn
                :icon="fasFloppyDisk"
                color="primary"
                @click="updateOrder"
              />
            </div>
          </q-card-section>
          <q-card-section v-else>
            <div>Name : {{ order.name }}</div>
            <div>Mobile : {{ order.mobile }}</div>
            <div>Address : {{ order.address }}</div>
            <div>Note : {{ order.note }}</div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <div
        class="q-pa-sm rounded-borders bg-info text-white q-mb-sm"
        v-if="order.status != 4"
      >
        We will try to process the order as soon as possible. It usually takes
        up to 2 days to deliver the order.
      </div>
      <q-markup-table :separator="'cell'" flat bordered wrap-cells dense dark>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Name</th>
            <th class="text-left">Quote</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Amount (MMK)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in order.items" :key="item.id">
            <td class="text-left">{{ i + 1 }}</td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-left" @click="editProduct(item, 'text')">
              {{ item.pivot.text }}
            </td>
            <td class="text-right" @click="editProduct(item, 'sale_price')">
              {{ formatCurrency(item.pivot.sale_price) }}
            </td>
            <td class="text-right" @click="editProduct(item, 'quantity')">
              {{ item.pivot.quantity }}
            </td>
            <td class="text-right">
              {{ formatCurrency(item.pivot.sale_price * item.pivot.quantity) }}
            </td>
          </tr>
          <tr>
            <td class="text-right" colspan="4">Total</td>
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
import PicturesSelector from "src/components/PicturesSelector";
import {
  fasChevronDown,
  fasFloppyDisk,
  fasBell,
} from "@quasar/extras/fontawesome-v6";
import { useQuasar } from "quasar";
import useApp from "src/composables/app";
import { useUserStore } from "src/stores/user";
import PaymentsDialog from "src/components/PaymentsDialog";
import PictureDialog from "src/components/PictureDialog";
import { fasEye, fasTrash } from "@quasar/extras/fontawesome-v6";

const route = useRoute();
const userStore = useUserStore();
const { parseDate, formatCurrency, copyLinkToClipboard } = useUtility();
const { isAdmin, getStatusIcon } = useApp();
const order = ref(null);
const silent = ref(false);
const { dialog, loading } = useQuasar();
const selectedPictures = ref([]);
const { infoNotify, parseOrderStatus } = useApp();
const { updateOrderStatus, updateOrderInfo, updateOrderProduct, checkPaid } =
  useBackend();
const editProduct = (item, field) => {
  dialog({
    title: `Edit ${field} of ${item.name}`,
    persistent: true,
    prompt: {
      model: item.pivot[field],
      type: "text",
      label: field,
    },
  }).onOk((value) => {
    if (value != item[field]) {
      loading.show();
      const data = {
        order_id: order.value.id,
        item_id: item.id,
        quantity: item.pivot.quantity,
        sale_price: item.pivot.sale_price,
        text: item.pivot.text,
      };
      data[field] = value;
      updateOrderProduct(data)
        .then((data) => {
          order.value = data;
        })
        .finally(() => {
          loading.hide();
        });
    }
  });
};

const uploadCheckPaid = () => {
  loading.show();
  checkPaid(order.value, { screenshot: selectedPictures.value[0] })
    .then((data) => {
      order.value = data;
      selectedPictures.value = [];
    })
    .finally(() => {
      loading.hide();
    });
};
const updateOrder = () => {
  loading.show();
  updateOrderInfo(order.value)
    .then((_) => {
      console.log(_);
    })
    .finally(() => {
      loading.hide();
    });
};
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

const showCheckedScreenshot = () => {
  if (order.value.checked_screenshot)
    dialog({
      title: "Checked screenshot",
      component: PictureDialog,
      componentProps: {
        src: `${process.env.ASSET_URL}/order_paid_checked/${order.value.checked_screenshot}`,
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
    updateOrderStatus(order.value, { status: 5 }).then((data) => {
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
    options: {
      model: order.value.status,
      type: "radio",
      items: [
        { label: "Pending", value: 1, color: "secondary" },
        { label: "Confirmed", value: 2 },
        { label: "Dispatched", value: 3 },
        { label: "Completed", value: 4 },
        { label: "Canceled", value: 5 },
      ],
    },
  }).onOk((status) => {
    if (order.value.status != status) {
      loading.show();
      updateOrderStatus(order.value, { status, silent: silent.value })
        .then((data) => {
          if (data) {
            order.value = data;
            infoNotify("Order has been updated to " + parseOrderStatus(status));
          }
        })
        .finally(() => {
          loading.hide();
        });
    }
  });
};
const { fetchAnOrder } = useBackend();
const router = useRouter();
onMounted(() => {
  loading.show();
  fetchAnOrder(route.params.id)
    .then((data) => {
      if (data) {
        order.value = data;
      } else router.replace({ name: "index" });
    })
    .finally(() => {
      loading.hide();
    });
});
</script>
