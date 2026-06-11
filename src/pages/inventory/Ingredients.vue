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
const ingredientDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const categoryOptions = ref([
  'Coffee Beans',
  'Milk',
  'Tea',
  'Powder Mix',
  'Syrups',
  'Sweeteners',
  'Toppings',
  'Sinkers',
  'Meat',
  'Vegetables',
  'Bread',
  'Condiments',
  'Packaging',
  'Others'
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

const emptyIngredient = {
  id: null,
  name: '',
  sku: '',
  category: '',
  unit: '',
  stock: 0,
  reorderLevel: 0,
  cost: 0,
  supplier: '',
  image: '',
  description: ''
}

const ingredient = ref({ ...emptyIngredient })

const ingredients = ref([
  {
    id: 1,
    name: 'Arabica Coffee Beans',
    sku: 'ING-001',
    category: 'Coffee Beans',
    unit: 'Kg',
    stock: 25,
    reorderLevel: 10,
    cost: 450,
    supplier: 'Royce Coffee Supply',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=80',
    description: 'Premium arabica beans used for espresso-based drinks.'
  },
  {
    id: 2,
    name: 'Fresh Milk',
    sku: 'ING-002',
    category: 'Milk',
    unit: 'Liter',
    stock: 18,
    reorderLevel: 8,
    cost: 95,
    supplier: 'Daily Dairy Supplier',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
    description: 'Fresh milk used for lattes, frappes, and milk-based drinks.'
  },
  {
    id: 3,
    name: 'Vanilla Syrup',
    sku: 'ING-003',
    category: 'Syrups',
    unit: 'Bottle',
    stock: 9,
    reorderLevel: 6,
    cost: 280,
    supplier: 'Flavor Hub PH',
    image: 'https://images.unsplash.com/photo-1606914469633-bd39206ea739?auto=format&fit=crop&w=400&q=80',
    description: 'Vanilla syrup used for coffee and non-coffee beverages.'
  },
  {
    id: 4,
    name: 'Tapioca Pearls',
    sku: 'ING-004',
    category: 'Sinkers',
    unit: 'Kg',
    stock: 6,
    reorderLevel: 8,
    cost: 160,
    supplier: 'Milk Tea Depot',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=400&q=80',
    description: 'Pearls used as sinkers for milk tea and specialty drinks.'
  },
  {
    id: 5,
    name: 'Whipped Cream',
    sku: 'ING-005',
    category: 'Toppings',
    unit: 'Can',
    stock: 0,
    reorderLevel: 5,
    cost: 210,
    supplier: 'Cafe Essentials',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
    description: 'Cream topping used for frappes and specialty beverages.'
  },
  {
    id: 6,
    name: 'Rice',
    sku: 'ING-006',
    category: 'Others',
    unit: 'Kg',
    stock: 40,
    reorderLevel: 15,
    cost: 62,
    supplier: 'Local Market Supplier',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    description: 'Rice used for silog meals and rice bowl products.'
  },
  {
    id: 7,
    name: 'Egg',
    sku: 'ING-007',
    category: 'Others',
    unit: 'Piece',
    stock: 36,
    reorderLevel: 20,
    cost: 9,
    supplier: 'Local Poultry Supplier',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
    description: 'Eggs used for silog meals, sandwiches, and selected food items.'
  },
  {
    id: 8,
    name: 'Food Packaging Cup',
    sku: 'ING-008',
    category: 'Packaging',
    unit: 'Pack',
    stock: 7,
    reorderLevel: 10,
    cost: 125,
    supplier: 'Packaging Depot',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    description: 'Disposable packaging used for takeaway food and drinks.'
  }
])

const getStockStatus = (item) => {
  if (Number(item.stock) <= 0) return 'Out of Stock'
  if (Number(item.stock) <= Number(item.reorderLevel)) return 'Low Stock'
  return 'In Stock'
}

const getStatusSeverity = (status) => {
  if (status === 'In Stock') return 'success'
  if (status === 'Low Stock') return 'warning'
  return 'danger'
}

const filteredIngredients = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return ingredients.value

  return ingredients.value.filter((item) =>
    item.name.toLowerCase().includes(keyword) ||
    item.sku.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword) ||
    item.supplier.toLowerCase().includes(keyword) ||
    getStockStatus(item).toLowerCase().includes(keyword)
  )
})

const totalIngredients = computed(() => ingredients.value.length)

const inStockIngredients = computed(() =>
  ingredients.value.filter((item) => getStockStatus(item) === 'In Stock').length
)

const lowStockIngredients = computed(() =>
  ingredients.value.filter((item) => getStockStatus(item) === 'Low Stock').length
)

const outOfStockIngredients = computed(() =>
  ingredients.value.filter((item) => getStockStatus(item) === 'Out of Stock').length
)

const openNew = () => {
  ingredient.value = { ...emptyIngredient }
  submitted.value = false
  isEditMode.value = false
  ingredientDialog.value = true
}

const editIngredient = (data) => {
  ingredient.value = { ...data }
  submitted.value = false
  isEditMode.value = true
  ingredientDialog.value = true
}

const hideDialog = () => {
  ingredientDialog.value = false
  submitted.value = false
}

const saveIngredient = () => {
  submitted.value = true

  if (
    !ingredient.value.name.trim() ||
    !ingredient.value.sku.trim() ||
    !ingredient.value.category ||
    !ingredient.value.unit
  ) {
    return
  }

  const payload = {
    ...ingredient.value,
    sku: ingredient.value.sku.toUpperCase(),
    stock: Number(ingredient.value.stock || 0),
    reorderLevel: Number(ingredient.value.reorderLevel || 0),
    cost: Number(ingredient.value.cost || 0),
    image:
      ingredient.value.image ||
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80'
  }

  if (isEditMode.value) {
    const index = ingredients.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      ingredients.value[index] = payload
    }
  } else {
    ingredients.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  ingredientDialog.value = false
  ingredient.value = { ...emptyIngredient }
}

const confirmDeleteIngredient = (data) => {
  ingredient.value = { ...data }
  deleteDialog.value = true
}

const deleteIngredient = () => {
  ingredients.value = ingredients.value.filter((item) => item.id !== ingredient.value.id)
  deleteDialog.value = false
  ingredient.value = { ...emptyIngredient }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(value)
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Inventory Ingredient Setup</span>
        <h1 class="page-title">Ingredients</h1>
        <p class="page-subtitle">
          Manage raw materials used for products, recipe costing, stock monitoring,
          purchasing, and future automatic inventory deduction.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="Add Ingredient" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Ingredients</span>
          <strong>{{ totalIngredients }}</strong>
        </div>
        <i class="pi pi-box"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>In Stock</span>
          <strong>{{ inStockIngredients }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Low Stock</span>
          <strong>{{ lowStockIngredients }}</strong>
        </div>
        <i class="pi pi-exclamation-triangle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Out of Stock</span>
          <strong>{{ outOfStockIngredients }}</strong>
        </div>
        <i class="pi pi-times-circle"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Ingredient List</h3>
          <p>View, search, add, edit, monitor, or delete raw material records.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search ingredient..." />
        </div>
      </div>

      <DataTable
        :value="filteredIngredients"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 76rem"
      >
        <Column header="Ingredient" sortable sortField="name">
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

        <Column field="sku" header="SKU" sortable />
        <Column field="category" header="Category" sortable />
        <Column field="unit" header="Unit" sortable />

        <Column field="stock" header="Stock" sortable>
          <template #body="slotProps">
            {{ slotProps.data.stock }} {{ slotProps.data.unit }}
          </template>
        </Column>

        <Column field="reorderLevel" header="Reorder" sortable>
          <template #body="slotProps">
            {{ slotProps.data.reorderLevel }} {{ slotProps.data.unit }}
          </template>
        </Column>

        <Column field="cost" header="Cost" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.cost) }}
          </template>
        </Column>

        <Column field="supplier" header="Supplier" sortable />

        <Column header="Status" sortable>
          <template #body="slotProps">
            <Tag
              :value="getStockStatus(slotProps.data)"
              :severity="getStatusSeverity(getStockStatus(slotProps.data))"
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
                aria-label="Edit ingredient"
                @click="editIngredient(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete ingredient"
                @click="confirmDeleteIngredient(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No ingredients found.</p>
            <span>Try another keyword or add a new ingredient.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="ingredientDialog"
      modal
      :header="isEditMode ? 'Edit Ingredient' : 'Add Ingredient'"
      :style="{ width: '44rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="name">Ingredient Name</label>
          <InputText
            id="name"
            v-model="ingredient.name"
            placeholder="Example: Arabica Coffee Beans"
            :invalid="submitted && !ingredient.name"
          />
          <small v-if="submitted && !ingredient.name">Ingredient name is required.</small>
        </div>

        <div class="field">
          <label for="sku">SKU</label>
          <InputText
            id="sku"
            v-model="ingredient.sku"
            placeholder="Example: ING-001"
            :invalid="submitted && !ingredient.sku"
          />
          <small v-if="submitted && !ingredient.sku">SKU is required.</small>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <Select
            id="category"
            v-model="ingredient.category"
            :options="categoryOptions"
            placeholder="Select category"
            :invalid="submitted && !ingredient.category"
          />
          <small v-if="submitted && !ingredient.category">Category is required.</small>
        </div>

        <div class="field">
          <label for="unit">Unit</label>
          <Select
            id="unit"
            v-model="ingredient.unit"
            :options="unitOptions"
            placeholder="Select unit"
            :invalid="submitted && !ingredient.unit"
          />
          <small v-if="submitted && !ingredient.unit">Unit is required.</small>
        </div>

        <div class="field">
          <label for="stock">Current Stock</label>
          <InputNumber
            id="stock"
            v-model="ingredient.stock"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="reorderLevel">Reorder Level</label>
          <InputNumber
            id="reorderLevel"
            v-model="ingredient.reorderLevel"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="cost">Cost</label>
          <InputNumber
            id="cost"
            v-model="ingredient.cost"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="supplier">Supplier</label>
          <InputText
            id="supplier"
            v-model="ingredient.supplier"
            placeholder="Example: Royce Coffee Supply"
          />
        </div>

        <div class="field form-span">
          <label for="image">Image URL</label>
          <InputText
            id="image"
            v-model="ingredient.image"
            placeholder="Paste ingredient image URL"
          />
        </div>

        <div class="field form-span">
          <label for="description">Description</label>
          <Textarea
            id="description"
            v-model="ingredient.description"
            rows="4"
            autoResize
            placeholder="Short ingredient description..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save Ingredient" icon="pi pi-check" @click="saveIngredient" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Ingredient"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ ingredient.name }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteIngredient" />
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
}
</style>