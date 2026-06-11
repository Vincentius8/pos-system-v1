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
const costingDialog = ref(false)
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
  'Snacks'
])

const statusOptions = ref(['Active', 'Draft', 'Inactive'])

const ingredientOptions = ref([
  'Rice',
  'Raw Pork',
  'Arabica Coffee Beans',
  'Fresh Milk',
  'Condensed Milk',
  'Vanilla Syrup',
  'Ice Cube',
  'Egg'
])

const packagingOptions = ref([
  'Cup / Box',
  'Lid',
  'Straw / Spoon / Fork',
  'Tissue',
  'Sauce / Condiment',
  'Takeout Bag'
])

const unitOptions = ref(['gram', 'ml', 'piece', 'kg', 'liter', 'cup', 'shot'])

const emptyIngredientRow = {
  ingredient: '',
  purchaseCost: 0,
  purchasedQty: 0,
  usableQty: 0,
  servingQty: 0,
  unit: 'gram'
}

const emptyPackagingRow = {
  item: '',
  cost: 0
}

const emptyCosting = {
  id: null,
  product: '',
  category: '',
  servingSize: '',
  sellingPrice: 0,
  targetFoodCost: 30,
  targetProfitMargin: 25,
  expectedMonthlyOrders: 3000,
  operatingDays: 30,
  fixedCosts: 112000,
  variableOperatingCosts: 37000,
  directVariableOperatingCost: 0,
  status: 'Draft',
  notes: '',
  ingredients: [],
  packaging: []
}

const costing = ref({ ...emptyCosting })

const costings = ref([
  {
    id: 1,
    product: 'Tapsilog',
    category: 'Silogs',
    servingSize: '1 plate',
    sellingPrice: 180,
    targetFoodCost: 30,
    targetProfitMargin: 25,
    expectedMonthlyOrders: 3000,
    operatingDays: 30,
    fixedCosts: 112000,
    variableOperatingCosts: 37000,
    directVariableOperatingCost: 10,
    status: 'Active',
    notes: 'Sample computation with rice and meat yield adjustment.',
    ingredients: [
      {
        ingredient: 'Rice',
        purchaseCost: 1500,
        purchasedQty: 25000,
        usableQty: 25000,
        servingQty: 150,
        unit: 'gram'
      },
      {
        ingredient: 'Raw Pork',
        purchaseCost: 320,
        purchasedQty: 1000,
        usableQty: 750,
        servingQty: 100,
        unit: 'gram'
      }
    ],
    packaging: [
      { item: 'Cup / Box', cost: 4 },
      { item: 'Lid', cost: 1.5 },
      { item: 'Straw / Spoon / Fork', cost: 0.75 },
      { item: 'Tissue', cost: 0.5 },
      { item: 'Sauce / Condiment', cost: 2 },
      { item: 'Takeout Bag', cost: 1.5 }
    ]
  }
])

const getCostPerPurchasedUnit = (row) => {
  if (!Number(row.purchasedQty)) return 0
  return Number(row.purchaseCost || 0) / Number(row.purchasedQty || 0)
}

const getYieldPercent = (row) => {
  if (!Number(row.purchasedQty)) return 0
  return (Number(row.usableQty || 0) / Number(row.purchasedQty || 0)) * 100
}

const getYieldAdjustedCost = (row) => {
  if (!Number(row.usableQty)) return 0
  return Number(row.purchaseCost || 0) / Number(row.usableQty || 0)
}

const getIngredientServingCost = (row) => {
  return Number(row.servingQty || 0) * getYieldAdjustedCost(row)
}

const getRawIngredientCost = (data) => {
  return data.ingredients.reduce((total, row) => total + getIngredientServingCost(row), 0)
}

const getPackagingCost = (data) => {
  return data.packaging.reduce((total, row) => total + Number(row.cost || 0), 0)
}

const getDirectUnitCost = (data) => {
  return getRawIngredientCost(data) + getPackagingCost(data)
}

const getMonthlyOverhead = (data) => {
  return Number(data.fixedCosts || 0) + Number(data.variableOperatingCosts || 0)
}

const getOverheadPerOrder = (data) => {
  if (!Number(data.expectedMonthlyOrders)) return 0
  return getMonthlyOverhead(data) / Number(data.expectedMonthlyOrders || 0)
}

const getFullUnitCost = (data) => {
  return getDirectUnitCost(data) + getOverheadPerOrder(data)
}

const getFoodCostPercent = (data) => {
  if (!Number(data.sellingPrice)) return 0
  return (getRawIngredientCost(data) / Number(data.sellingPrice || 0)) * 100
}

const getSellingPriceByFoodCost = (data) => {
  if (!Number(data.targetFoodCost)) return 0
  return getRawIngredientCost(data) / (Number(data.targetFoodCost || 0) / 100)
}

const getSellingPriceByProfitMargin = (data) => {
  const targetMargin = Number(data.targetProfitMargin || 0) / 100
  if (targetMargin >= 1) return 0
  return getFullUnitCost(data) / (1 - targetMargin)
}

const getVariableCostPerUnit = (data) => {
  return (
    getDirectUnitCost(data) +
    Number(data.directVariableOperatingCost || 0)
  )
}

const getContributionMargin = (data) => {
  return Number(data.sellingPrice || 0) - getVariableCostPerUnit(data)
}

const getBreakEvenUnits = (data) => {
  const contribution = getContributionMargin(data)
  if (!contribution) return 0
  return Number(data.fixedCosts || 0) / contribution
}

const getBreakEvenOrdersPerDay = (data) => {
  if (!Number(data.operatingDays)) return 0
  return getBreakEvenUnits(data) / Number(data.operatingDays || 0)
}

const getMasterSuggestedPrice = (data) => {
  return getSellingPriceByProfitMargin(data)
}

const getCostStatus = (data) => {
  if (!Number(data.sellingPrice) || !getFullUnitCost(data)) return 'Incomplete'
  if (Number(data.sellingPrice) >= getMasterSuggestedPrice(data)) return 'Profitable'
  return 'Review Price'
}

const currentRawIngredientCost = computed(() => getRawIngredientCost(costing.value))
const currentPackagingCost = computed(() => getPackagingCost(costing.value))
const currentDirectUnitCost = computed(() => getDirectUnitCost(costing.value))
const currentOverheadPerOrder = computed(() => getOverheadPerOrder(costing.value))
const currentFullUnitCost = computed(() => getFullUnitCost(costing.value))
const currentFoodCostPercent = computed(() => getFoodCostPercent(costing.value))
const currentSellingPriceByFoodCost = computed(() => getSellingPriceByFoodCost(costing.value))
const currentSellingPriceByProfitMargin = computed(() => getSellingPriceByProfitMargin(costing.value))
const currentContributionMargin = computed(() => getContributionMargin(costing.value))
const currentBreakEvenUnits = computed(() => getBreakEvenUnits(costing.value))
const currentBreakEvenOrdersPerDay = computed(() => getBreakEvenOrdersPerDay(costing.value))
const currentMasterSuggestedPrice = computed(() => getMasterSuggestedPrice(costing.value))
const currentCostStatus = computed(() => getCostStatus(costing.value))

const filteredCostings = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return costings.value

  return costings.value.filter((item) =>
    item.product.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword) ||
    item.servingSize.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.notes.toLowerCase().includes(keyword)
  )
})

const totalCostings = computed(() => costings.value.length)

const profitableCostings = computed(() =>
  costings.value.filter((item) => getCostStatus(item) === 'Profitable').length
)

const reviewCostings = computed(() =>
  costings.value.filter((item) => getCostStatus(item) === 'Review Price').length
)

const averageFoodCost = computed(() => {
  if (!costings.value.length) return 0

  const total = costings.value.reduce((sum, item) => sum + getFoodCostPercent(item), 0)
  return Math.round(total / costings.value.length)
})

const openNew = () => {
  costing.value = {
    ...emptyCosting,
    ingredients: [{ ...emptyIngredientRow }],
    packaging: [
      { item: 'Cup / Box', cost: 4 },
      { item: 'Lid', cost: 1.5 },
      { item: 'Straw / Spoon / Fork', cost: 0.75 },
      { item: 'Tissue', cost: 0.5 },
      { item: 'Sauce / Condiment', cost: 2 },
      { item: 'Takeout Bag', cost: 1.5 }
    ]
  }

  submitted.value = false
  isEditMode.value = false
  costingDialog.value = true
}

const editCosting = (data) => {
  costing.value = {
    ...data,
    ingredients: data.ingredients?.map((item) => ({ ...item })) || [{ ...emptyIngredientRow }],
    packaging: data.packaging?.map((item) => ({ ...item })) || [{ ...emptyPackagingRow }]
  }

  submitted.value = false
  isEditMode.value = true
  costingDialog.value = true
}

const hideDialog = () => {
  costingDialog.value = false
  submitted.value = false
}

const addIngredientRow = () => {
  costing.value.ingredients.push({ ...emptyIngredientRow })
}

const removeIngredientRow = (index) => {
  costing.value.ingredients.splice(index, 1)

  if (!costing.value.ingredients.length) {
    costing.value.ingredients.push({ ...emptyIngredientRow })
  }
}

const addPackagingRow = () => {
  costing.value.packaging.push({ ...emptyPackagingRow })
}

const removePackagingRow = (index) => {
  costing.value.packaging.splice(index, 1)

  if (!costing.value.packaging.length) {
    costing.value.packaging.push({ ...emptyPackagingRow })
  }
}

const applyFoodCostPrice = () => {
  costing.value.sellingPrice = Math.ceil(currentSellingPriceByFoodCost.value)
}

const applyProfitMarginPrice = () => {
  costing.value.sellingPrice = Math.ceil(currentSellingPriceByProfitMargin.value)
}

const saveCosting = () => {
  submitted.value = true

  if (!costing.value.product || !costing.value.category || !costing.value.servingSize.trim()) {
    return
  }

  const payload = {
    ...costing.value,
    sellingPrice: Number(costing.value.sellingPrice || 0),
    targetFoodCost: Number(costing.value.targetFoodCost || 0),
    targetProfitMargin: Number(costing.value.targetProfitMargin || 0),
    expectedMonthlyOrders: Number(costing.value.expectedMonthlyOrders || 0),
    operatingDays: Number(costing.value.operatingDays || 0),
    fixedCosts: Number(costing.value.fixedCosts || 0),
    variableOperatingCosts: Number(costing.value.variableOperatingCosts || 0),
    directVariableOperatingCost: Number(costing.value.directVariableOperatingCost || 0)
  }

  if (isEditMode.value) {
    const index = costings.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      costings.value[index] = payload
    }
  } else {
    costings.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  costingDialog.value = false
  costing.value = { ...emptyCosting }
}

const confirmDeleteCosting = (data) => {
  costing.value = { ...data }
  deleteDialog.value = true
}

const deleteCosting = () => {
  costings.value = costings.value.filter((item) => item.id !== costing.value.id)
  deleteDialog.value = false
  costing.value = { ...emptyCosting }
}

const toggleStatus = (data) => {
  data.status = data.status === 'Active' ? 'Inactive' : 'Active'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(value || 0)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 2
  }).format(value || 0)
}

const getStatusSeverity = (status) => {
  if (status === 'Active') return 'success'
  if (status === 'Draft') return 'warning'
  return 'secondary'
}

const getCostStatusSeverity = (status) => {
  if (status === 'Profitable') return 'success'
  if (status === 'Review Price') return 'warning'
  return 'secondary'
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Recipe Costing</span>
        <h1 class="page-title">Cost Computation</h1>
        <p class="page-subtitle">
          Compute raw ingredient cost, yield-adjusted cost, packaging, overhead,
          full unit cost, selling price, contribution margin, and break-even orders.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="New Computation" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Computations</span>
          <strong>{{ totalCostings }}</strong>
        </div>
        <i class="pi pi-calculator"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Profitable</span>
          <strong>{{ profitableCostings }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Needs Review</span>
          <strong>{{ reviewCostings }}</strong>
        </div>
        <i class="pi pi-exclamation-triangle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Avg. Food Cost</span>
          <strong>{{ averageFoodCost }}</strong>
        </div>
        <i class="pi pi-percentage"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Cost Computation List</h3>
          <p>View, search, add, edit, review, or delete full cost computations.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search computation..." />
        </div>
      </div>

      <DataTable
        :value="filteredCostings"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 88rem"
      >
        <Column field="product" header="Product" sortable>
          <template #body="slotProps">
            <div class="category-name">
              <strong>{{ slotProps.data.product }}</strong>
              <span>{{ slotProps.data.notes }}</span>
            </div>
          </template>
        </Column>

        <Column field="category" header="Category" sortable />
        <Column field="servingSize" header="Size" sortable />

        <Column header="Ingredients">
          <template #body="slotProps">
            {{ formatCurrency(getRawIngredientCost(slotProps.data)) }}
          </template>
        </Column>

        <Column header="Packaging">
          <template #body="slotProps">
            {{ formatCurrency(getPackagingCost(slotProps.data)) }}
          </template>
        </Column>

        <Column header="Full Cost">
          <template #body="slotProps">
            {{ formatCurrency(getFullUnitCost(slotProps.data)) }}
          </template>
        </Column>

        <Column field="sellingPrice" header="Selling Price" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.sellingPrice) }}
          </template>
        </Column>

        <Column header="Contribution">
          <template #body="slotProps">
            {{ formatCurrency(getContributionMargin(slotProps.data)) }}
          </template>
        </Column>

        <Column header="Break-even / Day">
          <template #body="slotProps">
            {{ formatNumber(getBreakEvenOrdersPerDay(slotProps.data)) }}
          </template>
        </Column>

        <Column header="Status">
          <template #body="slotProps">
            <Tag
              :value="getCostStatus(slotProps.data)"
              :severity="getCostStatusSeverity(getCostStatus(slotProps.data))"
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
              <Button icon="pi pi-pencil" rounded text severity="secondary" @click="editCosting(slotProps.data)" />
              <Button
                :icon="slotProps.data.status === 'Active' ? 'pi pi-eye-slash' : 'pi pi-eye'"
                rounded
                text
                severity="secondary"
                @click="toggleStatus(slotProps.data)"
              />
              <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDeleteCosting(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="costingDialog"
      modal
      :header="isEditMode ? 'Edit Cost Computation' : 'New Cost Computation'"
      :style="{ width: '64rem' }"
      :breakpoints="{ '960px': '88vw', '641px': '94vw' }"
    >
      <div class="cost-summary">
        <div>
          <span>Raw Ingredients</span>
          <strong>{{ formatCurrency(currentRawIngredientCost) }}</strong>
        </div>

        <div>
          <span>Packaging</span>
          <strong>{{ formatCurrency(currentPackagingCost) }}</strong>
        </div>

        <div>
          <span>Direct Unit Cost</span>
          <strong>{{ formatCurrency(currentDirectUnitCost) }}</strong>
        </div>

        <div>
          <span>Overhead / Order</span>
          <strong>{{ formatCurrency(currentOverheadPerOrder) }}</strong>
        </div>

        <div>
          <span>Full Unit Cost</span>
          <strong>{{ formatCurrency(currentFullUnitCost) }}</strong>
        </div>

        <div>
          <span>Food Cost</span>
          <strong>{{ formatNumber(currentFoodCostPercent) }}</strong>
        </div>

        <div>
          <span>Contribution</span>
          <strong>{{ formatCurrency(currentContributionMargin) }}</strong>
        </div>

        <div>
          <span>Break-even / Day</span>
          <strong>{{ formatNumber(currentBreakEvenOrdersPerDay) }}</strong>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label>Product</label>
          <Select v-model="costing.product" :options="productOptions" placeholder="Select product" :invalid="submitted && !costing.product" />
          <small v-if="submitted && !costing.product">Product is required.</small>
        </div>

        <div class="field">
          <label>Category</label>
          <Select v-model="costing.category" :options="categoryOptions" placeholder="Select category" :invalid="submitted && !costing.category" />
          <small v-if="submitted && !costing.category">Category is required.</small>
        </div>

        <div class="field">
          <label>Serving Size</label>
          <InputText v-model="costing.servingSize" placeholder="Example: 16oz" :invalid="submitted && !costing.servingSize" />
          <small v-if="submitted && !costing.servingSize">Serving size is required.</small>
        </div>

        <div class="field">
          <label>Status</label>
          <Select v-model="costing.status" :options="statusOptions" placeholder="Select status" />
        </div>

        <div class="field">
          <label>Selling Price</label>
          <InputNumber v-model="costing.sellingPrice" mode="currency" currency="PHP" locale="en-PH" class="full-input" inputClass="full-input" :min="0" />
        </div>

        <div class="field">
          <label>Target Food Cost</label>
          <InputNumber v-model="costing.targetFoodCost" suffix="%" class="full-input" inputClass="full-input" :min="0" :max="100" />
        </div>

        <div class="field">
          <label>Target Profit Margin</label>
          <InputNumber v-model="costing.targetProfitMargin" suffix="%" class="full-input" inputClass="full-input" :min="0" :max="100" />
        </div>

        <div class="field">
          <label>Direct Variable Operating Cost</label>
          <InputNumber v-model="costing.directVariableOperatingCost" mode="currency" currency="PHP" locale="en-PH" class="full-input" inputClass="full-input" :min="0" />
        </div>

        <div class="field form-span">
          <div class="section-header">
            <div>
              <label>Raw Ingredient Costing</label>
              <p>Cost per usable unit = purchase cost divided by usable quantity after yield loss.</p>
            </div>
            <Button label="Add Ingredient" icon="pi pi-plus" size="small" severity="secondary" outlined @click="addIngredientRow" />
          </div>

          <div class="ingredient-list">
            <div v-for="(row, index) in costing.ingredients" :key="index" class="ingredient-row">
              <Select v-model="row.ingredient" :options="ingredientOptions" placeholder="Ingredient" />
              <InputNumber v-model="row.purchaseCost" mode="currency" currency="PHP" locale="en-PH" placeholder="Purchase Cost" inputClass="full-input" />
              <InputNumber v-model="row.purchasedQty" placeholder="Purchased Qty" inputClass="full-input" />
              <InputNumber v-model="row.usableQty" placeholder="Usable Qty" inputClass="full-input" />
              <InputNumber v-model="row.servingQty" placeholder="Serving Qty" inputClass="full-input" />
              <Select v-model="row.unit" :options="unitOptions" placeholder="Unit" />
              <Button icon="pi pi-trash" rounded text severity="danger" @click="removeIngredientRow(index)" />

              <div class="row-result">
                <span>Cost / usable unit: {{ formatCurrency(getYieldAdjustedCost(row)) }}</span>
                <span>Yield: {{ formatNumber(getYieldPercent(row)) }}</span>
                <strong>Serving cost: {{ formatCurrency(getIngredientServingCost(row)) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="field form-span">
          <div class="section-header">
            <div>
              <label>Packaging & Consumables</label>
              <p>Packaging cost per order = sum of all packaging and consumables used.</p>
            </div>
            <Button label="Add Packaging" icon="pi pi-plus" size="small" severity="secondary" outlined @click="addPackagingRow" />
          </div>

          <div class="packaging-list">
            <div v-for="(row, index) in costing.packaging" :key="index" class="packaging-row">
              <Select v-model="row.item" :options="packagingOptions" placeholder="Packaging item" />
              <InputNumber v-model="row.cost" mode="currency" currency="PHP" locale="en-PH" placeholder="Cost" inputClass="full-input" />
              <Button icon="pi pi-trash" rounded text severity="danger" @click="removePackagingRow(index)" />
            </div>
          </div>
        </div>

        <div class="field">
          <label>Fixed Costs</label>
          <InputNumber v-model="costing.fixedCosts" mode="currency" currency="PHP" locale="en-PH" class="full-input" inputClass="full-input" />
        </div>

        <div class="field">
          <label>Variable Operating Costs</label>
          <InputNumber v-model="costing.variableOperatingCosts" mode="currency" currency="PHP" locale="en-PH" class="full-input" inputClass="full-input" />
        </div>

        <div class="field">
          <label>Expected Monthly Orders</label>
          <InputNumber v-model="costing.expectedMonthlyOrders" class="full-input" inputClass="full-input" />
        </div>

        <div class="field">
          <label>Operating Days</label>
          <InputNumber v-model="costing.operatingDays" class="full-input" inputClass="full-input" />
        </div>

        <div class="field calculator-actions">
          <label>Apply Suggested Price</label>
          <div>
            <Button label="By Food Cost" icon="pi pi-check" severity="secondary" outlined @click="applyFoodCostPrice" />
            <Button label="By Profit Margin" icon="pi pi-check" severity="secondary" outlined @click="applyProfitMarginPrice" />
          </div>
        </div>

        <div class="field form-span">
          <label>Notes</label>
          <Textarea v-model="costing.notes" rows="4" autoResize placeholder="Short costing notes..." />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="dialog-total">
            <span>Master Suggested Price</span>
            <strong>{{ formatCurrency(currentMasterSuggestedPrice) }}</strong>
          </div>

          <div class="dialog-actions">
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save Computation" icon="pi pi-check" @click="saveCosting" />
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteDialog" modal header="Delete Computation" :style="{ width: '28rem' }">
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ costing.product }}</strong> computation?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteCosting" />
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

.hero-actions,
.action-buttons,
.dialog-actions,
.calculator-actions > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats-grid,
.cost-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-box,
.cost-summary div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.cost-summary div {
  align-items: flex-start;
  flex-direction: column;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.stat-box span,
.cost-summary span {
  display: block;
  color: #64748b;
  font-size: 0.86rem;
  font-weight: 700;
}

.stat-box strong,
.cost-summary strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 1.35rem;
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

.card-header,
.section-header,
.dialog-footer {
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

.card-header p,
.section-header p {
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

.category-name strong,
.field label,
.section-header label {
  color: #0f172a;
  font-weight: 800;
}

.category-name span {
  color: #64748b;
  font-size: 0.86rem;
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

.field small {
  color: #dc2626;
  font-size: 0.8rem;
}

.full-input {
  width: 100%;
}

.ingredient-list,
.packaging-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-row {
  display: grid;
  grid-template-columns: 1fr 140px 120px 120px 120px 110px auto;
  gap: 10px;
  align-items: start;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.packaging-row {
  display: grid;
  grid-template-columns: 1fr 160px auto;
  gap: 10px;
  align-items: center;
}

.row-result {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #64748b;
  font-size: 0.85rem;
}

.row-result strong {
  color: #0f172a;
}

.dialog-footer {
  width: 100%;
  margin-bottom: 0;
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

  .ingredient-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .hero-card,
  .card-header,
  .section-header,
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
  .cost-summary,
  .form-grid,
  .ingredient-row,
  .packaging-row {
    grid-template-columns: 1fr;
  }

  .form-span {
    grid-column: span 1;
  }

  .search-box {
    width: 100%;
    min-width: 0;
  }

  .dialog-actions,
  .calculator-actions > div {
    width: 100%;
    flex-direction: column-reverse;
  }

  .dialog-actions :deep(.p-button),
  .calculator-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>