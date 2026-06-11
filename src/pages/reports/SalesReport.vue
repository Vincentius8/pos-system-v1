<script setup>
import { computed, ref } from 'vue'

import Button from 'primevue/button'
import Chart from 'primevue/chart'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import ProgressBar from 'primevue/progressbar'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

const selectedRange = ref('This Month')

const rangeOptions = ref([
  'Today',
  'This Week',
  'This Month',
  'This Quarter',
  'This Year'
])

const dailySales = ref([
  { label: 'Jun 1', sales: 18200, orders: 124 },
  { label: 'Jun 2', sales: 20500, orders: 136 },
  { label: 'Jun 3', sales: 17800, orders: 112 },
  { label: 'Jun 4', sales: 23100, orders: 148 },
  { label: 'Jun 5', sales: 26400, orders: 171 },
  { label: 'Jun 6', sales: 31200, orders: 204 },
  { label: 'Jun 7', sales: 28900, orders: 190 }
])

const categorySales = ref([
  { category: 'Coffee', sales: 120000 },
  { category: 'Milk Tea', sales: 92500 },
  { category: 'Frappe', sales: 68400 },
  { category: 'Silogs', sales: 55300 },
  { category: 'Snacks', sales: 36200 },
  { category: 'Add-ons', sales: 14800 }
])

const revenueMix = ref([
  { category: 'Coffee', value: 34 },
  { category: 'Milk Tea', value: 26 },
  { category: 'Frappe', value: 18 },
  { category: 'Silogs', value: 14 },
  { category: 'Snacks', value: 8 }
])

const paymentMethods = ref([
  { method: 'Cash', value: 45 },
  { method: 'GCash', value: 35 },
  { method: 'Maya', value: 12 },
  { method: 'Card', value: 8 }
])

const topProducts = ref([
  { product: 'Spanish Latte', category: 'Coffee', sold: 248, revenue: 35960, profit: 21400, margin: 60 },
  { product: 'Caramel Macchiato', category: 'Coffee', sold: 196, revenue: 30380, profit: 17900, margin: 59 },
  { product: 'Wintermelon Milk Tea', category: 'Milk Tea', sold: 184, revenue: 22080, profit: 13700, margin: 62 },
  { product: 'Java Chip Frappe', category: 'Frappe', sold: 118, revenue: 20060, profit: 10800, margin: 54 },
  { product: 'Tapsilog', category: 'Silogs', sold: 132, revenue: 17820, profit: 6950, margin: 39 }
])

const hourlySales = ref([
  { hour: '8AM', orders: 12 },
  { hour: '9AM', orders: 18 },
  { hour: '10AM', orders: 24 },
  { hour: '11AM', orders: 29 },
  { hour: '12PM', orders: 36 },
  { hour: '1PM', orders: 32 },
  { hour: '2PM', orders: 28 },
  { hour: '3PM', orders: 38 },
  { hour: '4PM', orders: 41 },
  { hour: '5PM', orders: 47 },
  { hour: '6PM', orders: 44 },
  { hour: '7PM', orders: 31 }
])

const dayOfWeekSales = ref([
  { day: 'Monday', sales: 14200 },
  { day: 'Tuesday', sales: 15850 },
  { day: 'Wednesday', sales: 13240 },
  { day: 'Thursday', sales: 17600 },
  { day: 'Friday', sales: 21350 },
  { day: 'Saturday', sales: 28400 },
  { day: 'Sunday', sales: 24600 }
])

const foodCostTrend = ref([
  { month: 'Jan', foodCost: 28, margin: 44 },
  { month: 'Feb', foodCost: 31, margin: 41 },
  { month: 'Mar', foodCost: 29, margin: 43 },
  { month: 'Apr', foodCost: 35, margin: 37 },
  { month: 'May', foodCost: 32, margin: 40 },
  { month: 'Jun', foodCost: 30, margin: 42 }
])

const supplierSpending = ref([
  { supplier: 'Royce Coffee Supply', spending: 82000 },
  { supplier: 'Daily Dairy Supplier', spending: 65000 },
  { supplier: 'Packaging Depot', spending: 40000 },
  { supplier: 'Milk Tea Depot', spending: 36000 },
  { supplier: 'Flavor Hub PH', spending: 28000 }
])

const recentTransactions = ref([
  { receipt: 'OR-000981', customer: 'Walk-in', amount: 385, payment: 'GCash', status: 'Paid' },
  { receipt: 'OR-000982', customer: 'Walk-in', amount: 220, payment: 'Cash', status: 'Paid' },
  { receipt: 'OR-000983', customer: 'Dine-in Table 3', amount: 740, payment: 'Card', status: 'Paid' },
  { receipt: 'OR-000984', customer: 'Takeout', amount: 155, payment: 'Maya', status: 'Paid' },
  { receipt: 'OR-000985', customer: 'Walk-in', amount: 510, payment: 'Cash', status: 'Refunded' }
])

const totalSales = computed(() =>
  dailySales.value.reduce((sum, item) => sum + item.sales, 0)
)

const totalOrders = computed(() =>
  dailySales.value.reduce((sum, item) => sum + item.orders, 0)
)

const averageOrderValue = computed(() => {
  if (!totalOrders.value) return 0
  return totalSales.value / totalOrders.value
})

const grossProfit = computed(() =>
  topProducts.value.reduce((sum, item) => sum + item.profit, 0)
)

const averageMargin = computed(() => {
  if (!topProducts.value.length) return 0
  return Math.round(topProducts.value.reduce((sum, item) => sum + item.margin, 0) / topProducts.value.length)
})

const bestSeller = computed(() => topProducts.value[0]?.product || '-')

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

const salesTrendChartData = computed(() => ({
  labels: dailySales.value.map((item) => item.label),
  datasets: [
    {
      label: 'Sales',
      data: dailySales.value.map((item) => item.sales),
      tension: 0.4,
      fill: true
    },
    {
      label: 'Orders',
      data: dailySales.value.map((item) => item.orders),
      tension: 0.4,
      yAxisID: 'orders'
    }
  ]
}))

const categorySalesChartData = computed(() => ({
  labels: categorySales.value.map((item) => item.category),
  datasets: [
    {
      label: 'Sales',
      data: categorySales.value.map((item) => item.sales),
      borderRadius: 8
    }
  ]
}))

const revenueMixChartData = computed(() => ({
  labels: revenueMix.value.map((item) => item.category),
  datasets: [
    {
      data: revenueMix.value.map((item) => item.value)
    }
  ]
}))

const paymentMethodChartData = computed(() => ({
  labels: paymentMethods.value.map((item) => item.method),
  datasets: [
    {
      data: paymentMethods.value.map((item) => item.value)
    }
  ]
}))

const topProductsChartData = computed(() => ({
  labels: topProducts.value.map((item) => item.product),
  datasets: [
    {
      label: 'Revenue',
      data: topProducts.value.map((item) => item.revenue),
      borderRadius: 8
    }
  ]
}))

const productProfitChartData = computed(() => ({
  labels: topProducts.value.map((item) => item.product),
  datasets: [
    {
      label: 'Profit',
      data: topProducts.value.map((item) => item.profit),
      borderRadius: 8
    }
  ]
}))

const hourlySalesChartData = computed(() => ({
  labels: hourlySales.value.map((item) => item.hour),
  datasets: [
    {
      label: 'Orders',
      data: hourlySales.value.map((item) => item.orders),
      borderRadius: 8
    }
  ]
}))

const dayOfWeekChartData = computed(() => ({
  labels: dayOfWeekSales.value.map((item) => item.day),
  datasets: [
    {
      label: 'Sales',
      data: dayOfWeekSales.value.map((item) => item.sales),
      tension: 0.4,
      fill: true
    }
  ]
}))

const foodCostTrendChartData = computed(() => ({
  labels: foodCostTrend.value.map((item) => item.month),
  datasets: [
    {
      label: 'Food Cost',
      data: foodCostTrend.value.map((item) => item.foodCost),
      tension: 0.4
    },
    {
      label: 'Profit Margin',
      data: foodCostTrend.value.map((item) => item.margin),
      tension: 0.4
    }
  ]
}))

const supplierSpendingChartData = computed(() => ({
  labels: supplierSpending.value.map((item) => item.supplier),
  datasets: [
    {
      label: 'Spending',
      data: supplierSpending.value.map((item) => item.spending),
      borderRadius: 8
    }
  ]
}))

const moneyChartOptions = computed(() => ({
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
        callback: (value) => formatCurrency(value)
      }
    }
  }
}))

const salesTrendChartOptions = computed(() => ({
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

const countChartOptions = computed(() => ({
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
      beginAtZero: true
    }
  }
}))

const percentChartOptions = computed(() => ({
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
        callback: (value) => `${value}%`
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

const horizontalBarOptions = computed(() => ({
  indexAxis: 'y',
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
    x: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatCurrency(value)
      }
    }
  }
}))

const getStatusSeverity = (status) => {
  if (status === 'Paid') return 'success'
  return 'warning'
}

const getProductSeverity = (status) => {
  if (status >= 60) return 'success'
  if (status >= 45) return 'warning'
  return 'danger'
}
</script>

<template>
  <section class="sales-report-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">Business Reports</span>
        <h1 class="page-title">Sales Report</h1>
        <p class="page-subtitle">
          Analyze sales performance, orders, revenue mix, payment methods, peak hours,
          food cost, profit margin, and supplier spending.
        </p>
      </div>

      <div class="hero-actions">
        <Select v-model="selectedRange" :options="rangeOptions" />
        <Button label="Export Report" icon="pi pi-download" severity="secondary" outlined />
      </div>
    </div>

    <div class="stats-grid">
      <div class="surface-card stat-box">
        <div>
          <span>Total Sales</span>
          <strong>{{ formatCurrency(totalSales) }}</strong>
        </div>
        <i class="pi pi-wallet"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Total Orders</span>
          <strong>{{ formatNumber(totalOrders) }}</strong>
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
          <span>Average Margin</span>
          <strong>{{ averageMargin }}</strong>
        </div>
        <i class="pi pi-percentage"></i>
      </div>

      <div class="surface-card stat-box">
        <div>
          <span>Best Seller</span>
          <strong>{{ bestSeller }}</strong>
        </div>
        <i class="pi pi-star"></i>
      </div>
    </div>

    <div class="report-grid">
      <section class="surface-card report-card chart-wide">
        <div class="card-header">
          <div>
            <h3>Sales Trend</h3>
            <p>Line chart is best for showing sales movement over time.</p>
          </div>
          <Tag value="Line Chart" severity="info" />
        </div>

        <div class="chart-box">
          <Chart type="line" :data="salesTrendChartData" :options="salesTrendChartOptions" />
        </div>
      </section>

      <section class="surface-card report-card">
        <div class="card-header">
          <div>
            <h3>Revenue Mix</h3>
            <p>Doughnut chart shows category share of total sales.</p>
          </div>
          <Tag value="Doughnut" severity="secondary" />
        </div>

        <div class="chart-box">
          <Chart type="doughnut" :data="revenueMixChartData" :options="doughnutOptions" />
        </div>
      </section>

      <section class="surface-card report-card">
        <div class="card-header">
          <div>
            <h3>Sales by Category</h3>
            <p>Bar chart makes category comparison clearer.</p>
          </div>
          <Tag value="Bar Chart" severity="info" />
        </div>

        <div class="chart-box">
          <Chart type="bar" :data="categorySalesChartData" :options="moneyChartOptions" />
        </div>
      </section>

      <section class="surface-card report-card">
        <div class="card-header">
          <div>
            <h3>Payment Methods</h3>
            <p>Pie chart is useful for payment share breakdown.</p>
          </div>
          <Tag value="Pie Chart" severity="secondary" />
        </div>

        <div class="chart-box">
          <Chart type="pie" :data="paymentMethodChartData" :options="doughnutOptions" />
        </div>
      </section>

      <section class="surface-card report-card chart-wide">
        <div class="card-header">
          <div>
            <h3>Top Selling Products</h3>
            <p>Horizontal bar chart is easier for long product names.</p>
          </div>
          <Tag value="Horizontal Bar" severity="info" />
        </div>

        <div class="chart-box">
          <Chart type="bar" :data="topProductsChartData" :options="horizontalBarOptions" />
        </div>
      </section>

      <section class="surface-card report-card chart-wide">
        <div class="card-header">
          <div>
            <h3>Product Profitability</h3>
            <p>This compares product profit, not just revenue.</p>
          </div>
          <Tag value="Bar Chart" severity="success" />
        </div>

        <div class="chart-box">
          <Chart type="bar" :data="productProfitChartData" :options="horizontalBarOptions" />
        </div>
      </section>

      <section class="surface-card report-card">
        <div class="card-header">
          <div>
            <h3>Hourly Orders</h3>
            <p>Bar chart highlights peak and dead hours.</p>
          </div>
          <Tag value="Bar Chart" severity="warning" />
        </div>

        <div class="chart-box">
          <Chart type="bar" :data="hourlySalesChartData" :options="countChartOptions" />
        </div>
      </section>

      <section class="surface-card report-card">
        <div class="card-header">
          <div>
            <h3>Sales by Day</h3>
            <p>Line chart shows weekly movement clearly.</p>
          </div>
          <Tag value="Line Chart" severity="info" />
        </div>

        <div class="chart-box">
          <Chart type="line" :data="dayOfWeekChartData" :options="moneyChartOptions" />
        </div>
      </section>

      <section class="surface-card report-card chart-wide">
        <div class="card-header">
          <div>
            <h3>Food Cost vs Profit Margin</h3>
            <p>Line chart compares cost pressure and profitability over time.</p>
          </div>
          <Tag value="Line Chart" severity="warning" />
        </div>

        <div class="chart-box">
          <Chart type="line" :data="foodCostTrendChartData" :options="percentChartOptions" />
        </div>
      </section>

      <section class="surface-card report-card">
        <div class="card-header">
          <div>
            <h3>Supplier Spending</h3>
            <p>Bar chart shows where purchasing money goes.</p>
          </div>
          <Tag value="Bar Chart" severity="info" />
        </div>

        <div class="chart-box">
          <Chart type="bar" :data="supplierSpendingChartData" :options="moneyChartOptions" />
        </div>
      </section>
    </div>

    <div class="content-grid">
      <section class="surface-card table-card">
        <div class="card-header">
          <div>
            <h3>Top Products Table</h3>
            <p>Detailed product sales, revenue, profit, and margin.</p>
          </div>
        </div>

        <DataTable :value="topProducts" responsiveLayout="scroll" tableStyle="min-width: 48rem">
          <Column field="product" header="Product">
            <template #body="slotProps">
              <div class="item-name">
                <strong>{{ slotProps.data.product }}</strong>
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

          <Column field="profit" header="Profit">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.profit) }}
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

          <Column header="Status">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.margin >= 60 ? 'Healthy' : slotProps.data.margin >= 45 ? 'Monitor' : 'Low Margin'"
                :severity="getProductSeverity(slotProps.data.margin)"
              />
            </template>
          </Column>
        </DataTable>
      </section>

      <section class="surface-card table-card">
        <div class="card-header">
          <div>
            <h3>Recent Transactions</h3>
            <p>Latest sales transactions and payment status.</p>
          </div>
        </div>

        <DataTable :value="recentTransactions" responsiveLayout="scroll" tableStyle="min-width: 42rem">
          <Column field="receipt" header="Receipt" />
          <Column field="customer" header="Customer" />
          <Column field="payment" header="Payment" />
          <Column field="amount" header="Amount">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.amount) }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
            </template>
          </Column>
        </DataTable>
      </section>
    </div>
  </section>
</template>

<style scoped>
.sales-report-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-card,
.stat-box,
.report-card,
.table-card {
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
.report-card:hover,
.table-card:hover {
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
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.stat-box i {
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

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.chart-wide {
  grid-column: span 2;
}

.report-card,
.table-card {
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

.item-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name strong {
  color: #0f172a;
  font-weight: 800;
}

.item-name span {
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

@media (max-width: 1200px) {
  .report-grid,
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

  .hero-actions :deep(.p-button),
  .hero-actions :deep(.p-select) {
    flex: 1 1 160px;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-box {
    height: 280px;
  }
}
</style>