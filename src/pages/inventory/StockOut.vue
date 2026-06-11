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
const stockOutDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const reasonOptions = ref([
  'Sold / POS Deduction',
  'Waste',
  'Spoilage',
  'Expired',
  'Internal Use',
  'Damaged',
  'Manual Adjustment',
  'Others'
])

const ingredientOptions = ref([
  'Arabica Coffee Beans',
  'Fresh Milk',
  'Vanilla Syrup',
  'Tapioca Pearls',
  'Whipped Cream',
  'Rice',
  'Egg',
  'Food Packaging Cup'
])

const unitOptions = ref([
  'Kg',
  'Gram',
  'Liter',
  'Milliliter',
  'Piece',
  'Pack',
  'Bottle',
  'Can',
  'Cup',
  'Sachet'
])

const statusOptions = ref(['Draft', 'Posted', 'Cancelled'])

const emptyStockItem = {
  ingredient: '',
  quantity: 0,
  unit: '',
  unitCost: 0
}

const emptyStockOut = {
  id: null,
  referenceNo: '',
  reason: '',
  stockOutDate: '',
  status: 'Draft',
  preparedBy: '',
  remarks: '',
  items: []
}

const stockOut = ref({ ...emptyStockOut })

const stockOuts = ref([
  {
    id: 1,
    referenceNo: 'SO-2026-0001',
    reason: 'Sold / POS Deduction',
    stockOutDate: '2026-06-02',
    status: 'Posted',
    preparedBy: 'POS System',
    remarks: 'Auto deduction from Spanish Latte and Caramel Macchiato sales.',
    items: [
      { ingredient: 'Arabica Coffee Beans', quantity: 1.5, unit: 'Kg', unitCost: 450 },
      { ingredient: 'Fresh Milk', quantity: 8, unit: 'Liter', unitCost: 95 },
      { ingredient: 'Vanilla Syrup', quantity: 2, unit: 'Bottle', unitCost: 280 }
    ]
  },
  {
    id: 2,
    referenceNo: 'SO-2026-0002',
    reason: 'Waste',
    stockOutDate: '2026-06-04',
    status: 'Posted',
    preparedBy: 'Inventory Staff',
    remarks: 'Milk spillage during preparation.',
    items: [
      { ingredient: 'Fresh Milk', quantity: 2, unit: 'Liter', unitCost: 95 }
    ]
  },
  {
    id: 3,
    referenceNo: 'SO-2026-0003',
    reason: 'Spoilage',
    stockOutDate: '2026-06-06',
    status: 'Draft',
    preparedBy: 'Inventory Staff',
    remarks: 'For manager review before posting.',
    items: [
      { ingredient: 'Whipped Cream', quantity: 3, unit: 'Can', unitCost: 210 }
    ]
  },
  {
    id: 4,
    referenceNo: 'SO-2026-0004',
    reason: 'Internal Use',
    stockOutDate: '2026-06-08',
    status: 'Cancelled',
    preparedBy: 'Admin User',
    remarks: 'Cancelled duplicate stock out entry.',
    items: [
      { ingredient: 'Food Packaging Cup', quantity: 1, unit: 'Pack', unitCost: 125 }
    ]
  }
])

const filteredStockOuts = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return stockOuts.value

  return stockOuts.value.filter((item) =>
    item.referenceNo.toLowerCase().includes(keyword) ||
    item.reason.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.preparedBy.toLowerCase().includes(keyword) ||
    item.remarks.toLowerCase().includes(keyword)
  )
})

const totalStockOuts = computed(() => stockOuts.value.length)

const postedStockOuts = computed(() =>
  stockOuts.value.filter((item) => item.status === 'Posted').length
)

const draftStockOuts = computed(() =>
  stockOuts.value.filter((item) => item.status === 'Draft').length
)

const totalStockOutValue = computed(() =>
  stockOuts.value
    .filter((item) => item.status === 'Posted')
    .reduce((total, item) => total + getStockOutTotal(item), 0)
)

const getStockOutTotal = (data) => {
  return data.items.reduce((total, item) => {
    return total + Number(item.quantity || 0) * Number(item.unitCost || 0)
  }, 0)
}

const getTotalQuantity = (data) => {
  return data.items.reduce((total, item) => total + Number(item.quantity || 0), 0)
}

const generateReferenceNo = () => {
  const nextNumber = String(stockOuts.value.length + 1).padStart(4, '0')
  return `SO-2026-${nextNumber}`
}

const openNew = () => {
  stockOut.value = {
    ...emptyStockOut,
    referenceNo: generateReferenceNo(),
    stockOutDate: new Date().toISOString().slice(0, 10),
    items: [{ ...emptyStockItem }]
  }

  submitted.value = false
  isEditMode.value = false
  stockOutDialog.value = true
}

const editStockOut = (data) => {
  stockOut.value = {
    ...data,
    items: data.items?.length
      ? data.items.map((item) => ({ ...item }))
      : [{ ...emptyStockItem }]
  }

  submitted.value = false
  isEditMode.value = true
  stockOutDialog.value = true
}

const hideDialog = () => {
  stockOutDialog.value = false
  submitted.value = false
}

const addStockItem = () => {
  stockOut.value.items.push({ ...emptyStockItem })
}

const removeStockItem = (index) => {
  stockOut.value.items.splice(index, 1)

  if (!stockOut.value.items.length) {
    stockOut.value.items.push({ ...emptyStockItem })
  }
}

const saveStockOut = () => {
  submitted.value = true

  if (
    !stockOut.value.referenceNo.trim() ||
    !stockOut.value.reason ||
    !stockOut.value.stockOutDate
  ) {
    return
  }

  const cleanedItems = stockOut.value.items.filter((item) =>
    item.ingredient ||
    Number(item.quantity) > 0 ||
    item.unit ||
    Number(item.unitCost) > 0
  )

  const payload = {
    ...stockOut.value,
    items: cleanedItems
  }

  if (isEditMode.value) {
    const index = stockOuts.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      stockOuts.value[index] = payload
    }
  } else {
    stockOuts.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  stockOutDialog.value = false
  stockOut.value = { ...emptyStockOut }
}

const confirmDeleteStockOut = (data) => {
  stockOut.value = { ...data }
  deleteDialog.value = true
}

const deleteStockOut = () => {
  stockOuts.value = stockOuts.value.filter((item) => item.id !== stockOut.value.id)
  deleteDialog.value = false
  stockOut.value = { ...emptyStockOut }
}

const markAsPosted = (data) => {
  data.status = 'Posted'
}

const cancelStockOut = (data) => {
  data.status = 'Cancelled'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(value)
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
  if (status === 'Posted') return 'success'
  if (status === 'Draft') return 'warning'
  return 'secondary'
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Inventory Release</span>
        <h1 class="page-title">Stock Out</h1>
        <p class="page-subtitle">
          Record outgoing ingredients for POS deductions, waste, spoilage, expired items,
          internal use, damaged stock, and manual inventory adjustments.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="New Stock Out" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Records</span>
          <strong>{{ totalStockOuts }}</strong>
        </div>
        <i class="pi pi-send"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Posted</span>
          <strong>{{ postedStockOuts }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Draft</span>
          <strong>{{ draftStockOuts }}</strong>
        </div>
        <i class="pi pi-file-edit"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Stock Out Value</span>
          <strong>{{ formatCurrency(totalStockOutValue) }}</strong>
        </div>
        <i class="pi pi-wallet"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Stock Out Records</h3>
          <p>View, search, add, edit, post, cancel, or delete outgoing inventory records.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search stock out..." />
        </div>
      </div>

      <DataTable
        :value="filteredStockOuts"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 78rem"
      >
        <Column field="referenceNo" header="Reference No." sortable>
          <template #body="slotProps">
            <div class="category-name">
              <strong>{{ slotProps.data.referenceNo }}</strong>
              <span>{{ slotProps.data.remarks }}</span>
            </div>
          </template>
        </Column>

        <Column field="reason" header="Reason" sortable />

        <Column field="stockOutDate" header="Date" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.stockOutDate) }}
          </template>
        </Column>

        <Column header="Items">
          <template #body="slotProps">
            {{ slotProps.data.items.length }} item(s)
          </template>
        </Column>

        <Column header="Quantity">
          <template #body="slotProps">
            {{ getTotalQuantity(slotProps.data) }}
          </template>
        </Column>

        <Column header="Total Value">
          <template #body="slotProps">
            {{ formatCurrency(getStockOutTotal(slotProps.data)) }}
          </template>
        </Column>

        <Column field="preparedBy" header="Prepared By" sortable />

        <Column field="status" header="Status" sortable>
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="getStatusSeverity(slotProps.data.status)"
            />
          </template>
        </Column>

        <Column header="Actions">
          <template #body="slotProps">
            <div class="action-buttons">
              <Button
                v-if="slotProps.data.status !== 'Posted'"
                icon="pi pi-check"
                rounded
                text
                severity="secondary"
                aria-label="Mark as posted"
                @click="markAsPosted(slotProps.data)"
              />
              <Button
                v-if="slotProps.data.status !== 'Cancelled'"
                icon="pi pi-ban"
                rounded
                text
                severity="secondary"
                aria-label="Cancel stock out"
                @click="cancelStockOut(slotProps.data)"
              />
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="secondary"
                aria-label="Edit stock out"
                @click="editStockOut(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete stock out"
                @click="confirmDeleteStockOut(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No stock out records found.</p>
            <span>Try another keyword or add a new stock out record.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="stockOutDialog"
      modal
      :header="isEditMode ? 'Edit Stock Out' : 'New Stock Out'"
      :style="{ width: '56rem' }"
      :breakpoints="{ '960px': '85vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="referenceNo">Reference No.</label>
          <InputText
            id="referenceNo"
            v-model="stockOut.referenceNo"
            placeholder="Example: SO-2026-0001"
            :invalid="submitted && !stockOut.referenceNo"
          />
          <small v-if="submitted && !stockOut.referenceNo">Reference number is required.</small>
        </div>

        <div class="field">
          <label for="reason">Reason</label>
          <Select
            id="reason"
            v-model="stockOut.reason"
            :options="reasonOptions"
            placeholder="Select reason"
            :invalid="submitted && !stockOut.reason"
          />
          <small v-if="submitted && !stockOut.reason">Reason is required.</small>
        </div>

        <div class="field">
          <label for="stockOutDate">Stock Out Date</label>
          <InputText
            id="stockOutDate"
            v-model="stockOut.stockOutDate"
            type="date"
            :invalid="submitted && !stockOut.stockOutDate"
          />
          <small v-if="submitted && !stockOut.stockOutDate">Stock out date is required.</small>
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="stockOut.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field form-span">
          <label for="preparedBy">Prepared By</label>
          <InputText
            id="preparedBy"
            v-model="stockOut.preparedBy"
            placeholder="Example: Inventory Staff"
          />
        </div>

        <div class="field form-span">
          <div class="line-items-header">
            <div>
              <label>Outgoing Items</label>
              <p>
                Add ingredients, quantities, units, and unit cost for this stock out transaction.
              </p>
            </div>

            <Button
              label="Add Item"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              outlined
              @click="addStockItem"
            />
          </div>

          <div class="line-items-list">
            <div
              v-for="(item, index) in stockOut.items"
              :key="index"
              class="line-item-row"
            >
              <Select
                v-model="item.ingredient"
                :options="ingredientOptions"
                placeholder="Ingredient"
              />

              <InputNumber
                v-model="item.quantity"
                placeholder="Qty"
                inputClass="full-input"
                :min="0"
                :minFractionDigits="0"
                :maxFractionDigits="2"
              />

              <Select
                v-model="item.unit"
                :options="unitOptions"
                placeholder="Unit"
              />

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
                @click="removeStockItem(index)"
              />
            </div>
          </div>
        </div>

        <div class="field form-span">
          <label for="remarks">Remarks</label>
          <Textarea
            id="remarks"
            v-model="stockOut.remarks"
            rows="4"
            autoResize
            placeholder="Short stock out notes..."
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="dialog-total">
            <span>Total Value</span>
            <strong>{{ formatCurrency(getStockOutTotal(stockOut)) }}</strong>
          </div>

          <div class="dialog-actions">
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save Stock Out" icon="pi pi-check" @click="saveStockOut" />
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Stock Out"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ stockOut.referenceNo }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteStockOut" />
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
  letter-spacing: -0.03em;
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

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .search-box {
    width: 100%;
    min-width: 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-span {
    grid-column: span 1;
  }

  .line-item-row {
    grid-template-columns: 1fr;
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