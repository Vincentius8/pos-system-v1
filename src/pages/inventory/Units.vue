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
const unitDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const unitTypeOptions = ref([
  'Weight',
  'Volume',
  'Count',
  'Packaging',
  'Serving',
  'Others'
])

const statusOptions = ref(['Active', 'Inactive'])

const emptyUnit = {
  id: null,
  name: '',
  abbreviation: '',
  type: '',
  baseUnit: '',
  conversionValue: 1,
  status: 'Active',
  description: ''
}

const unit = ref({ ...emptyUnit })

const units = ref([
  {
    id: 1,
    name: 'Kilogram',
    abbreviation: 'kg',
    type: 'Weight',
    baseUnit: 'gram',
    conversionValue: 1000,
    status: 'Active',
    description: 'Used for bulk ingredients such as coffee beans, rice, meat, and powders.'
  },
  {
    id: 2,
    name: 'Gram',
    abbreviation: 'g',
    type: 'Weight',
    baseUnit: 'gram',
    conversionValue: 1,
    status: 'Active',
    description: 'Base unit for small weight measurements in recipe costing.'
  },
  {
    id: 3,
    name: 'Liter',
    abbreviation: 'L',
    type: 'Volume',
    baseUnit: 'milliliter',
    conversionValue: 1000,
    status: 'Active',
    description: 'Used for milk, water, syrups, sauces, and liquid ingredients.'
  },
  {
    id: 4,
    name: 'Milliliter',
    abbreviation: 'ml',
    type: 'Volume',
    baseUnit: 'milliliter',
    conversionValue: 1,
    status: 'Active',
    description: 'Base unit for liquid recipe measurements.'
  },
  {
    id: 5,
    name: 'Piece',
    abbreviation: 'pc',
    type: 'Count',
    baseUnit: 'piece',
    conversionValue: 1,
    status: 'Active',
    description: 'Used for eggs, packaging items, toppings, and countable ingredients.'
  },
  {
    id: 6,
    name: 'Pack',
    abbreviation: 'pack',
    type: 'Packaging',
    baseUnit: 'piece',
    conversionValue: 50,
    status: 'Active',
    description: 'Used for packaged inventory items such as cups, lids, straws, and wrappers.'
  },
  {
    id: 7,
    name: 'Cup',
    abbreviation: 'cup',
    type: 'Serving',
    baseUnit: 'milliliter',
    conversionValue: 240,
    status: 'Active',
    description: 'Used for recipe formulas and serving-size based measurements.'
  },
  {
    id: 8,
    name: 'Shot',
    abbreviation: 'shot',
    type: 'Serving',
    baseUnit: 'milliliter',
    conversionValue: 30,
    status: 'Active',
    description: 'Used for espresso shots and beverage recipe formulas.'
  },
  {
    id: 9,
    name: 'Scoop',
    abbreviation: 'scoop',
    type: 'Serving',
    baseUnit: 'gram',
    conversionValue: 15,
    status: 'Inactive',
    description: 'Used for powders, toppings, frappe bases, and dry recipe ingredients.'
  }
])

const filteredUnits = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return units.value

  return units.value.filter((item) =>
    item.name.toLowerCase().includes(keyword) ||
    item.abbreviation.toLowerCase().includes(keyword) ||
    item.type.toLowerCase().includes(keyword) ||
    item.baseUnit.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword)
  )
})

const totalUnits = computed(() => units.value.length)

const activeUnits = computed(() =>
  units.value.filter((item) => item.status === 'Active').length
)

const unitTypes = computed(() => {
  const types = units.value.map((item) => item.type).filter(Boolean)
  return new Set(types).size
})

const conversionUnits = computed(() =>
  units.value.filter((item) => Number(item.conversionValue) > 1).length
)

const openNew = () => {
  unit.value = { ...emptyUnit }
  submitted.value = false
  isEditMode.value = false
  unitDialog.value = true
}

const editUnit = (data) => {
  unit.value = { ...data }
  submitted.value = false
  isEditMode.value = true
  unitDialog.value = true
}

const hideDialog = () => {
  unitDialog.value = false
  submitted.value = false
}

const saveUnit = () => {
  submitted.value = true

  if (
    !unit.value.name.trim() ||
    !unit.value.abbreviation.trim() ||
    !unit.value.type ||
    !unit.value.baseUnit.trim()
  ) {
    return
  }

  const payload = {
    ...unit.value,
    abbreviation: unit.value.abbreviation.trim(),
    conversionValue: Number(unit.value.conversionValue || 1)
  }

  if (isEditMode.value) {
    const index = units.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      units.value[index] = payload
    }
  } else {
    units.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  unitDialog.value = false
  unit.value = { ...emptyUnit }
}

const confirmDeleteUnit = (data) => {
  unit.value = { ...data }
  deleteDialog.value = true
}

const deleteUnit = () => {
  units.value = units.value.filter((item) => item.id !== unit.value.id)
  deleteDialog.value = false
  unit.value = { ...emptyUnit }
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
        <span class="eyebrow">Inventory Unit Setup</span>
        <h1 class="page-title">Units</h1>
        <p class="page-subtitle">
          Manage measurement units used for ingredients, recipes, stock monitoring,
          purchasing, and future automatic inventory conversion.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="Add Unit" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Units</span>
          <strong>{{ totalUnits }}</strong>
        </div>
        <i class="pi pi-calculator"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Active Units</span>
          <strong>{{ activeUnits }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Unit Types</span>
          <strong>{{ unitTypes }}</strong>
        </div>
        <i class="pi pi-sitemap"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Conversions</span>
          <strong>{{ conversionUnits }}</strong>
        </div>
        <i class="pi pi-sync"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Unit List</h3>
          <p>View, search, add, edit, activate, deactivate, or delete measurement units.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search unit..." />
        </div>
      </div>

      <DataTable
        :value="filteredUnits"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 70rem"
      >
        <Column field="name" header="Unit" sortable>
          <template #body="slotProps">
            <div class="category-name">
              <strong>{{ slotProps.data.name }}</strong>
              <span>{{ slotProps.data.description }}</span>
            </div>
          </template>
        </Column>

        <Column field="abbreviation" header="Abbreviation" sortable>
          <template #body="slotProps">
            <span class="unit-code">{{ slotProps.data.abbreviation }}</span>
          </template>
        </Column>

        <Column field="type" header="Type" sortable />

        <Column field="baseUnit" header="Base Unit" sortable>
          <template #body="slotProps">
            {{ slotProps.data.baseUnit }}
          </template>
        </Column>

        <Column field="conversionValue" header="Conversion" sortable>
          <template #body="slotProps">
            1 {{ slotProps.data.abbreviation }} =
            {{ slotProps.data.conversionValue }} {{ slotProps.data.baseUnit }}
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
                aria-label="Edit unit"
                @click="editUnit(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.status === 'Active' ? 'pi pi-eye-slash' : 'pi pi-eye'"
                rounded
                text
                severity="secondary"
                aria-label="Toggle unit status"
                @click="toggleStatus(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete unit"
                @click="confirmDeleteUnit(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No units found.</p>
            <span>Try another keyword or add a new unit.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="unitDialog"
      modal
      :header="isEditMode ? 'Edit Unit' : 'Add Unit'"
      :style="{ width: '40rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="name">Unit Name</label>
          <InputText
            id="name"
            v-model="unit.name"
            placeholder="Example: Kilogram"
            :invalid="submitted && !unit.name"
          />
          <small v-if="submitted && !unit.name">Unit name is required.</small>
        </div>

        <div class="field">
          <label for="abbreviation">Abbreviation</label>
          <InputText
            id="abbreviation"
            v-model="unit.abbreviation"
            placeholder="Example: kg"
            :invalid="submitted && !unit.abbreviation"
          />
          <small v-if="submitted && !unit.abbreviation">Abbreviation is required.</small>
        </div>

        <div class="field">
          <label for="type">Unit Type</label>
          <Select
            id="type"
            v-model="unit.type"
            :options="unitTypeOptions"
            placeholder="Select type"
            :invalid="submitted && !unit.type"
          />
          <small v-if="submitted && !unit.type">Unit type is required.</small>
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="unit.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field">
          <label for="baseUnit">Base Unit</label>
          <InputText
            id="baseUnit"
            v-model="unit.baseUnit"
            placeholder="Example: gram"
            :invalid="submitted && !unit.baseUnit"
          />
          <small v-if="submitted && !unit.baseUnit">Base unit is required.</small>
        </div>

        <div class="field">
          <label for="conversionValue">Conversion Value</label>
          <InputNumber
            id="conversionValue"
            v-model="unit.conversionValue"
            class="full-input"
            inputClass="full-input"
            :min="0"
            :minFractionDigits="0"
            :maxFractionDigits="4"
          />
        </div>

        <div class="field form-span">
          <label for="description">Description</label>
          <Textarea
            id="description"
            v-model="unit.description"
            rows="4"
            autoResize
            placeholder="Short description of this unit..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save Unit" icon="pi pi-check" @click="saveUnit" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Unit"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ unit.name }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteUnit" />
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

.unit-code {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
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