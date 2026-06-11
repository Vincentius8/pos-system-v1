<script setup>
import { computed, ref } from 'vue'

import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Image from 'primevue/image'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'

const search = ref('')
const pricingDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const productOptions = ref([
  'Spanish Latte',
  'Caramel Macchiato',
  'Matcha Latte',
  'Java Chip Frappe',
  'Wintermelon Milk Tea',
  'Tapsilog',
  'Cheesy Fries'
])

const categoryOptions = ref([
  'Coffee',
  'Non-Coffee',
  'Frappe',
  'Milk Tea',
  'Silogs',
  'Snacks',
  'Add-ons'
])

const statusOptions = ref(['Active', 'Draft', 'Inactive'])

const emptyPricing = {
  id: null,
  product: '',
  category: '',
  servingSize: '',
  recipeCost: 0,
  targetFoodCost: 35,
  markupPercent: 0,
  packagingCost: 0,
  laborCost: 0,
  otherCost: 0,
  sellingPrice: 0,
  status: 'Draft',
  image: '',
  notes: ''
}

const pricing = ref({ ...emptyPricing })

const pricingRecords = ref([
  {
    id: 1,
    product: 'Spanish Latte',
    category: 'Coffee',
    servingSize: '16oz',
    recipeCost: 58,
    targetFoodCost: 35,
    markupPercent: 150,
    packagingCost: 8,
    laborCost: 10,
    otherCost: 4,
    sellingPrice: 145,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    notes: 'Current POS price is within acceptable food cost range.'
  },
  {
    id: 2,
    product: 'Caramel Macchiato',
    category: 'Coffee',
    servingSize: '16oz',
    recipeCost: 64,
    targetFoodCost: 35,
    markupPercent: 145,
    packagingCost: 8,
    laborCost: 10,
    otherCost: 5,
    sellingPrice: 155,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
    notes: 'Good margin but caramel cost should be monitored.'
  },
  {
    id: 3,
    product: 'Matcha Latte',
    category: 'Non-Coffee',
    servingSize: '16oz',
    recipeCost: 52,
    targetFoodCost: 35,
    markupPercent: 160,
    packagingCost: 8,
    laborCost: 10,
    otherCost: 4,
    sellingPrice: 150,
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    notes: 'Draft price based on current matcha powder cost.'
  }
])

const getTotalBaseCost = (data) => {
  return (
    Number(data.recipeCost || 0) +
    Number(data.packagingCost || 0) +
    Number(data.laborCost || 0) +
    Number(data.otherCost || 0)
  )
}

const getSuggestedByFoodCost = (data) => {
  const totalCost = getTotalBaseCost(data)
  const target = Number(data.targetFoodCost || 0)

  if (!totalCost || !target) return 0

  return totalCost / (target / 100)
}

const getSuggestedByMarkup = (data) => {
  const totalCost = getTotalBaseCost(data)
  const markup = Number(data.markupPercent || 0)

  if (!totalCost) return 0

  return totalCost + totalCost * (markup / 100)
}

const getCurrentFoodCostPercent = (data) => {
  if (!Number(data.sellingPrice)) return 0

  return Math.round((getTotalBaseCost(data) / Number(data.sellingPrice)) * 100)
}

const getGrossProfit = (data) => {
  return Number(data.sellingPrice || 0) - getTotalBaseCost(data)
}

const getProfitMarginPercent = (data) => {
  if (!Number(data.sellingPrice)) return 0

  return Math.round((getGrossProfit(data) / Number(data.sellingPrice)) * 100)
}

const getPriceGap = (data) => {
  return Number(data.sellingPrice || 0) - getSuggestedByFoodCost(data)
}

const getPricingStatus = (data) => {
  const currentFoodCost = getCurrentFoodCostPercent(data)
  const target = Number(data.targetFoodCost || 0)

  if (!Number(data.sellingPrice) || !getTotalBaseCost(data)) return 'Incomplete'
  if (currentFoodCost <= target) return 'Good Price'
  return 'Increase Price'
}

const getPricingStatusSeverity = (status) => {
  if (status === 'Good Price') return 'success'
  if (status === 'Increase Price') return 'warning'
  return 'secondary'
}

const currentTotalBaseCost = computed(() => getTotalBaseCost(pricing.value))
const currentSuggestedByFoodCost = computed(() => getSuggestedByFoodCost(pricing.value))
const currentSuggestedByMarkup = computed(() => getSuggestedByMarkup(pricing.value))
const currentFoodCostPercent = computed(() => getCurrentFoodCostPercent(pricing.value))
const currentGrossProfit = computed(() => getGrossProfit(pricing.value))
const currentProfitMarginPercent = computed(() => getProfitMarginPercent(pricing.value))
const currentPriceGap = computed(() => getPriceGap(pricing.value))
const currentPricingStatus = computed(() => getPricingStatus(pricing.value))

const filteredPricingRecords = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return pricingRecords.value

  return pricingRecords.value.filter((item) =>
    item.product.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword) ||
    item.servingSize.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.notes.toLowerCase().includes(keyword)
  )
})

const totalCalculations = computed(() => pricingRecords.value.length)

const goodPrices = computed(() =>
  pricingRecords.value.filter((item) => getPricingStatus(item) === 'Good Price').length
)

const needsIncrease = computed(() =>
  pricingRecords.value.filter((item) => getPricingStatus(item) === 'Increase Price').length
)

const averageMargin = computed(() => {
  if (!pricingRecords.value.length) return 0

  const total = pricingRecords.value.reduce((sum, item) => {
    return sum + getProfitMarginPercent(item)
  }, 0)

  return Math.round(total / pricingRecords.value.length)
})

const openNew = () => {
  pricing.value = { ...emptyPricing }
  submitted.value = false
  isEditMode.value = false
  pricingDialog.value = true
}

const editPricing = (data) => {
  pricing.value = { ...data }
  submitted.value = false
  isEditMode.value = true
  pricingDialog.value = true
}

const hideDialog = () => {
  pricingDialog.value = false
  submitted.value = false
}

const applySuggestedFoodCostPrice = () => {
  pricing.value.sellingPrice = Math.ceil(currentSuggestedByFoodCost.value)
}

const applySuggestedMarkupPrice = () => {
  pricing.value.sellingPrice = Math.ceil(currentSuggestedByMarkup.value)
}

const savePricing = () => {
  submitted.value = true

  if (!pricing.value.product || !pricing.value.category || !pricing.value.servingSize.trim()) {
    return
  }

  const payload = {
    ...pricing.value,
    recipeCost: Number(pricing.value.recipeCost || 0),
    targetFoodCost: Number(pricing.value.targetFoodCost || 0),
    markupPercent: Number(pricing.value.markupPercent || 0),
    packagingCost: Number(pricing.value.packagingCost || 0),
    laborCost: Number(pricing.value.laborCost || 0),
    otherCost: Number(pricing.value.otherCost || 0),
    sellingPrice: Number(pricing.value.sellingPrice || 0),
    image:
      pricing.value.image ||
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80'
  }

  if (isEditMode.value) {
    const index = pricingRecords.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      pricingRecords.value[index] = payload
    }
  } else {
    pricingRecords.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  pricingDialog.value = false
  pricing.value = { ...emptyPricing }
}

const confirmDeletePricing = (data) => {
  pricing.value = { ...data }
  deleteDialog.value = true
}

const deletePricing = () => {
  pricingRecords.value = pricingRecords.value.filter((item) => item.id !== pricing.value.id)
  deleteDialog.value = false
  pricing.value = { ...emptyPricing }
}

const toggleStatus = (data) => {
  data.status = data.status === 'Active' ? 'Inactive' : 'Active'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(value)
}

const getStatusSeverity = (status) => {
  if (status === 'Active') return 'success'
  if (status === 'Draft') return 'warning'
  return 'secondary'
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Recipe Pricing</span>
        <h1 class="page-title">Pricing Calculator</h1>
        <p class="page-subtitle">
          Calculate selling price using recipe cost, packaging cost, labor, markup,
          target food cost, gross profit, and profit margin.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="New Pricing" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Calculations</span>
          <strong>{{ totalCalculations }}</strong>
        </div>
        <i class="pi pi-calculator"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Good Prices</span>
          <strong>{{ goodPrices }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Need Increase</span>
          <strong>{{ needsIncrease }}</strong>
        </div>
        <i class="pi pi-exclamation-triangle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Avg. Margin</span>
          <strong>{{ averageMargin }}</strong>
        </div>
        <i class="pi pi-percentage"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Pricing Records</h3>
          <p>View, search, add, edit, or delete product pricing calculations.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search pricing..." />
        </div>
      </div>

      <DataTable
        :value="filteredPricingRecords"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 86rem"
      >
        <Column header="Product" sortable sortField="product">
          <template #body="slotProps">
            <div class="product-info">
              <Image
                :src="slotProps.data.image"
                :alt="slotProps.data.product"
                preview
                imageClass="product-image"
              />

              <div class="category-name">
                <strong>{{ slotProps.data.product }}</strong>
                <span>{{ slotProps.data.notes }}</span>
              </div>
            </div>
          </template>
        </Column>

        <Column field="category" header="Category" sortable />
        <Column field="servingSize" header="Size" sortable />

        <Column header="Base Cost">
          <template #body="slotProps">
            {{ formatCurrency(getTotalBaseCost(slotProps.data)) }}
          </template>
        </Column>

        <Column field="sellingPrice" header="Selling Price" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.sellingPrice) }}
          </template>
        </Column>

        <Column header="Suggested Price">
          <template #body="slotProps">
            {{ formatCurrency(getSuggestedByFoodCost(slotProps.data)) }}
          </template>
        </Column>

        <Column header="Food Cost">
          <template #body="slotProps">
            {{ getCurrentFoodCostPercent(slotProps.data) }}
          </template>
        </Column>

        <Column header="Margin">
          <template #body="slotProps">
            {{ getProfitMarginPercent(slotProps.data) }}
          </template>
        </Column>

        <Column header="Price Gap">
          <template #body="slotProps">
            {{ formatCurrency(getPriceGap(slotProps.data)) }}
          </template>
        </Column>

        <Column header="Pricing Status">
          <template #body="slotProps">
            <Tag
              :value="getPricingStatus(slotProps.data)"
              :severity="getPricingStatusSeverity(getPricingStatus(slotProps.data))"
            />
          </template>
        </Column>

        <Column field="status" header="Record Status" sortable>
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
                icon="pi pi-pencil"
                rounded
                text
                severity="secondary"
                aria-label="Edit pricing"
                @click="editPricing(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.status === 'Active' ? 'pi pi-eye-slash' : 'pi pi-eye'"
                rounded
                text
                severity="secondary"
                aria-label="Toggle status"
                @click="toggleStatus(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete pricing"
                @click="confirmDeletePricing(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No pricing records found.</p>
            <span>Try another keyword or add a new pricing calculation.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="pricingDialog"
      modal
      :header="isEditMode ? 'Edit Pricing Calculation' : 'New Pricing Calculation'"
      :style="{ width: '58rem' }"
      :breakpoints="{ '960px': '85vw', '641px': '92vw' }"
    >
      <div class="cost-summary">
        <div>
          <span>Total Base Cost</span>
          <strong>{{ formatCurrency(currentTotalBaseCost) }}</strong>
        </div>

        <div>
          <span>Current Price</span>
          <strong>{{ formatCurrency(pricing.sellingPrice) }}</strong>
        </div>

        <div>
          <span>Food Cost</span>
          <strong>{{ currentFoodCostPercent }}</strong>
        </div>

        <div>
          <span>Gross Profit</span>
          <strong>{{ formatCurrency(currentGrossProfit) }}</strong>
        </div>

        <div>
          <span>Profit Margin</span>
          <strong>{{ currentProfitMarginPercent }}</strong>
        </div>

        <div>
          <span>By Food Cost</span>
          <strong>{{ formatCurrency(currentSuggestedByFoodCost) }}</strong>
        </div>

        <div>
          <span>By Markup</span>
          <strong>{{ formatCurrency(currentSuggestedByMarkup) }}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>{{ currentPricingStatus }}</strong>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label for="product">Product</label>
          <Select
            id="product"
            v-model="pricing.product"
            :options="productOptions"
            placeholder="Select product"
            :invalid="submitted && !pricing.product"
          />
          <small v-if="submitted && !pricing.product">Product is required.</small>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <Select
            id="category"
            v-model="pricing.category"
            :options="categoryOptions"
            placeholder="Select category"
            :invalid="submitted && !pricing.category"
          />
          <small v-if="submitted && !pricing.category">Category is required.</small>
        </div>

        <div class="field">
          <label for="servingSize">Serving Size</label>
          <InputText
            id="servingSize"
            v-model="pricing.servingSize"
            placeholder="Example: 16oz"
            :invalid="submitted && !pricing.servingSize"
          />
          <small v-if="submitted && !pricing.servingSize">Serving size is required.</small>
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="pricing.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field">
          <label for="recipeCost">Recipe Cost</label>
          <InputNumber
            id="recipeCost"
            v-model="pricing.recipeCost"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="packagingCost">Packaging Cost</label>
          <InputNumber
            id="packagingCost"
            v-model="pricing.packagingCost"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="laborCost">Labor Cost</label>
          <InputNumber
            id="laborCost"
            v-model="pricing.laborCost"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="otherCost">Other Cost</label>
          <InputNumber
            id="otherCost"
            v-model="pricing.otherCost"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="targetFoodCost">Target Food Cost</label>
          <InputNumber
            id="targetFoodCost"
            v-model="pricing.targetFoodCost"
            suffix="%"
            class="full-input"
            inputClass="full-input"
            :min="0"
            :max="100"
          />
        </div>

        <div class="field">
          <label for="markupPercent">Markup</label>
          <InputNumber
            id="markupPercent"
            v-model="pricing.markupPercent"
            suffix="%"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="sellingPrice">Selling Price</label>
          <InputNumber
            id="sellingPrice"
            v-model="pricing.sellingPrice"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field calculator-actions">
          <label>Apply Suggested Price</label>
          <div>
            <Button
              label="Use Food Cost"
              icon="pi pi-check"
              severity="secondary"
              outlined
              @click="applySuggestedFoodCostPrice"
            />
            <Button
              label="Use Markup"
              icon="pi pi-check"
              severity="secondary"
              outlined
              @click="applySuggestedMarkupPrice"
            />
          </div>
        </div>

        <div class="field form-span">
          <label for="image">Image URL</label>
          <InputText
            id="image"
            v-model="pricing.image"
            placeholder="Paste product image URL"
          />
        </div>

        <div class="field form-span">
          <label for="notes">Notes</label>
          <Textarea
            id="notes"
            v-model="pricing.notes"
            rows="4"
            autoResize
            placeholder="Short pricing notes..."
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="dialog-total">
            <span>Live Suggested Price</span>
            <strong>{{ formatCurrency(currentSuggestedByFoodCost) }}</strong>
          </div>

          <div class="dialog-actions">
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save Pricing" icon="pi pi-check" @click="savePricing" />
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Pricing"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ pricing.product }}</strong> pricing record?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deletePricing" />
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

.product-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.product-info :deep(.product-image) {
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cost-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.cost-summary div {
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.cost-summary span {
  display: block;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
}

.cost-summary strong {
  display: block;
  margin-top: 6px;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
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

.calculator-actions > div {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
  .stats-grid,
  .cost-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hero-card,
  .card-header,
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
  .cost-summary {
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

  .dialog-actions {
    width: 100%;
    flex-direction: column-reverse;
  }

  .dialog-actions :deep(.p-button) {
    width: 100%;
  }

  .calculator-actions > div {
    flex-direction: column;
  }

  .calculator-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>