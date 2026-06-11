<script setup>
import { computed, ref } from 'vue'

import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'

const search = ref('')
const poDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const supplierOptions = ref([
  'Royce Coffee Supply',
  'Daily Dairy Supplier',
  'Milk Tea Depot',
  'Flavor Hub PH',
  'Packaging Depot',
  'Local Market Supplier'
])

const itemOptions = ref([
  'Arabica Coffee Beans',
  'Fresh Milk',
  'Vanilla Syrup',
  'Tapioca Pearls',
  'Whipped Cream',
  'Rice',
  'Egg',
  'Food Packaging Cup'
])

const unitOptions = ref(['Kg', 'Gram', 'Liter', 'Milliliter', 'Piece', 'Pack', 'Bottle', 'Can'])
const statusOptions = ref(['Draft', 'Pending Approval', 'Approved', 'Partially Received', 'Received', 'Cancelled'])

const emptyPoItem = {
  item: '',
  quantity: 0,
  unit: '',
  unitCost: 0
}

const emptyPurchaseOrder = {
  id: null,
  poNo: '',
  supplier: '',
  orderDate: '',
  expectedDate: '',
  status: 'Draft',
  requestedBy: '',
  discount: 0,
  tax: 0,
  shippingFee: 0,
  notes: '',
  items: []
}

const purchaseOrder = ref({ ...emptyPurchaseOrder })

const purchaseOrders = ref([
  {
    id: 1,
    poNo: 'PO-2026-0001',
    supplier: 'Royce Coffee Supply',
    orderDate: '2026-06-01',
    expectedDate: '2026-06-05',
    status: 'Approved',
    requestedBy: 'Inventory Staff',
    discount: 0,
    tax: 0,
    shippingFee: 300,
    notes: 'Monthly coffee bean restock.',
    items: [
      { item: 'Arabica Coffee Beans', quantity: 25, unit: 'Kg', unitCost: 450 },
      { item: 'Vanilla Syrup', quantity: 12, unit: 'Bottle', unitCost: 280 }
    ]
  },
  {
    id: 2,
    poNo: 'PO-2026-0002',
    supplier: 'Daily Dairy Supplier',
    orderDate: '2026-06-03',
    expectedDate: '2026-06-04',
    status: 'Received',
    requestedBy: 'Admin User',
    discount: 150,
    tax: 0,
    shippingFee: 0,
    notes: 'Fresh milk delivery for weekend operations.',
    items: [
      { item: 'Fresh Milk', quantity: 24, unit: 'Liter', unitCost: 95 },
      { item: 'Whipped Cream', quantity: 10, unit: 'Can', unitCost: 210 }
    ]
  },
  {
    id: 3,
    poNo: 'PO-2026-0003',
    supplier: 'Packaging Depot',
    orderDate: '2026-06-08',
    expectedDate: '2026-06-12',
    status: 'Pending Approval',
    requestedBy: 'Inventory Staff',
    discount: 0,
    tax: 0,
    shippingFee: 250,
    notes: 'Packaging supplies for takeout orders.',
    items: [
      { item: 'Food Packaging Cup', quantity: 20, unit: 'Pack', unitCost: 125 }
    ]
  }
])

const getSubtotal = (data) => {
  return data.items.reduce((total, item) => {
    return total + Number(item.quantity || 0) * Number(item.unitCost || 0)
  }, 0)
}

const getGrandTotal = (data) => {
  return (
    getSubtotal(data) -
    Number(data.discount || 0) +
    Number(data.tax || 0) +
    Number(data.shippingFee || 0)
  )
}

const getTotalQuantity = (data) => {
  return data.items.reduce((total, item) => total + Number(item.quantity || 0), 0)
}

const filteredPurchaseOrders = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return purchaseOrders.value

  return purchaseOrders.value.filter((item) =>
    item.poNo.toLowerCase().includes(keyword) ||
    item.supplier.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.requestedBy.toLowerCase().includes(keyword) ||
    item.notes.toLowerCase().includes(keyword)
  )
})

const totalPurchaseOrders = computed(() => purchaseOrders.value.length)
const pendingPurchaseOrders = computed(() =>
  purchaseOrders.value.filter((item) => item.status === 'Pending Approval').length
)
const approvedPurchaseOrders = computed(() =>
  purchaseOrders.value.filter((item) => item.status === 'Approved').length
)
const totalPurchaseValue = computed(() =>
  purchaseOrders.value.reduce((total, item) => total + getGrandTotal(item), 0)
)

const generatePoNo = () => {
  const nextNumber = String(purchaseOrders.value.length + 1).padStart(4, '0')
  return `PO-2026-${nextNumber}`
}

const openNew = () => {
  purchaseOrder.value = {
    ...emptyPurchaseOrder,
    poNo: generatePoNo(),
    orderDate: new Date().toISOString().slice(0, 10),
    items: [{ ...emptyPoItem }]
  }

  submitted.value = false
  isEditMode.value = false
  poDialog.value = true
}

const editPurchaseOrder = (data) => {
  purchaseOrder.value = {
    ...data,
    items: data.items?.length ? data.items.map((item) => ({ ...item })) : [{ ...emptyPoItem }]
  }

  submitted.value = false
  isEditMode.value = true
  poDialog.value = true
}

const hideDialog = () => {
  poDialog.value = false
  submitted.value = false
}

const addPoItem = () => {
  purchaseOrder.value.items.push({ ...emptyPoItem })
}

const removePoItem = (index) => {
  purchaseOrder.value.items.splice(index, 1)

  if (!purchaseOrder.value.items.length) {
    purchaseOrder.value.items.push({ ...emptyPoItem })
  }
}

const savePurchaseOrder = () => {
  submitted.value = true

  if (
    !purchaseOrder.value.poNo.trim() ||
    !purchaseOrder.value.supplier ||
    !purchaseOrder.value.orderDate
  ) {
    return
  }

  const payload = {
    ...purchaseOrder.value,
    discount: Number(purchaseOrder.value.discount || 0),
    tax: Number(purchaseOrder.value.tax || 0),
    shippingFee: Number(purchaseOrder.value.shippingFee || 0),
    items: purchaseOrder.value.items.filter((item) =>
      item.item || Number(item.quantity) > 0 || item.unit || Number(item.unitCost) > 0
    )
  }

  if (isEditMode.value) {
    const index = purchaseOrders.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      purchaseOrders.value[index] = payload
    }
  } else {
    purchaseOrders.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  poDialog.value = false
  purchaseOrder.value = { ...emptyPurchaseOrder }
}

const confirmDeletePurchaseOrder = (data) => {
  purchaseOrder.value = { ...data }
  deleteDialog.value = true
}

const deletePurchaseOrder = () => {
  purchaseOrders.value = purchaseOrders.value.filter((item) => item.id !== purchaseOrder.value.id)
  deleteDialog.value = false
  purchaseOrder.value = { ...emptyPurchaseOrder }
}

const approvePurchaseOrder = (data) => {
  data.status = 'Approved'
}

const markAsReceived = (data) => {
  data.status = 'Received'
}

const cancelPurchaseOrder = (data) => {
  data.status = 'Cancelled'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(value || 0)
}

const formatDate = (value) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(value))
}

const getStatusSeverity = (status) => {
  if (status === 'Received' || status === 'Approved') return 'success'
  if (status === 'Pending Approval' || status === 'Draft') return 'warning'
  if (status === 'Partially Received') return 'info'
  return 'secondary'
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Procurement Management</span>
        <h1 class="page-title">Purchase Orders</h1>
        <p class="page-subtitle">
          Create and manage supplier purchase orders, requested items, expected delivery dates,
          approval status, and receiving progress.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="New Purchase Order" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total POs</span>
          <strong>{{ totalPurchaseOrders }}</strong>
        </div>
        <i class="pi pi-file"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Pending Approval</span>
          <strong>{{ pendingPurchaseOrders }}</strong>
        </div>
        <i class="pi pi-clock"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Approved</span>
          <strong>{{ approvedPurchaseOrders }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Total PO Value</span>
          <strong>{{ formatCurrency(totalPurchaseValue) }}</strong>
        </div>
        <i class="pi pi-wallet"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Purchase Order List</h3>
          <p>View, search, create, edit, approve, receive, cancel, or delete purchase orders.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search purchase order..." />
        </div>
      </div>

      <DataTable
        :value="filteredPurchaseOrders"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 84rem"
      >
        <Column field="poNo" header="PO No." sortable>
          <template #body="slotProps">
            <div class="category-name">
              <strong>{{ slotProps.data.poNo }}</strong>
              <span>{{ slotProps.data.notes }}</span>
            </div>
          </template>
        </Column>

        <Column field="supplier" header="Supplier" sortable />

        <Column field="orderDate" header="Order Date" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.orderDate) }}
          </template>
        </Column>

        <Column field="expectedDate" header="Expected Date" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.expectedDate) }}
          </template>
        </Column>

        <Column header="Items">
          <template #body="slotProps">
            {{ slotProps.data.items.length }} item(s)
          </template>
        </Column>

        <Column header="Qty">
          <template #body="slotProps">
            {{ getTotalQuantity(slotProps.data) }}
          </template>
        </Column>

        <Column header="Grand Total">
          <template #body="slotProps">
            {{ formatCurrency(getGrandTotal(slotProps.data)) }}
          </template>
        </Column>

        <Column field="requestedBy" header="Requested By" sortable />

        <Column field="status" header="Status" sortable>
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
          </template>
        </Column>

        <Column header="Actions">
          <template #body="slotProps">
            <div class="action-buttons">
              <Button
                v-if="slotProps.data.status === 'Pending Approval' || slotProps.data.status === 'Draft'"
                icon="pi pi-check"
                rounded
                text
                severity="secondary"
                aria-label="Approve purchase order"
                @click="approvePurchaseOrder(slotProps.data)"
              />
              <Button
                v-if="slotProps.data.status === 'Approved' || slotProps.data.status === 'Partially Received'"
                icon="pi pi-inbox"
                rounded
                text
                severity="secondary"
                aria-label="Mark as received"
                @click="markAsReceived(slotProps.data)"
              />
              <Button
                v-if="slotProps.data.status !== 'Cancelled' && slotProps.data.status !== 'Received'"
                icon="pi pi-ban"
                rounded
                text
                severity="secondary"
                aria-label="Cancel purchase order"
                @click="cancelPurchaseOrder(slotProps.data)"
              />
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="secondary"
                aria-label="Edit purchase order"
                @click="editPurchaseOrder(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete purchase order"
                @click="confirmDeletePurchaseOrder(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No purchase orders found.</p>
            <span>Try another keyword or create a new purchase order.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="poDialog"
      modal
      :header="isEditMode ? 'Edit Purchase Order' : 'New Purchase Order'"
      :style="{ width: '58rem' }"
      :breakpoints="{ '960px': '85vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="poNo">PO No.</label>
          <InputText
            id="poNo"
            v-model="purchaseOrder.poNo"
            placeholder="Example: PO-2026-0001"
            :invalid="submitted && !purchaseOrder.poNo"
          />
          <small v-if="submitted && !purchaseOrder.poNo">PO number is required.</small>
        </div>

        <div class="field">
          <label for="supplier">Supplier</label>
          <Select
            id="supplier"
            v-model="purchaseOrder.supplier"
            :options="supplierOptions"
            placeholder="Select supplier"
            :invalid="submitted && !purchaseOrder.supplier"
          />
          <small v-if="submitted && !purchaseOrder.supplier">Supplier is required.</small>
        </div>

        <div class="field">
          <label for="orderDate">Order Date</label>
          <InputText
            id="orderDate"
            v-model="purchaseOrder.orderDate"
            type="date"
            :invalid="submitted && !purchaseOrder.orderDate"
          />
          <small v-if="submitted && !purchaseOrder.orderDate">Order date is required.</small>
        </div>

        <div class="field">
          <label for="expectedDate">Expected Date</label>
          <InputText
            id="expectedDate"
            v-model="purchaseOrder.expectedDate"
            type="date"
          />
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="purchaseOrder.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field">
          <label for="requestedBy">Requested By</label>
          <InputText
            id="requestedBy"
            v-model="purchaseOrder.requestedBy"
            placeholder="Example: Inventory Staff"
          />
        </div>

        <div class="field form-span">
          <div class="line-items-header">
            <div>
              <label>Purchase Items</label>
              <p>Add requested items, quantities, units, and supplier unit cost.</p>
            </div>

            <Button
              label="Add Item"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              outlined
              @click="addPoItem"
            />
          </div>

          <div class="line-items-list">
            <div
              v-for="(item, index) in purchaseOrder.items"
              :key="index"
              class="line-item-row"
            >
              <Select v-model="item.item" :options="itemOptions" placeholder="Item" />

              <InputNumber
                v-model="item.quantity"
                placeholder="Qty"
                inputClass="full-input"
                :min="0"
                :minFractionDigits="0"
                :maxFractionDigits="2"
              />

              <Select v-model="item.unit" :options="unitOptions" placeholder="Unit" />

              <InputNumber
                v-model="item.unitCost"
                mode="currency"
                currency="PHP"
                locale="en-PH"
                placeholder="Unit Cost"
                inputClass="full-input"
                :min="0"
              />

              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Remove item"
                @click="removePoItem(index)"
              />
            </div>
          </div>
        </div>

        <div class="field">
          <label for="discount">Discount</label>
          <InputNumber
            id="discount"
            v-model="purchaseOrder.discount"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="tax">Tax</label>
          <InputNumber
            id="tax"
            v-model="purchaseOrder.tax"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="shippingFee">Shipping Fee</label>
          <InputNumber
            id="shippingFee"
            v-model="purchaseOrder.shippingFee"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label>Grand Total</label>
          <div class="readonly-total">
            {{ formatCurrency(getGrandTotal(purchaseOrder)) }}
          </div>
        </div>

        <div class="field form-span">
          <label for="notes">Notes</label>
          <Textarea
            id="notes"
            v-model="purchaseOrder.notes"
            rows="4"
            autoResize
            placeholder="Short purchase order notes..."
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="dialog-total">
            <span>PO Grand Total</span>
            <strong>{{ formatCurrency(getGrandTotal(purchaseOrder)) }}</strong>
          </div>

          <div class="dialog-actions">
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save Purchase Order" icon="pi pi-check" @click="savePurchaseOrder" />
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Purchase Order"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ purchaseOrder.poNo }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deletePurchaseOrder" />
      </template>
    </Dialog>
  </section>
</template>

<style scoped>
.categories-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  overflow: hidden;
  position: relative;
}

.hero-card::after {
  content: '';
  position: absolute;
  right: -80px;
  top: -110px;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.12);
}

.eyebrow {
  display: inline-flex;
  margin-bottom: 12px;
  color: #4f46e5;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.stat-box span {
  display: block;
  color: #64748b;
  font-size: 0.86rem;
  font-weight: 700;
}

.stat-box strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.stat-box i {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 16px;
  font-size: 1.25rem;
}

.table-card {
  padding: 18px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.card-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
}

.card-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  padding: 0 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.search-box i {
  color: #94a3b8;
}

.search-box :deep(.p-inputtext) {
  width: 100%;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.category-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-name strong {
  color: #0f172a;
  font-weight: 800;
}

.category-name span {
  color: #64748b;
  font-size: 0.86rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-span {
  grid-column: span 2;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  color: #0f172a;
  font-size: 0.88rem;
  font-weight: 800;
}

.field small {
  color: #dc2626;
  font-size: 0.8rem;
}

.full-input {
  width: 100%;
}

.line-items-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.line-items-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
}

.line-items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.line-item-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px 130px 150px auto;
  gap: 10px;
  align-items: center;
}

.readonly-total {
  padding: 11px 12px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 900;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.dialog-total span {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
}

.dialog-total strong {
  display: block;
  margin-top: 4px;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
}

.dialog-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: #64748b;
}

.empty-state i {
  display: block;
  margin-bottom: 10px;
  color: #94a3b8;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0;
  color: #0f172a;
  font-weight: 800;
}

.empty-state span {
  display: block;
  margin-top: 4px;
  font-size: 0.88rem;
}

.delete-message {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.delete-message i {
  color: #f59e0b;
  font-size: 1.5rem;
}

.delete-message p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hero-card,
  .card-header,
  .line-items-header,
  .dialog-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .hero-actions :deep(.p-button) {
    flex: 1 1 160px;
  }

  .stats-grid,
  .form-grid,
  .line-item-row {
    grid-template-columns: 1fr;
  }

  .form-span {
    grid-column: span 1;
  }

  .search-box {
    width: 100%;
    min-width: 0;
  }

  .dialog-actions {
    width: 100%;
    flex-direction: column-reverse;
  }

  .dialog-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>