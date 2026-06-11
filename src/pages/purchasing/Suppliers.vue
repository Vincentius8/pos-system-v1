<script setup>
import { computed, ref } from 'vue'

import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'

const search = ref('')
const supplierDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const categoryOptions = ref([
  'Coffee Beans',
  'Milk & Dairy',
  'Tea & Powders',
  'Syrups',
  'Toppings & Sinkers',
  'Food Ingredients',
  'Packaging',
  'Cleaning Supplies',
  'Others'
])

const paymentTermOptions = ref([
  'Cash on Delivery',
  '7 Days',
  '15 Days',
  '30 Days',
  'Consignment',
  'Bank Transfer'
])

const statusOptions = ref(['Active', 'Inactive'])

const emptySupplier = {
  id: null,
  name: '',
  code: '',
  category: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  paymentTerms: '',
  status: 'Active',
  notes: ''
}

const supplier = ref({ ...emptySupplier })

const suppliers = ref([
  {
    id: 1,
    name: 'Royce Coffee Supply',
    code: 'SUP-001',
    category: 'Coffee Beans',
    contactPerson: 'Marco Reyes',
    phone: '0917 123 4567',
    email: 'orders@roycecoffee.ph',
    address: 'Quezon City, Metro Manila',
    paymentTerms: '15 Days',
    status: 'Active',
    notes: 'Main supplier for arabica beans, robusta beans, and espresso blend.'
  },
  {
    id: 2,
    name: 'Daily Dairy Supplier',
    code: 'SUP-002',
    category: 'Milk & Dairy',
    contactPerson: 'Anna Santos',
    phone: '0918 222 3344',
    email: 'sales@dailydairy.ph',
    address: 'Makati City, Metro Manila',
    paymentTerms: '7 Days',
    status: 'Active',
    notes: 'Fresh milk, evaporated milk, condensed milk, and alternative milk supplier.'
  },
  {
    id: 3,
    name: 'Milk Tea Depot',
    code: 'SUP-003',
    category: 'Toppings & Sinkers',
    contactPerson: 'Kevin Lim',
    phone: '0920 555 8811',
    email: 'support@milkteadepot.ph',
    address: 'Binondo, Manila',
    paymentTerms: 'Cash on Delivery',
    status: 'Active',
    notes: 'Pearls, pudding, crystal jelly, grass jelly, and milk tea supplies.'
  },
  {
    id: 4,
    name: 'Flavor Hub PH',
    code: 'SUP-004',
    category: 'Syrups',
    contactPerson: 'Mica Tan',
    phone: '0916 889 1200',
    email: 'orders@flavorhub.ph',
    address: 'Pasig City, Metro Manila',
    paymentTerms: '30 Days',
    status: 'Active',
    notes: 'Vanilla syrup, caramel syrup, hazelnut syrup, and flavor concentrates.'
  },
  {
    id: 5,
    name: 'Packaging Depot',
    code: 'SUP-005',
    category: 'Packaging',
    contactPerson: 'Leo Garcia',
    phone: '0915 300 7000',
    email: 'sales@packagingdepot.ph',
    address: 'Caloocan City, Metro Manila',
    paymentTerms: 'Bank Transfer',
    status: 'Active',
    notes: 'Cups, lids, straws, takeout bags, food boxes, and stickers.'
  },
  {
    id: 6,
    name: 'Local Market Supplier',
    code: 'SUP-006',
    category: 'Food Ingredients',
    contactPerson: 'Ramon Cruz',
    phone: '0922 444 9876',
    email: 'localmarket@example.com',
    address: 'Marikina Public Market',
    paymentTerms: 'Cash on Delivery',
    status: 'Inactive',
    notes: 'Rice, eggs, meat, vegetables, and daily food ingredient sourcing.'
  }
])

const filteredSuppliers = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return suppliers.value

  return suppliers.value.filter((item) =>
    item.name.toLowerCase().includes(keyword) ||
    item.code.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword) ||
    item.contactPerson.toLowerCase().includes(keyword) ||
    item.phone.toLowerCase().includes(keyword) ||
    item.email.toLowerCase().includes(keyword) ||
    item.paymentTerms.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.notes.toLowerCase().includes(keyword)
  )
})

const totalSuppliers = computed(() => suppliers.value.length)

const activeSuppliers = computed(() =>
  suppliers.value.filter((item) => item.status === 'Active').length
)

const inactiveSuppliers = computed(() =>
  suppliers.value.filter((item) => item.status === 'Inactive').length
)

const supplierCategories = computed(() => {
  const categories = suppliers.value.map((item) => item.category).filter(Boolean)
  return new Set(categories).size
})

const generateSupplierCode = () => {
  const nextNumber = String(suppliers.value.length + 1).padStart(3, '0')
  return `SUP-${nextNumber}`
}

const openNew = () => {
  supplier.value = {
    ...emptySupplier,
    code: generateSupplierCode()
  }

  submitted.value = false
  isEditMode.value = false
  supplierDialog.value = true
}

const editSupplier = (data) => {
  supplier.value = { ...data }
  submitted.value = false
  isEditMode.value = true
  supplierDialog.value = true
}

const hideDialog = () => {
  supplierDialog.value = false
  submitted.value = false
}

const saveSupplier = () => {
  submitted.value = true

  if (
    !supplier.value.name.trim() ||
    !supplier.value.code.trim() ||
    !supplier.value.category ||
    !supplier.value.contactPerson.trim()
  ) {
    return
  }

  const payload = {
    ...supplier.value,
    code: supplier.value.code.toUpperCase()
  }

  if (isEditMode.value) {
    const index = suppliers.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      suppliers.value[index] = payload
    }
  } else {
    suppliers.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  supplierDialog.value = false
  supplier.value = { ...emptySupplier }
}

const confirmDeleteSupplier = (data) => {
  supplier.value = { ...data }
  deleteDialog.value = true
}

const deleteSupplier = () => {
  suppliers.value = suppliers.value.filter((item) => item.id !== supplier.value.id)
  deleteDialog.value = false
  supplier.value = { ...emptySupplier }
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
        <span class="eyebrow">Procurement Setup</span>
        <h1 class="page-title">Suppliers</h1>
        <p class="page-subtitle">
          Manage supplier records, contact persons, supplied categories, payment terms,
          delivery sources, and procurement information.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Import" icon="pi pi-upload" severity="secondary" outlined />
        <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
        <Button label="Add Supplier" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Suppliers</span>
          <strong>{{ totalSuppliers }}</strong>
        </div>
        <i class="pi pi-truck"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Active Suppliers</span>
          <strong>{{ activeSuppliers }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Inactive Suppliers</span>
          <strong>{{ inactiveSuppliers }}</strong>
        </div>
        <i class="pi pi-eye-slash"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Supply Categories</span>
          <strong>{{ supplierCategories }}</strong>
        </div>
        <i class="pi pi-tags"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Supplier Directory</h3>
          <p>View, search, add, edit, activate, deactivate, or delete suppliers.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search supplier..." />
        </div>
      </div>

      <DataTable
        :value="filteredSuppliers"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 82rem"
      >
        <Column field="name" header="Supplier" sortable>
          <template #body="slotProps">
            <div class="supplier-info">
              <div class="supplier-avatar">
                <i class="pi pi-building"></i>
              </div>

              <div class="category-name">
                <strong>{{ slotProps.data.name }}</strong>
                <span>{{ slotProps.data.notes }}</span>
              </div>
            </div>
          </template>
        </Column>

        <Column field="code" header="Code" sortable>
          <template #body="slotProps">
            <span class="supplier-code">{{ slotProps.data.code }}</span>
          </template>
        </Column>

        <Column field="category" header="Category" sortable />

        <Column field="contactPerson" header="Contact Person" sortable />

        <Column header="Contact">
          <template #body="slotProps">
            <div class="contact-stack">
              <span>{{ slotProps.data.phone }}</span>
              <small>{{ slotProps.data.email }}</small>
            </div>
          </template>
        </Column>

        <Column field="paymentTerms" header="Payment Terms" sortable />

        <Column field="address" header="Address" sortable />

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
                aria-label="Edit supplier"
                @click="editSupplier(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.status === 'Active' ? 'pi pi-eye-slash' : 'pi pi-eye'"
                rounded
                text
                severity="secondary"
                aria-label="Toggle supplier status"
                @click="toggleStatus(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete supplier"
                @click="confirmDeleteSupplier(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No suppliers found.</p>
            <span>Try another keyword or add a new supplier.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="supplierDialog"
      modal
      :header="isEditMode ? 'Edit Supplier' : 'Add Supplier'"
      :style="{ width: '46rem' }"
      :breakpoints="{ '960px': '80vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="name">Supplier Name</label>
          <InputText
            id="name"
            v-model="supplier.name"
            placeholder="Example: Royce Coffee Supply"
            :invalid="submitted && !supplier.name"
          />
          <small v-if="submitted && !supplier.name">Supplier name is required.</small>
        </div>

        <div class="field">
          <label for="code">Supplier Code</label>
          <InputText
            id="code"
            v-model="supplier.code"
            placeholder="Example: SUP-001"
            :invalid="submitted && !supplier.code"
          />
          <small v-if="submitted && !supplier.code">Supplier code is required.</small>
        </div>

        <div class="field">
          <label for="category">Supply Category</label>
          <Select
            id="category"
            v-model="supplier.category"
            :options="categoryOptions"
            placeholder="Select category"
            :invalid="submitted && !supplier.category"
          />
          <small v-if="submitted && !supplier.category">Supply category is required.</small>
        </div>

        <div class="field">
          <label for="paymentTerms">Payment Terms</label>
          <Select
            id="paymentTerms"
            v-model="supplier.paymentTerms"
            :options="paymentTermOptions"
            placeholder="Select payment terms"
          />
        </div>

        <div class="field">
          <label for="contactPerson">Contact Person</label>
          <InputText
            id="contactPerson"
            v-model="supplier.contactPerson"
            placeholder="Example: Juan Dela Cruz"
            :invalid="submitted && !supplier.contactPerson"
          />
          <small v-if="submitted && !supplier.contactPerson">Contact person is required.</small>
        </div>

        <div class="field">
          <label for="phone">Phone Number</label>
          <InputText
            id="phone"
            v-model="supplier.phone"
            placeholder="Example: 0917 123 4567"
          />
        </div>

        <div class="field">
          <label for="email">Email Address</label>
          <InputText
            id="email"
            v-model="supplier.email"
            placeholder="Example: supplier@email.com"
          />
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="supplier.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field form-span">
          <label for="address">Address</label>
          <InputText
            id="address"
            v-model="supplier.address"
            placeholder="Supplier address"
          />
        </div>

        <div class="field form-span">
          <label for="notes">Notes</label>
          <Textarea
            id="notes"
            v-model="supplier.notes"
            rows="4"
            autoResize
            placeholder="Short supplier notes..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save Supplier" icon="pi pi-check" @click="saveSupplier" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Supplier"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ supplier.name }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteSupplier" />
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

.supplier-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.supplier-avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 16px;
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

.supplier-code {
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

.contact-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-stack span {
  color: #0f172a;
  font-weight: 700;
}

.contact-stack small {
  color: #64748b;
  font-size: 0.8rem;
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