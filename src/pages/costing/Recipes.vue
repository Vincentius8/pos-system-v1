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
const recipeDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)
const activeRecipeSize = ref('')
const newRecipeSize = ref('')

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

const sizeOptions = ref([
  '8oz',
  '12oz',
  '16oz',
  '22oz',
  'Regular',
  'Large'
])

const unitOptions = ref([
  'ml',
  'liter',
  'gram',
  'kg',
  'pcs',
  'cup',
  'cups',
  'shot',
  'shots',
  'tbsp',
  'tsp',
  'scoop',
  'scoops',
  'pump',
  'pumps'
])

const emptyFormulaRow = {
  size: '',
  ingredient: '',
  quantity: 0,
  unit: ''
}

const emptyRecipe = {
  id: null,
  name: '',
  product: '',
  category: '',
  ingredients: 0,
  estimatedCost: 0,
  sellingPrice: 0,
  servingSize: '',
  preparationTime: '',
  status: 'Active',
  image: '',
  description: '',
  formula: []
}

const recipe = ref({ ...emptyRecipe })

const recipes = ref([
  {
    id: 1,
    name: 'Spanish Latte Recipe',
    product: 'Spanish Latte',
    category: 'Coffee',
    ingredients: 8,
    estimatedCost: 58,
    sellingPrice: 145,
    servingSize: '16oz',
    preparationTime: '5 mins',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    description: 'Espresso, milk, condensed milk, vanilla syrup, and ice for a creamy Spanish latte.',
    formula: [
      { size: '16oz', ingredient: 'Fresh Milk', quantity: 2, unit: 'cups' },
      { size: '16oz', ingredient: 'Espresso Shot', quantity: 1, unit: 'shot' },
      { size: '16oz', ingredient: 'Condensed Milk', quantity: 30, unit: 'ml' },
      { size: '16oz', ingredient: 'Ice Cube', quantity: 1, unit: 'cup' },
      { size: '22oz', ingredient: 'Fresh Milk', quantity: 3, unit: 'cups' },
      { size: '22oz', ingredient: 'Espresso Shot', quantity: 2, unit: 'shots' },
      { size: '22oz', ingredient: 'Condensed Milk', quantity: 45, unit: 'ml' },
      { size: '22oz', ingredient: 'Ice Cube', quantity: 1.5, unit: 'cups' }
    ]
  },
  {
    id: 2,
    name: 'Caramel Macchiato Recipe',
    product: 'Caramel Macchiato',
    category: 'Coffee',
    ingredients: 4,
    estimatedCost: 64,
    sellingPrice: 155,
    servingSize: '16oz',
    preparationTime: '6 mins',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
    description: 'Espresso, milk, vanilla syrup, caramel sauce, ice, and whipped topping.',
    formula: [
      { size: '16oz', ingredient: 'Fresh Milk', quantity: 2, unit: 'cups' },
      { size: '16oz', ingredient: 'Espresso Shot', quantity: 1, unit: 'shot' },
      { size: '16oz', ingredient: 'Vanilla Syrup', quantity: 20, unit: 'ml' },
      { size: '16oz', ingredient: 'Caramel Sauce', quantity: 20, unit: 'ml' }
    ]
  },
  {
    id: 3,
    name: 'Matcha Latte Recipe',
    product: 'Matcha Latte',
    category: 'Non-Coffee',
    ingredients: 4,
    estimatedCost: 52,
    sellingPrice: 150,
    servingSize: '16oz',
    preparationTime: '5 mins',
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    description: 'Matcha powder, milk, sweetener, and ice for a smooth non-coffee drink.',
    formula: [
      { size: '16oz', ingredient: 'Matcha Powder', quantity: 2, unit: 'scoops' },
      { size: '16oz', ingredient: 'Fresh Milk', quantity: 2, unit: 'cups' },
      { size: '16oz', ingredient: 'Sugar Syrup', quantity: 20, unit: 'ml' },
      { size: '16oz', ingredient: 'Ice Cube', quantity: 1, unit: 'cup' }
    ]
  }
])

const filteredRecipes = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return recipes.value

  return recipes.value.filter((item) =>
    item.name.toLowerCase().includes(keyword) ||
    item.product.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword)
  )
})

const recipeSizes = computed(() => {
  const sizes = recipe.value.formula
    .map((item) => item.size)
    .filter(Boolean)

  return [...new Set(sizes)]
})

const filteredFormulaRows = computed(() => {
  if (!activeRecipeSize.value) return []
  return recipe.value.formula.filter((item) => item.size === activeRecipeSize.value)
})

const totalRecipes = computed(() => recipes.value.length)

const activeRecipes = computed(() =>
  recipes.value.filter((item) => item.status === 'Active').length
)

const draftRecipes = computed(() =>
  recipes.value.filter((item) => item.status === 'Draft').length
)

const averageFoodCost = computed(() => {
  if (!recipes.value.length) return 0

  const total = recipes.value.reduce((sum, item) => {
    if (!item.sellingPrice) return sum
    return sum + (Number(item.estimatedCost) / Number(item.sellingPrice)) * 100
  }, 0)

  return Math.round(total / recipes.value.length)
})

const getRecipeSizeSummary = (item) => {
  const sizes = item.formula?.map((row) => row.size).filter(Boolean) || []
  const uniqueSizes = [...new Set(sizes)]

  if (!uniqueSizes.length) return 'No sizes'
  return uniqueSizes.join(', ')
}

const openNew = () => {
  recipe.value = {
    ...emptyRecipe,
    formula: []
  }

  activeRecipeSize.value = ''
  newRecipeSize.value = ''
  submitted.value = false
  isEditMode.value = false
  recipeDialog.value = true
}

const editRecipe = (data) => {
  recipe.value = {
    ...data,
    formula: data.formula?.length
      ? data.formula.map((item) => ({ ...item }))
      : []
  }

  activeRecipeSize.value = recipe.value.formula[0]?.size || ''
  newRecipeSize.value = ''
  submitted.value = false
  isEditMode.value = true
  recipeDialog.value = true
}

const hideDialog = () => {
  recipeDialog.value = false
  submitted.value = false
}

const addRecipeSize = () => {
  if (!newRecipeSize.value) return

  const sizeAlreadyExists = recipeSizes.value.includes(newRecipeSize.value)

  if (!sizeAlreadyExists) {
    recipe.value.formula.push({
      ...emptyFormulaRow,
      size: newRecipeSize.value
    })
  }

  activeRecipeSize.value = newRecipeSize.value
  recipe.value.servingSize = recipe.value.servingSize || newRecipeSize.value
  newRecipeSize.value = ''
}

const removeRecipeSize = (size) => {
  recipe.value.formula = recipe.value.formula.filter((item) => item.size !== size)

  if (activeRecipeSize.value === size) {
    activeRecipeSize.value = recipeSizes.value[0] || ''
  }
}

const addFormulaRow = () => {
  if (!activeRecipeSize.value) return

  recipe.value.formula.push({
    ...emptyFormulaRow,
    size: activeRecipeSize.value
  })
}

const removeFormulaRow = (row) => {
  const index = recipe.value.formula.indexOf(row)

  if (index !== -1) {
    recipe.value.formula.splice(index, 1)
  }

  const hasActiveSizeRows = recipe.value.formula.some(
    (item) => item.size === activeRecipeSize.value
  )

  if (!hasActiveSizeRows && activeRecipeSize.value) {
    recipe.value.formula.push({
      ...emptyFormulaRow,
      size: activeRecipeSize.value
    })
  }
}

const saveRecipe = () => {
  submitted.value = true

  if (!recipe.value.name.trim() || !recipe.value.product || !recipe.value.category) {
    return
  }

  const cleanedFormula = recipe.value.formula.filter((item) =>
    item.size ||
    item.ingredient ||
    Number(item.quantity) > 0 ||
    item.unit
  )

  const payload = {
    ...recipe.value,
    ingredients: cleanedFormula.length || Number(recipe.value.ingredients || 0),
    estimatedCost: Number(recipe.value.estimatedCost || 0),
    sellingPrice: Number(recipe.value.sellingPrice || 0),
    formula: cleanedFormula,
    image:
      recipe.value.image ||
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80'
  }

  if (isEditMode.value) {
    const index = recipes.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      recipes.value[index] = payload
    }
  } else {
    recipes.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  recipeDialog.value = false
  recipe.value = { ...emptyRecipe }
  activeRecipeSize.value = ''
  newRecipeSize.value = ''
}

const confirmDeleteRecipe = (data) => {
  recipe.value = { ...data }
  deleteDialog.value = true
}

const deleteRecipe = () => {
  recipes.value = recipes.value.filter((item) => item.id !== recipe.value.id)
  deleteDialog.value = false
  recipe.value = { ...emptyRecipe }
}

const toggleStatus = (data) => {
  data.status = data.status === 'Active' ? 'Inactive' : 'Active'
}

const getMargin = (item) => {
  return Number(item.sellingPrice || 0) - Number(item.estimatedCost || 0)
}

const getFoodCostPercent = (item) => {
  if (!Number(item.sellingPrice)) return 0
  return Math.round((Number(item.estimatedCost) / Number(item.sellingPrice)) * 100)
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
        <span class="eyebrow">Recipe & Costing Setup</span>
        <h1 class="page-title">Recipes</h1>
        <p class="page-subtitle">
          Manage product recipes, serving sizes, timplada, preparation details, estimated cost,
          selling price, and food cost percentage.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="Add Recipe" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Recipes</span>
          <strong>{{ totalRecipes }}</strong>
        </div>
        <i class="pi pi-book"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Active Recipes</span>
          <strong>{{ activeRecipes }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Draft Recipes</span>
          <strong>{{ draftRecipes }}</strong>
        </div>
        <i class="pi pi-file-edit"></i>
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
          <h3>Recipe List</h3>
          <p>View, search, add, edit, activate, deactivate, or delete product recipes.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search recipe..." />
        </div>
      </div>

      <DataTable
        :value="filteredRecipes"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 82rem"
      >
        <Column header="Recipe" sortable sortField="name">
          <template #body="slotProps">
            <div class="product-info">
              <Image
                :src="slotProps.data.image"
                :alt="slotProps.data.name"
                preview
                imageClass="product-image"
              />

              <div class="category-name">
                <strong>{{ slotProps.data.name }}</strong>
                <span>{{ slotProps.data.description }}</span>
              </div>
            </div>
          </template>
        </Column>

        <Column field="product" header="Product" sortable />
        <Column field="category" header="Category" sortable />

        <Column header="Sizes">
          <template #body="slotProps">
            {{ getRecipeSizeSummary(slotProps.data) }}
          </template>
        </Column>

        <Column field="ingredients" header="Formula Rows" sortable>
          <template #body="slotProps">
            {{ slotProps.data.formula?.length || slotProps.data.ingredients }} rows
          </template>
        </Column>

        <Column field="estimatedCost" header="Cost" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.estimatedCost) }}
          </template>
        </Column>

        <Column field="sellingPrice" header="Price" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.sellingPrice) }}
          </template>
        </Column>

        <Column header="Margin">
          <template #body="slotProps">
            {{ formatCurrency(getMargin(slotProps.data)) }}
          </template>
        </Column>

        <Column header="Food Cost">
          <template #body="slotProps">
            {{ getFoodCostPercent(slotProps.data) }}
          </template>
        </Column>

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
                icon="pi pi-pencil"
                rounded
                text
                severity="secondary"
                aria-label="Edit recipe"
                @click="editRecipe(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.status === 'Active' ? 'pi pi-eye-slash' : 'pi pi-eye'"
                rounded
                text
                severity="secondary"
                aria-label="Toggle recipe status"
                @click="toggleStatus(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete recipe"
                @click="confirmDeleteRecipe(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No recipes found.</p>
            <span>Try another keyword or add a new recipe.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="recipeDialog"
      modal
      :header="isEditMode ? 'Edit Recipe' : 'Add Recipe'"
      :style="{ width: '58rem' }"
      :breakpoints="{ '960px': '85vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="name">Recipe Name</label>
          <InputText
            id="name"
            v-model="recipe.name"
            placeholder="Example: Spanish Latte Recipe"
            :invalid="submitted && !recipe.name"
          />
          <small v-if="submitted && !recipe.name">Recipe name is required.</small>
        </div>

        <div class="field">
          <label for="product">Linked Product</label>
          <Select
            id="product"
            v-model="recipe.product"
            :options="productOptions"
            placeholder="Select product"
            :invalid="submitted && !recipe.product"
          />
          <small v-if="submitted && !recipe.product">Product is required.</small>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <Select
            id="category"
            v-model="recipe.category"
            :options="categoryOptions"
            placeholder="Select category"
            :invalid="submitted && !recipe.category"
          />
          <small v-if="submitted && !recipe.category">Category is required.</small>
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="recipe.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field">
          <label for="estimatedCost">Estimated Cost</label>
          <InputNumber
            id="estimatedCost"
            v-model="recipe.estimatedCost"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="sellingPrice">Selling Price</label>
          <InputNumber
            id="sellingPrice"
            v-model="recipe.sellingPrice"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="servingSize">Default Serving Size</label>
          <InputText
            id="servingSize"
            v-model="recipe.servingSize"
            placeholder="Example: 16oz"
          />
        </div>

        <div class="field">
          <label for="preparationTime">Preparation Time</label>
          <InputText
            id="preparationTime"
            v-model="recipe.preparationTime"
            placeholder="Example: 5 mins"
          />
        </div>

        <div class="field form-span">
          <div class="formula-header">
            <div>
              <label>Recipe Sizes / Timplada</label>
              <p>
                Add a size first, select it, then manage ingredients for that selected size only.
              </p>
            </div>
          </div>

          <div class="size-builder">
            <Select
              v-model="newRecipeSize"
              :options="sizeOptions"
              placeholder="Select size"
            />

            <Button
              label="Add Size"
              icon="pi pi-plus"
              severity="secondary"
              outlined
              @click="addRecipeSize"
            />
          </div>

          <div
            v-if="recipeSizes.length"
            class="size-tabs"
          >
            <Button
              v-for="size in recipeSizes"
              :key="size"
              :label="size"
              :severity="activeRecipeSize === size ? 'primary' : 'secondary'"
              :outlined="activeRecipeSize !== size"
              size="small"
              @click="activeRecipeSize = size"
            />

            <Button
              v-if="activeRecipeSize"
              icon="pi pi-trash"
              label="Remove Size"
              severity="danger"
              outlined
              size="small"
              @click="removeRecipeSize(activeRecipeSize)"
            />
          </div>

          <div
            v-if="activeRecipeSize"
            class="formula-panel"
          >
            <div class="formula-panel-header">
              <div>
                <strong>{{ activeRecipeSize }} Formula</strong>
                <span>
                  Add ingredients, quantities, and units for this selected size.
                </span>
              </div>

              <Button
                label="Add Ingredient"
                icon="pi pi-plus"
                size="small"
                severity="secondary"
                outlined
                @click="addFormulaRow"
              />
            </div>

            <div class="formula-list">
              <div
                v-for="row in filteredFormulaRows"
                :key="`${row.size}-${row.ingredient}-${row.unit}-${row.quantity}`"
                class="formula-row"
              >
                <InputText
                  v-model="row.ingredient"
                  placeholder="Ingredient"
                />

                <InputNumber
                  v-model="row.quantity"
                  placeholder="Qty"
                  inputClass="full-input"
                  :min="0"
                  :minFractionDigits="0"
                  :maxFractionDigits="2"
                />

                <Select
                  v-model="row.unit"
                  :options="unitOptions"
                  placeholder="Unit"
                />

                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  aria-label="Remove ingredient row"
                  @click="removeFormulaRow(row)"
                />
              </div>
            </div>
          </div>

          <div
            v-else
            class="empty-formula"
          >
            <i class="pi pi-info-circle"></i>
            <p>No size selected yet.</p>
            <span>Select a size above, then click Add Size to start building the recipe formula.</span>
          </div>
        </div>

        <div class="field form-span">
          <label for="image">Image URL</label>
          <InputText
            id="image"
            v-model="recipe.image"
            placeholder="Paste recipe image URL"
          />
        </div>

        <div class="field form-span">
          <label for="description">Description</label>
          <Textarea
            id="description"
            v-model="recipe.description"
            rows="4"
            autoResize
            placeholder="Short recipe description..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save Recipe" icon="pi pi-check" @click="saveRecipe" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Recipe"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ recipe.name }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteRecipe" />
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

.formula-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.formula-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
}

.size-builder {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  margin-top: 8px;
}

.size-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.formula-panel {
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.formula-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.formula-panel-header strong {
  display: block;
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 800;
}

.formula-panel-header span {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-size: 0.85rem;
}

.formula-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.formula-row {
  display: grid;
  grid-template-columns: 1fr 110px 130px auto;
  gap: 10px;
  align-items: center;
}

.empty-formula {
  margin-top: 12px;
  padding: 22px;
  text-align: center;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  background: #f8fafc;
}

.empty-formula i {
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  font-size: 1.4rem;
}

.empty-formula p {
  margin: 0;
  color: #0f172a;
  font-weight: 800;
}

.empty-formula span {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-size: 0.85rem;
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
  .card-header {
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

  .formula-header,
  .formula-panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .size-builder {
    grid-template-columns: 1fr;
  }

  .formula-row {
    grid-template-columns: 1fr;
  }
}
</style>