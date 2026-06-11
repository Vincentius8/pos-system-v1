<script setup>
import { computed, ref } from 'vue'

import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'

const search = ref('')
const categoryDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const emptyCategory = {
  id: null,
  name: '',
  code: '',
  items: 0,
  status: 'Active',
  description: ''
}

const category = ref({ ...emptyCategory })

const categories = ref([
  {
    id: 1,
    name: 'Coffee',
    code: 'COF',
    items: 12,
    status: 'Active',
    description: 'Espresso-based and brewed coffee menu items.'
  },
  {
    id: 2,
    name: 'Non-Coffee',
    code: 'NCF',
    items: 8,
    status: 'Active',
    description: 'Chocolate, matcha, tea, and other non-coffee drinks.'
  },
  {
    id: 3,
    name: 'Frappe',
    code: 'FRP',
    items: 10,
    status: 'Active',
    description: 'Blended iced beverages with cream and toppings.'
  },
  {
    id: 4,
    name: 'Milk Tea',
    code: 'MT',
    items: 9,
    status: 'Active',
    description: 'Milk tea flavors, sinkers, and specialty tea drinks.'
  },
  {
    id: 5,
    name: 'Silogs',
    code: 'SLG',
    items: 7,
    status: 'Active',
    description: 'Rice meals served with egg and side dishes.'
  },
  {
    id: 6,
    name: 'Snacks',
    code: 'SNK',
    items: 11,
    status: 'Active',
    description: 'Light meals, pastries, sandwiches, and quick bites.'
  },
  {
    id: 7,
    name: 'Add-ons',
    code: 'ADD',
    items: 15,
    status: 'Active',
    description: 'Extra shots, pearls, syrups, whipped cream, and toppings.'
  },
  {
    id: 8,
    name: 'Seasonal Specials',
    code: 'SSP',
    items: 4,
    status: 'Inactive',
    description: 'Limited-time drinks and food menu items.'
  }
])

const filteredCategories = computed(() => {
  if (!search.value.trim()) return categories.value

  const keyword = search.value.toLowerCase()

  return categories.value.filter((item) =>
    item.name.toLowerCase().includes(keyword) ||
    item.code.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword)
  )
})

const totalCategories = computed(() => categories.value.length)
const activeCategories = computed(() =>
  categories.value.filter((item) => item.status === 'Active').length
)
const totalMenuItems = computed(() =>
  categories.value.reduce((total, item) => total + item.items, 0)
)

const openNew = () => {
  category.value = { ...emptyCategory }
  submitted.value = false
  isEditMode.value = false
  categoryDialog.value = true
}

const editCategory = (data) => {
  category.value = { ...data }
  submitted.value = false
  isEditMode.value = true
  categoryDialog.value = true
}

const hideDialog = () => {
  categoryDialog.value = false
  submitted.value = false
}

const saveCategory = () => {
  submitted.value = true

  if (!category.value.name.trim() || !category.value.code.trim()) return

  if (isEditMode.value) {
    const index = categories.value.findIndex((item) => item.id === category.value.id)

    if (index !== -1) {
      categories.value[index] = { ...category.value }
    }
  } else {
    category.value.id = Date.now()
    category.value.items = Number(category.value.items) || 0
    category.value.status = 'Active'

    categories.value.unshift({ ...category.value })
  }

  categoryDialog.value = false
  category.value = { ...emptyCategory }
}

const confirmDeleteCategory = (data) => {
  category.value = { ...data }
  deleteDialog.value = true
}

const deleteCategory = () => {
  categories.value = categories.value.filter((item) => item.id !== category.value.id)
  deleteDialog.value = false
  category.value = { ...emptyCategory }
}

const toggleStatus = (data) => {
  data.status = data.status === 'Active' ? 'Inactive' : 'Active'
}

const getStatusSeverity = (status) => {
  return status === 'Active' ? 'success' : 'secondary'
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Inventory Menu Setup</span>
        <h1 class="page-title">Categories</h1>
        <p class="page-subtitle">
          Manage food and drink menu categories such as Coffee, Non-Coffee, Frappe, Milk Tea,
          Silogs, Snacks, Add-ons, and other menu groups.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Add Category" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Categories</span>
          <strong>{{ totalCategories }}</strong>
        </div>
        <i class="pi pi-tags"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Active Categories</span>
          <strong>{{ activeCategories }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Total Menu Items</span>
          <strong>{{ totalMenuItems }}</strong>
        </div>
        <i class="pi pi-list"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Menu Category List</h3>
          <p>Search, add, edit, disable, or delete menu categories.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search category..." />
        </div>
      </div>

      <DataTable
        :value="filteredCategories"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 52rem"
      >
        <Column field="name" header="Category" sortable>
          <template #body="slotProps">
            <div class="category-name">
              <strong>{{ slotProps.data.name }}</strong>
              <span>{{ slotProps.data.description }}</span>
            </div>
          </template>
        </Column>

        <Column field="code" header="Code" sortable />

        <Column field="items" header="Menu Items" sortable>
          <template #body="slotProps">
            {{ slotProps.data.items }} items
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
                @click="editCategory(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.status === 'Active' ? 'pi pi-eye-slash' : 'pi pi-eye'"
                rounded
                text
                severity="secondary"
                @click="toggleStatus(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                @click="confirmDeleteCategory(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="categoryDialog"
      modal
      :header="isEditMode ? 'Edit Category' : 'Add Category'"
      :style="{ width: '34rem' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="name">Category Name</label>
          <InputText
            id="name"
            v-model="category.name"
            placeholder="Example: Coffee"
            :invalid="submitted && !category.name"
          />
          <small v-if="submitted && !category.name">Category name is required.</small>
        </div>

        <div class="field">
          <label for="code">Category Code</label>
          <InputText
            id="code"
            v-model="category.code"
            placeholder="Example: COF"
            :invalid="submitted && !category.code"
          />
          <small v-if="submitted && !category.code">Category code is required.</small>
        </div>

        <div class="field">
          <label for="items">Menu Items Count</label>
          <InputText id="items" v-model="category.items" placeholder="Example: 12" />
        </div>

        <div class="field">
          <label for="description">Description</label>
          <Textarea
            id="description"
            v-model="category.description"
            rows="4"
            autoResize
            placeholder="Short description of this category..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save Category" icon="pi pi-check" @click="saveCategory" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Category"
      :style="{ width: '28rem' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ category.name }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteCategory" />
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  gap: 16px;
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

@media (max-width: 900px) {
  .hero-card,
  .card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .search-box {
    width: 100%;
    min-width: 0;
  }
}
</style>