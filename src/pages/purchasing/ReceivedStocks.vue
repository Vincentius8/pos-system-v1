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
const receivedDialog = ref(false)
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

const poOptions = ref([
  'PO-2026-0001',
  'PO-2026-0002',
  'PO-2026-0003',
  'Manual Receiving'
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

const statusOptions = ref(['Pending Check', 'Accepted', 'Partially Accepted', 'Rejected'])

const conditionOptions = ref(['Good', 'Damaged', 'Expired', 'Wrong Item', 'Short Quantity'])

const emptyReceivedItem = {
  item: '',
  orderedQty: 0,
  receivedQty: 0,
  rejectedQty: 0,
  unit: '',
  unitCost: 0,
  batchNo: '',
  expiryDate: '',
  condition: 'Good'
}

const emptyReceivedStock = {
  id: null,
  receivingNo: '',
  poNo: '',
  supplier: '',
  receivedDate: '',
  checkedBy: '',
  status: 'Pending Check',
  remarks: '',
  items: []
}

const receivedStock = ref({ ...emptyReceivedStock })

const receivedStocks = ref([
  {
    id: 1,
    receivingNo: 'RS-2026-0001',
    poNo: 'PO-2026-0001',
    supplier: 'Royce Coffee Supply',
    receivedDate: '2026-06-05',
    checkedBy: 'Inventory Staff',
    status: 'Accepted',
    remarks: 'All coffee supplies received in good condition.',
    items: [
      {
        item: 'Arabica Coffee Beans',
        orderedQty: 25,
        receivedQty: 25,
        rejectedQty: 0,
        unit: 'Kg',
        unitCost: 450,
        batchNo: 'BCH-COF-001',
        expiryDate: '2026-12-30',
        condition: 'Good'
      },
      {
        item: 'Vanilla Syrup',
        orderedQty: 12,
        receivedQty: 12,
        rejectedQty: 0,
        unit: 'Bottle',
        unitCost: 280,
        batchNo: 'BCH-SYR-001',
        expiryDate: '2027-01-15',
        condition: 'Good'
      }
    ]
  },
  {
    id: 2,
    receivingNo: 'RS-2026-0002',
    poNo: 'PO-2026-0002',
    supplier: 'Daily Dairy Supplier',
    receivedDate: '2026-06-04',
    checkedBy: 'Admin User',
    status: 'Partially Accepted',
    remarks: 'Two cans of whipped cream were damaged upon delivery.',
    items: [
      {
        item: 'Fresh Milk',
        orderedQty: 24,
        receivedQty: 24,
        rejectedQty: 0,
        unit: 'Liter',
        unitCost: 95,
        batchNo: 'MILK-0604',
        expiryDate: '2026-06-14',
        condition: 'Good'
      },
      {
        item: 'Whipped Cream',
        orderedQty: 10,
        receivedQty: 8,
        rejectedQty: 2,
        unit: 'Can',
        unitCost: 210,
        batchNo: 'CREAM-0604',
        expiryDate: '2026-08-20',
        condition: 'Damaged'
      }
    ]
  },
  {
    id: 3,
    receivingNo: 'RS-2026-0003',
    poNo: 'Manual Receiving',
    supplier: 'Local Market Supplier',
    receivedDate: '2026-06-08',
    checkedBy: 'Inventory Staff',
    status: 'Pending Check',
    remarks: 'For quality checking before posting to inventory.',
    items: [
      {
        item: 'Rice',
        orderedQty: 50,
        receivedQty: 50,
        rejectedQty: 0,
        unit: 'Kg',
        unitCost: 62,
        batchNo: 'RICE-0608',
        expiryDate: '2027-01-01',
        condition: 'Good'
      },
      {
        item: 'Egg',
        orderedQty: 120,
        receivedQty: 118,
        rejectedQty: 2,
        unit: 'Piece',
        unitCost: 9,
        batchNo: 'EGG-0608',
        expiryDate: '2026-06-22',
        condition: 'Short Quantity'
      }
    ]
  }
])

const getTotalReceivedQty = (data) => {
  return data.items.reduce((total, item) => total + Number(item.receivedQty || 0), 0)
}

const getTotalRejectedQty = (data) => {
  return data.items.reduce((total, item) => total + Number(item.rejectedQty || 0), 0)
}

const getReceivedValue = (data) => {
  return data.items.reduce((total, item) => {
    return total + Number(item.receivedQty || 0) * Number(item.unitCost || 0)
  }, 0)
}

const getRejectedValue = (data) => {
  return data.items.reduce((total, item) => {
    return total + Number(item.rejectedQty || 0) * Number(item.unitCost || 0)
  }, 0)
}

const filteredReceivedStocks = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return receivedStocks.value

  return receivedStocks.value.filter((item) =>
    item.receivingNo.toLowerCase().includes(keyword) ||
    item.poNo.toLowerCase().includes(keyword) ||
    item.supplier.toLowerCase().includes(keyword) ||
    item.checkedBy.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.remarks.toLowerCase().includes(keyword)
  )
})

const totalReceivedRecords = computed(() => receivedStocks.value.length)

const acceptedRecords = computed(() =>
  receivedStocks.value.filter((item) => item.status === 'Accepted').length
)

const pendingRecords = computed(() =>
  receivedStocks.value.filter((item) => item.status === 'Pending Check').length
)

const totalReceivedValue = computed(() =>
  receivedStocks.value.reduce((total, item) => total + getReceivedValue(item), 0)
)

const generateReceivingNo = () => {
  const nextNumber = String(receivedStocks.value.length + 1).padStart(4, '0')
  return `RS-2026-${nextNumber}`
}

const openNew = () => {
  receivedStock.value = {
    ...emptyReceivedStock,
    receivingNo: generateReceivingNo(),
    receivedDate: new Date().toISOString().slice(0, 10),
    items: [{ ...emptyReceivedItem }]
  }

  submitted.value = false
  isEditMode.value = false
  receivedDialog.value = true
}

const editReceivedStock = (data) => {
  receivedStock.value = {
    ...data,
    items: data.items?.length
      ? data.items.map((item) => ({ ...item }))
      : [{ ...emptyReceivedItem }]
  }

  submitted.value = false
  isEditMode.value = true
  receivedDialog.value = true
}

const hideDialog = () => {
  receivedDialog.value = false
  submitted.value = false
}

const addReceivedItem = () => {
  receivedStock.value.items.push({ ...emptyReceivedItem })
}

const removeReceivedItem = (index) => {
  receivedStock.value.items.splice(index, 1)

  if (!receivedStock.value.items.length) {
    receivedStock.value.items.push({ ...emptyReceivedItem })
  }
}

const saveReceivedStock = () => {
  submitted.value = true

  if (
    !receivedStock.value.receivingNo.trim() ||
    !receivedStock.value.supplier ||
    !receivedStock.value.receivedDate
  ) {
    return
  }

  const payload = {
    ...receivedStock.value,
    items: receivedStock.value.items.filter((item) =>
      item.item ||
      Number(item.orderedQty) > 0 ||
      Number(item.receivedQty) > 0 ||
      Number(item.rejectedQty) > 0 ||
      item.unit ||
      Number(item.unitCost) > 0
    )
  }

  if (isEditMode.value) {
    const index = receivedStocks.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      receivedStocks.value[index] = payload
    }
  } else {
    receivedStocks.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  receivedDialog.value = false
  receivedStock.value = { ...emptyReceivedStock }
}

const confirmDeleteReceivedStock = (data) => {
  receivedStock.value = { ...data }
  deleteDialog.value = true
}

const deleteReceivedStock = () => {
  receivedStocks.value = receivedStocks.value.filter((item) => item.id !== receivedStock.value.id)
  deleteDialog.value = false
  receivedStock.value = { ...emptyReceivedStock }
}

const acceptReceivedStock = (data) => {
  data.status = 'Accepted'
}

const rejectReceivedStock = (data) => {
  data.status = 'Rejected'
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
  if (status === 'Accepted') return 'success'
  if (status === 'Partially Accepted') return 'info'
  if (status === 'Pending Check') return 'warning'
  return 'danger'
}

const getConditionSeverity = (condition) => {
  return condition === 'Good' ? 'success' : 'warning'
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Procurement Receiving</span>
        <h1 class="page-title">Received Stocks</h1>
        <p class="page-subtitle">
          Track received deliveries from suppliers, validate ordered versus received quantities,
          record rejected items, batch numbers, expiry dates, and quality condition.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="New Receiving" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Receipts</span>
          <strong>{{ totalReceivedRecords }}</strong>
        </div>
        <i class="pi pi-inbox"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Accepted</span>
          <strong>{{ acceptedRecords }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Pending Check</span>
          <strong>{{ pendingRecords }}</strong>
        </div>
        <i class="pi pi-clock"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Received Value</span>
          <strong>{{ formatCurrency(totalReceivedValue) }}</strong>
        </div>
        <i class="pi pi-wallet"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Received Stock Records</h3>
          <p>View, search, create, edit, accept, reject, or delete received delivery records.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search received stock..." />
        </div>
      </div>

      <DataTable
        :value="filteredReceivedStocks"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 84rem"
      >
        <Column field="receivingNo" header="Receiving No." sortable>
          <template #body="slotProps">
            <div class="category-name">
              <strong>{{ slotProps.data.receivingNo }}</strong>
              <span>{{ slotProps.data.remarks }}</span>
            </div>
          </template>
        </Column>

        <Column field="poNo" header="PO No." sortable />
        <Column field="supplier" header="Supplier" sortable />

        <Column field="receivedDate" header="Received Date" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.receivedDate) }}
          </template>
        </Column>

        <Column header="Items">
          <template #body="slotProps">
            {{ slotProps.data.items.length }} item(s)
          </template>
        </Column>

        <Column header="Received Qty">
          <template #body="slotProps">
            {{ getTotalReceivedQty(slotProps.data) }}
          </template>
        </Column>

        <Column header="Rejected Qty">
          <template #body="slotProps">
            {{ getTotalRejectedQty(slotProps.data) }}
          </template>
        </Column>

        <Column header="Received Value">
          <template #body="slotProps">
            {{ formatCurrency(getReceivedValue(slotProps.data)) }}
          </template>
        </Column>

        <Column field="checkedBy" header="Checked By" sortable />

        <Column field="status" header="Status" sortable>
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
          </template>
        </Column>

        <Column header="Actions">
          <template #body="slotProps">
            <div class="action-buttons">
              <Button
                v-if="slotProps.data.status !== 'Accepted'"
                icon="pi pi-check"
                rounded
                text
                severity="secondary"
                aria-label="Accept received stock"
                @click="acceptReceivedStock(slotProps.data)"
              />
              <Button
                v-if="slotProps.data.status !== 'Rejected'"
                icon="pi pi-times"
                rounded
                text
                severity="secondary"
                aria-label="Reject received stock"
                @click="rejectReceivedStock(slotProps.data)"
              />
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="secondary"
                aria-label="Edit received stock"
                @click="editReceivedStock(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete received stock"
                @click="confirmDeleteReceivedStock(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No received stock records found.</p>
            <span>Try another keyword or create a new receiving record.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="receivedDialog"
      modal
      :header="isEditMode ? 'Edit Received Stock' : 'New Received Stock'"
      :style="{ width: '60rem' }"
      :breakpoints="{ '960px': '85vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="receivingNo">Receiving No.</label>
          <InputText
            id="receivingNo"
            v-model="receivedStock.receivingNo"
            placeholder="Example: RS-2026-0001"
            :invalid="submitted && !receivedStock.receivingNo"
          />
          <small v-if="submitted && !receivedStock.receivingNo">Receiving number is required.</small>
        </div>

        <div class="field">
          <label for="poNo">Linked PO</label>
          <Select
            id="poNo"
            v-model="receivedStock.poNo"
            :options="poOptions"
            placeholder="Select purchase order"
          />
        </div>

        <div class="field">
          <label for="supplier">Supplier</label>
          <Select
            id="supplier"
            v-model="receivedStock.supplier"
            :options="supplierOptions"
            placeholder="Select supplier"
            :invalid="submitted && !receivedStock.supplier"
          />
          <small v-if="submitted && !receivedStock.supplier">Supplier is required.</small>
        </div>

        <div class="field">
          <label for="receivedDate">Received Date</label>
          <InputText
            id="receivedDate"
            v-model="receivedStock.receivedDate"
            type="date"
            :invalid="submitted && !receivedStock.receivedDate"
          />
          <small v-if="submitted && !receivedStock.receivedDate">Received date is required.</small>
        </div>

        <div class="field">
          <label for="checkedBy">Checked By</label>
          <InputText
            id="checkedBy"
            v-model="receivedStock.checkedBy"
            placeholder="Example: Inventory Staff"
          />
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="receivedStock.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field form-span">
          <div class="line-items-header">
            <div>
              <label>Received Items</label>
              <p>
                Validate ordered quantity, received quantity, rejected quantity, batch number,
                expiry date, and item condition.
              </p>
            </div>

            <Button
              label="Add Item"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              outlined
              @click="addReceivedItem"
            />
          </div>

          <div class="line-items-list">
            <div
              v-for="(item, index) in receivedStock.items"
              :key="index"
              class="line-item-row"
            >
              <Select v-model="item.item" :options="itemOptions" placeholder="Item" />

              <InputNumber
                v-model="item.orderedQty"
                placeholder="Ordered"
                inputClass="full-input"
                :min="0"
                :minFractionDigits="0"
                :maxFractionDigits="2"
              />

              <InputNumber
                v-model="item.receivedQty"
                placeholder="Received"
                inputClass="full-input"
                :min="0"
                :minFractionDigits="0"
                :maxFractionDigits="2"
              />

              <InputNumber
                v-model="item.rejectedQty"
                placeholder="Rejected"
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

              <InputText v-model="item.batchNo" placeholder="Batch No." />

              <InputText v-model="item.expiryDate" type="date" />

              <Select v-model="item.condition" :options="conditionOptions" placeholder="Condition" />

              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Remove item"
                @click="removeReceivedItem(index)"
              />

              <div class="item-meta">
                <span>Accepted value: {{ formatCurrency(Number(item.receivedQty || 0) * Number(item.unitCost || 0)) }}</span>
                <span>Rejected value: {{ formatCurrency(Number(item.rejectedQty || 0) * Number(item.unitCost || 0)) }}</span>
                <Tag :value="item.condition" :severity="getConditionSeverity(item.condition)" />
              </div>
            </div>
          </div>
        </div>

        <div class="field form-span">
          <label for="remarks">Remarks</label>
          <Textarea
            id="remarks"
            v-model="receivedStock.remarks"
            rows="4"
            autoResize
            placeholder="Short receiving notes..."
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="dialog-total">
            <span>Received Value</span>
            <strong>{{ formatCurrency(getReceivedValue(receivedStock)) }}</strong>
          </div>

          <div class="dialog-actions">
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save Received Stock" icon="pi pi-check" @click="saveReceivedStock" />
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Received Stock"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ receivedStock.receivingNo }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteReceivedStock" />
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
  gap: 12px;
}

.line-item-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px 100px 100px 110px 140px 130px 130px 140px auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.item-meta {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: #64748b;
  font-size: 0.85rem;
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

@media (max-width: 1200px) {
  .line-item-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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