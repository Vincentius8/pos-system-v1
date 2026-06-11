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
const productDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const isEditMode = ref(false)

const categoryOptions = ref([
  'Coffee',
  'Non-Coffee',
  'Frappe',
  'Milk Tea',
  'Silogs',
  'Snacks',
  'Add-ons',
  'Seasonal Specials'
])

const statusOptions = ref(['Available', 'Unavailable'])

const emptyProduct = {
  id: null,
  name: '',
  sku: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'Available',
  image: '',
  description: ''
}

const product = ref({ ...emptyProduct })

const products = ref([
  {
    id: 1,
    name: 'Spanish Latte',
    sku: 'COF-001',
    category: 'Coffee',
    price: 145,
    stock: 32,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    description: 'Espresso-based iced latte with creamy milk and sweet Spanish-style profile.'
  },
  {
    id: 2,
    name: 'Caramel Macchiato',
    sku: 'COF-002',
    category: 'Coffee',
    price: 155,
    stock: 28,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
    description: 'Rich espresso drink with milk, vanilla notes, and caramel drizzle.'
  },
  {
    id: 3,
    name: 'Matcha Latte',
    sku: 'NCF-001',
    category: 'Non-Coffee',
    price: 150,
    stock: 18,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    description: 'Smooth matcha drink with milk, balanced sweetness, and earthy flavor.'
  },
  {
    id: 4,
    name: 'Java Chip Frappe',
    sku: 'FRP-001',
    category: 'Frappe',
    price: 170,
    stock: 14,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
    description: 'Blended chocolate coffee frappe with chips, cream, and drizzle.'
  },
  {
    id: 5,
    name: 'Wintermelon Milk Tea',
    sku: 'MT-001',
    category: 'Milk Tea',
    price: 120,
    stock: 25,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=400&q=80',
    description: 'Classic milk tea with wintermelon flavor and optional sinkers.'
  },
  {
    id: 6,
    name: 'Tapsilog',
    sku: 'SLG-001',
    category: 'Silogs',
    price: 135,
    stock: 10,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    description: 'Rice meal with tapa, garlic rice, egg, and house sauce.'
  },
  {
    id: 7,
    name: 'Cheesy Fries',
    sku: 'SNK-001',
    category: 'Snacks',
    price: 95,
    stock: 20,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=400&q=80',
    description: 'Crispy fries topped with cheese sauce and savory seasoning.'
  },
  {
    id: 8,
    name: 'Extra Espresso Shot',
    sku: 'ADD-001',
    category: 'Add-ons',
    price: 35,
    stock: 0,
    status: 'Unavailable',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    description: 'Additional espresso shot for selected coffee beverages.'
  }
])

const filteredProducts = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return products.value

  return products.value.filter((item) =>
    item.name.toLowerCase().includes(keyword) ||
    item.sku.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword)
  )
})

const totalProducts = computed(() => products.value.length)

const availableProducts = computed(() =>
  products.value.filter((item) => item.status === 'Available').length
)

const lowStockProducts = computed(() =>
  products.value.filter((item) => Number(item.stock) <= 10).length
)

const openNew = () => {
  product.value = { ...emptyProduct }
  submitted.value = false
  isEditMode.value = false
  productDialog.value = true
}

const editProduct = (data) => {
  product.value = { ...data }
  submitted.value = false
  isEditMode.value = true
  productDialog.value = true
}

const hideDialog = () => {
  productDialog.value = false
  submitted.value = false
}

const saveProduct = () => {
  submitted.value = true

  if (!product.value.name.trim() || !product.value.sku.trim() || !product.value.category) {
    return
  }

  const payload = {
    ...product.value,
    sku: product.value.sku.toUpperCase(),
    price: Number(product.value.price || 0),
    stock: Number(product.value.stock || 0),
    image:
      product.value.image ||
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80'
  }

  if (isEditMode.value) {
    const index = products.value.findIndex((item) => item.id === payload.id)

    if (index !== -1) {
      products.value[index] = payload
    }
  } else {
    products.value.unshift({
      ...payload,
      id: Date.now()
    })
  }

  productDialog.value = false
  product.value = { ...emptyProduct }
}

const confirmDeleteProduct = (data) => {
  product.value = { ...data }
  deleteDialog.value = true
}

const deleteProduct = () => {
  products.value = products.value.filter((item) => item.id !== product.value.id)
  deleteDialog.value = false
  product.value = { ...emptyProduct }
}

const toggleStatus = (data) => {
  data.status = data.status === 'Available' ? 'Unavailable' : 'Available'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(value)
}

const getStatusSeverity = (status) => {
  return status === 'Available' ? 'success' : 'secondary'
}
</script>

<template>
  <section class="categories-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Inventory Product Setup</span>
        <h1 class="page-title">Products</h1>
        <p class="page-subtitle">
          Manage product information, menu images, category assignment, pricing, stock count,
          and product availability for the POS menu.
        </p>
      </div>

      <div class="hero-actions">
        <Button
          label="Import"
          icon="pi pi-upload"
          severity="secondary"
          outlined
        />

        <Button
          label="Export"
          icon="pi pi-download"
          severity="secondary"
          outlined
        />

        <Button label="Add Product" icon="pi pi-plus" @click="openNew" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Products</span>
          <strong>{{ totalProducts }}</strong>
        </div>
        <i class="pi pi-box"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Available Products</span>
          <strong>{{ availableProducts }}</strong>
        </div>
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Low Stock Items</span>
          <strong>{{ lowStockProducts }}</strong>
        </div>
        <i class="pi pi-exclamation-circle"></i>
      </div>
    </div>

    <section class="surface-card table-card">
      <div class="card-header">
        <div>
          <h3>Product List</h3>
          <p>View, search, add, edit, disable, or delete POS menu products.</p>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <InputText v-model="search" placeholder="Search product..." />
        </div>
      </div>

      <DataTable
        :value="filteredProducts"
        dataKey="id"
        paginator
        :rows="6"
        responsiveLayout="scroll"
        tableStyle="min-width: 64rem"
      >
        <Column header="Product" sortable sortField="name">
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

        <Column field="price" header="Price" sortable>
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.price) }}
          </template>
        </Column>

        <Column field="stock" header="Stock" sortable>
          <template #body="slotProps">
            {{ slotProps.data.stock }} pcs
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
                aria-label="Edit product"
                @click="editProduct(slotProps.data)"
              />
              <Button
                :icon="slotProps.data.status === 'Available' ? 'pi pi-eye-slash' : 'pi pi-eye'"
                rounded
                text
                severity="secondary"
                aria-label="Toggle product status"
                @click="toggleStatus(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                aria-label="Delete product"
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="empty-state">
            <i class="pi pi-search"></i>
            <p>No products found.</p>
            <span>Try another keyword or add a new product.</span>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      v-model:visible="productDialog"
      modal
      :header="isEditMode ? 'Edit Product' : 'Add Product'"
      :style="{ width: '42rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="form-grid">
        <div class="field">
          <label for="name">Product Name</label>
          <InputText
            id="name"
            v-model="product.name"
            placeholder="Example: Spanish Latte"
            :invalid="submitted && !product.name"
          />
          <small v-if="submitted && !product.name">Product name is required.</small>
        </div>

        <div class="field">
          <label for="sku">SKU</label>
          <InputText
            id="sku"
            v-model="product.sku"
            placeholder="Example: COF-001"
            :invalid="submitted && !product.sku"
          />
          <small v-if="submitted && !product.sku">SKU is required.</small>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <Select
            id="category"
            v-model="product.category"
            :options="categoryOptions"
            placeholder="Select category"
            :invalid="submitted && !product.category"
          />
          <small v-if="submitted && !product.category">Category is required.</small>
        </div>

        <div class="field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="product.status"
            :options="statusOptions"
            placeholder="Select status"
          />
        </div>

        <div class="field">
          <label for="price">Price</label>
          <InputNumber
            id="price"
            v-model="product.price"
            mode="currency"
            currency="PHP"
            locale="en-PH"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field">
          <label for="stock">Stock</label>
          <InputNumber
            id="stock"
            v-model="product.stock"
            class="full-input"
            inputClass="full-input"
            :min="0"
          />
        </div>

        <div class="field form-span">
          <label for="image">Image URL</label>
          <InputText
            id="image"
            v-model="product.image"
            placeholder="Paste product image URL"
          />
        </div>

        <div class="field form-span">
          <label for="description">Description</label>
          <Textarea
            id="description"
            v-model="product.description"
            rows="4"
            autoResize
            placeholder="Short product description..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save Product" icon="pi pi-check" @click="saveProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete Product"
      :style="{ width: '28rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
    >
      <div class="delete-message">
        <i class="pi pi-exclamation-triangle"></i>
        <p>
          Are you sure you want to delete
          <strong>{{ product.name }}</strong>?
        </p>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="deleteDialog = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteProduct" />
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

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-span {
    grid-column: span 1;
  }
}
</style>