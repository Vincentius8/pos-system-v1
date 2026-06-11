<script setup>
import { computed, ref } from 'vue'

import Button from 'primevue/button'
import Chart from 'primevue/chart'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'

const todaySales = ref(18450)
const todayOrders = ref(126)
const averageOrderValue = ref(146)
const grossProfit = ref(11280)
const lowStockCount = ref(8)
const pendingPurchaseOrders = ref(3)
const pendingReceivings = ref(2)
const foodCostRate = ref(31)

const salesTrend = ref([
  { day: 'Mon', sales: 14200, orders: 98 },
  { day: 'Tue', sales: 15850, orders: 106 },
  { day: 'Wed', sales: 13240, orders: 91 },
  { day: 'Thu', sales: 17600, orders: 118 },
  { day: 'Fri', sales: 21350, orders: 142 },
  { day: 'Sat', sales: 28400, orders: 188 },
  { day: 'Sun', sales: 24600, orders: 165 }
])

const categorySales = ref([
  { category: 'Coffee', sales: 38200 },
  { category: 'Milk Tea', sales: 29400 },
  { category: 'Frappe', sales: 21800 },
  { category: 'Silogs', sales: 18600 },
  { category: 'Snacks', sales: 12400 }
])

const productMix = ref([
  { label: 'Coffee', value: 34 },
  { label: 'Milk Tea', value: 26 },
  { label: 'Frappe', value: 18 },
  { label: 'Silogs', value: 14 },
  { label: 'Snacks', value: 8 }
])

const profitTrend = ref([
  { month: 'Jan', revenue: 420000, profit: 248000 },
  { month: 'Feb', revenue: 455000, profit: 266000 },
  { month: 'Mar', revenue: 472000, profit: 281000 },
  { month: 'Apr', revenue: 498000, profit: 302000 },
  { month: 'May', revenue: 526000, profit: 324000 },
  { month: 'Jun', revenue: 548000, profit: 337000 }
])

const topProducts = ref([
  {
    name: 'Spanish Latte',
    category: 'Coffee',
    sold: 248,
    revenue: 35960,
    margin: 60,
    status: 'Best Seller'
  },
  {
    name: 'Caramel Macchiato',
    category: 'Coffee',
    sold: 196,
    revenue: 30380,
    margin: 59,
    status: 'Fast Moving'
  },
  {
    name: 'Wintermelon Milk Tea',
    category: 'Milk Tea',
    sold: 184,
    revenue: 22080,
    margin: 62,
    status: 'Fast Moving'
  },
  {
    name: 'Tapsilog',
    category: 'Silogs',
    sold: 132,
    revenue: 17820,
    margin: 39,
    status: 'Monitor Cost'
  },
  {
    name: 'Java Chip Frappe',
    category: 'Frappe',
    sold: 118,
    revenue: 20060,
    margin: 54,
    status: 'Stable'
  }
])

const stockAlerts = ref([
  {
    item: 'Fresh Milk',
    category: 'Milk',
    stock: 6,
    reorder: 10,
    unit: 'Liter',
    status: 'Low Stock'
  },
  {
    item: 'Whipped Cream',
    category: 'Toppings',
    stock: 0,
    reorder: 5,
    unit: 'Can',
    status: 'Out of Stock'
  },
  {
    item: 'Tapioca Pearls',
    category: 'Sinkers',
    stock: 6,
    reorder: 8,
    unit: 'Kg',
    status: 'Low Stock'
  },
  {
    item: 'Food Packaging Cup',
    category: 'Packaging',
    stock: 7,
    reorder: 10,
    unit: 'Pack',
    status: 'Low Stock'
  }
])

const recentActivities = ref([
  {
    title: 'New stock received',
    description: 'RS-2026-0002 from Daily Dairy Supplier was partially accepted.',
    icon: 'pi pi-inbox'
  },
  {
    title: 'Purchase order approved',
    description: 'PO-2026-0001 for Royce Coffee Supply is ready for receiving.',
    icon: 'pi pi-check-circle'
  },
  {
    title: 'Low stock detected',
    description: 'Fresh Milk is below reorder level.',
    icon: 'pi pi-exclamation-triangle'
  },
  {
    title: 'Cost review needed',
    description: 'Tapsilog margin is lower than target profit margin.',
    icon: 'pi pi-calculator'
  }
])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(value || 0)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-PH').format(value || 0)
}

const salesChartData = computed(() => ({
  labels: salesTrend.value.map((item) => item.day),
  datasets: [
    {
      label: 'Sales',
      data: salesTrend.value.map((item) => item.sales),
      tension: 0.4,
      fill: true
    },
    {
      label: 'Orders',
      data: salesTrend.value.map((item) => item.orders),
      tension: 0.4,
      yAxisID: 'orders'
    }
  ]
}))

const categoryChartData = computed(() => ({
  labels: categorySales.value.map((item) => item.category),
  datasets: [
    {
      label: 'Sales',
      data: categorySales.value.map((item) => item.sales),
      borderRadius: 8
    }
  ]
}))

const productMixChartData = computed(() => ({
  labels: productMix.value.map((item) => item.label),
  datasets: [
    {
      data: productMix.value.map((item) => item.value)
    }
  ]
}))

const profitChartData = computed(() => ({
  labels: profitTrend.value.map((item) => item.month),
  datasets: [
    {
      label: 'Revenue',
      data: profitTrend.value.map((item) => item.revenue),
      tension: 0.4
    },
    {
      label: 'Gross Profit',
      data: profitTrend.value.map((item) => item.profit),
      tension: 0.4
    }
  ]
}))

const baseChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatNumber(value)
      }
    }
  }
}))

const salesChartOptions = computed(() => ({
  ...baseChartOptions.value,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatCurrency(value)
      }
    },
    orders: {
      beginAtZero: true,
      position: 'right',
      grid: {
        drawOnChartArea: false
      }
    }
  }
}))

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true
      }
    }
  }
}))

const revenueGrowth = computed(() => {
  const first = profitTrend.value[0]?.revenue || 0
  const last = profitTrend.value[profitTrend.value.length - 1]?.revenue || 0

  if (!first) return 0

  return Math.round(((last - first) / first) * 100)
})

const getStockSeverity = (status) => {
  if (status === 'Out of Stock') return 'danger'
  return 'warning'
}

const getProductSeverity = (status) => {
  if (status === 'Best Seller') return 'success'
  if (status === 'Monitor Cost') return 'warning'
  return 'secondary'
}
</script>

<template>
  <section class="dashboard-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Business Overview</span>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">
          Monitor sales, orders, inventory alerts, purchasing activity, food cost,
          product performance, and business health in one place.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Export Report" icon="pi pi-download" severity="secondary" outlined />
        <Button label="New Sale" icon="pi pi-plus" />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Today Sales</span>
          <strong>{{ formatCurrency(todaySales) }}</strong>
        </div>
        <i class="pi pi-wallet"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Today Orders</span>
          <strong>{{ todayOrders }}</strong>
        </div>
        <i class="pi pi-shopping-cart"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Average Order</span>
          <strong>{{ formatCurrency(averageOrderValue) }}</strong>
        </div>
        <i class="pi pi-chart-line"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Gross Profit</span>
          <strong>{{ formatCurrency(grossProfit) }}</strong>
        </div>
        <i class="pi pi-arrow-up-right"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Food Cost Rate</span>
          <strong>{{ foodCostRate }}</strong>
        </div>
        <i class="pi pi-percentage"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Low Stock Items</span>
          <strong>{{ lowStockCount }}</strong>
        </div>
        <i class="pi pi-exclamation-triangle"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Pending POs</span>
          <strong>{{ pendingPurchaseOrders }}</strong>
        </div>
        <i class="pi pi-file"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Pending Receivings</span>
          <strong>{{ pendingReceivings }}</strong>
        </div>
        <i class="pi pi-inbox"></i>
      </div>
    </div>

    <div class="dashboard-grid">
      <section class="surface-card chart-card chart-wide">
        <div class="card-header">
          <div>
            <h3>Weekly Sales Trend</h3>
            <p>Sales and order movement for the current week.</p>
          </div>

          <Tag value="Live" severity="success" />
        </div>

        <div class="chart-box">
          <Chart type="line" :data="salesChartData" :options="salesChartOptions" />
        </div>
      </section>

      <section class="surface-card chart-card">
        <div class="card-header">
          <div>
            <h3>Product Mix</h3>
            <p>Share of sales by menu category.</p>
          </div>
        </div>

        <div class="chart-box">
          <Chart type="doughnut" :data="productMixChartData" :options="doughnutOptions" />
        </div>
      </section>

      <section class="surface-card chart-card">
        <div class="card-header">
          <div>
            <h3>Sales by Category</h3>
            <p>Top-performing category groups.</p>
          </div>
        </div>

        <div class="chart-box">
          <Chart type="bar" :data="categoryChartData" :options="baseChartOptions" />
        </div>
      </section>

      <section class="surface-card chart-card chart-wide">
        <div class="card-header">
          <div>
            <h3>Revenue vs Gross Profit</h3>
            <p>Monthly revenue and gross profit trend.</p>
          </div>

          <Tag :value="`${revenueGrowth}% Growth`" severity="success" />
        </div>

        <div class="chart-box">
          <Chart type="line" :data="profitChartData" :options="baseChartOptions" />
        </div>
      </section>
    </div>

    <div class="content-grid">
      <section class="surface-card table-card">
        <div class="card-header">
          <div>
            <h3>Top Products</h3>
            <p>Best-performing products by sales and margin.</p>
          </div>
        </div>

        <DataTable
          :value="topProducts"
          dataKey="name"
          responsiveLayout="scroll"
          tableStyle="min-width: 46rem"
        >
          <Column field="name" header="Product">
            <template #body="slotProps">
              <div class="category-name">
                <strong>{{ slotProps.data.name }}</strong>
                <span>{{ slotProps.data.category }}</span>
              </div>
            </template>
          </Column>

          <Column field="sold" header="Sold">
            <template #body="slotProps">
              {{ formatNumber(slotProps.data.sold) }}
            </template>
          </Column>

          <Column field="revenue" header="Revenue">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.revenue) }}
            </template>
          </Column>

          <Column field="margin" header="Margin">
            <template #body="slotProps">
              <div class="margin-cell">
                <span>{{ slotProps.data.margin }}</span>
                <ProgressBar :value="slotProps.data.margin" :showValue="false" />
              </div>
            </template>
          </Column>

          <Column field="status" header="Status">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.status"
                :severity="getProductSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
        </DataTable>
      </section>

      <section class="surface-card table-card">
        <div class="card-header">
          <div>
            <h3>Inventory Alerts</h3>
            <p>Ingredients that need immediate attention.</p>
          </div>
        </div>

        <DataTable
          :value="stockAlerts"
          dataKey="item"
          responsiveLayout="scroll"
          tableStyle="min-width: 42rem"
        >
          <Column field="item" header="Item">
            <template #body="slotProps">
              <div class="category-name">
                <strong>{{ slotProps.data.item }}</strong>
                <span>{{ slotProps.data.category }}</span>
              </div>
            </template>
          </Column>

          <Column field="stock" header="Stock">
            <template #body="slotProps">
              {{ slotProps.data.stock }} {{ slotProps.data.unit }}
            </template>
          </Column>

          <Column field="reorder" header="Reorder">
            <template #body="slotProps">
              {{ slotProps.data.reorder }} {{ slotProps.data.unit }}
            </template>
          </Column>

          <Column field="status" header="Status">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.status"
                :severity="getStockSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
        </DataTable>
      </section>

      <section class="surface-card activity-card">
        <div class="card-header">
          <div>
            <h3>Recent Activity</h3>
            <p>Latest system and inventory movements.</p>
          </div>
        </div>

        <div class="activity-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.title"
            class="activity-item"
          >
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>

            <div>
              <strong>{{ activity.title }}</strong>
              <span>{{ activity.description }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="surface-card health-card">
        <div class="card-header">
          <div>
            <h3>Business Health</h3>
            <p>Quick signals for daily decision-making.</p>
          </div>
        </div>

        <div class="health-list">
          <div>
            <span>Sales Target</span>
            <strong>74</strong>
            <ProgressBar :value="74" :showValue="false" />
          </div>

          <div>
            <span>Inventory Readiness</span>
            <strong>82</strong>
            <ProgressBar :value="82" :showValue="false" />
          </div>

          <div>
            <span>Profitability</span>
            <strong>68</strong>
            <ProgressBar :value="68" :showValue="false" />
          </div>

          <div>
            <span>Procurement Status</span>
            <strong>59</strong>
            <ProgressBar :value="59" :showValue="false" />
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-card,
.stat-box,
.chart-card,
.table-card,
.activity-card,
.health-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow:
    0 18px 42px rgba(15, 23, 42, 0.08),
    0 4px 12px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 30px;
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
  gap: 18px;
}

.stat-box {
  min-height: 122px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px;
}

.stat-box:hover,
.chart-card:hover,
.table-card:hover,
.activity-card:hover,
.health-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow:
    0 24px 56px rgba(15, 23, 42, 0.12),
    0 8px 18px rgba(15, 23, 42, 0.06);
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
  font-size: 1.55rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.stat-box i,
.activity-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 17px;
  font-size: 1.25rem;
  box-shadow: inset 0 0 0 1px rgba(79, 70, 229, 0.12);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.chart-wide {
  grid-column: span 2;
}

.chart-card,
.table-card,
.activity-card,
.health-card {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 900;
}

.card-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.chart-box {
  height: 320px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
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

.margin-cell {
  display: grid;
  gap: 8px;
  min-width: 120px;
}

.margin-cell span {
  color: #0f172a;
  font-size: 0.85rem;
  font-weight: 800;
}

.activity-list,
.health-list {
  display: grid;
  gap: 14px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
}

.activity-item strong {
  display: block;
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 800;
}

.activity-item span {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-size: 0.86rem;
  line-height: 1.5;
}

.health-list > div {
  display: grid;
  gap: 8px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.health-list span {
  color: #64748b;
  font-size: 0.86rem;
  font-weight: 700;
}

.health-list strong {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
}

@media (max-width: 1200px) {
  .dashboard-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .chart-wide {
    grid-column: span 1;
  }
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

  .chart-box {
    height: 280px;
  }
}
</style>