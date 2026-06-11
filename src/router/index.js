import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../layouts/MainLayout.vue'

import Dashboard from '../pages/Dashboard.vue'

import Ingredients from '../pages/inventory/Ingredients.vue'
import Products from '../pages/inventory/Products.vue'
import StockIn from '../pages/inventory/StockIn.vue'
import StockOut from '../pages/inventory/StockOut.vue'
import Units from '../pages/inventory/Units.vue'
import Categories from '../pages/inventory/Categories.vue'

import Recipes from '../pages/costing/Recipes.vue'
import CostComputation from '../pages/costing/CostComputation.vue'
import PricingCalculator from '../pages/costing/PricingCalculator.vue'

import NewSale from '../pages/pos/NewSale.vue'
import Orders from '../pages/pos/Orders.vue'
import Receipts from '../pages/pos/Receipts.vue'

import Suppliers from '../pages/purchasing/Suppliers.vue'
import PurchaseOrders from '../pages/purchasing/PurchaseOrders.vue'
import ReceivedStocks from '../pages/purchasing/ReceivedStocks.vue'

import SalesReport from '../pages/reports/SalesReport.vue'
import InventoryReport from '../pages/reports/InventoryReport.vue'
import CostingReport from '../pages/reports/CostingReport.vue'
import ProfitReport from '../pages/reports/ProfitReport.vue'

import BusinessProfile from '../pages/settings/BusinessProfile.vue'
import UsersRoles from '../pages/settings/UsersRoles.vue'
import TaxDiscount from '../pages/settings/TaxDiscount.vue'
import PaymentMethods from '../pages/settings/PaymentMethods.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Dashboard },

      { path: 'inventory/ingredients', component: Ingredients },
      { path: 'inventory/products', component: Products },
      { path: 'inventory/stock-in', component: StockIn },
      { path: 'inventory/stock-out', component: StockOut },
      { path: 'inventory/units', component: Units },
      { path: 'inventory/categories', component: Categories },

      { path: 'costing/recipes', component: Recipes },
      { path: 'costing/cost-computation', component: CostComputation },
      { path: 'costing/pricing-calculator', component: PricingCalculator },

      { path: 'pos/new-sale', component: NewSale },
      { path: 'pos/orders', component: Orders },
      { path: 'pos/receipts', component: Receipts },

      { path: 'purchasing/suppliers', component: Suppliers },
      { path: 'purchasing/purchase-orders', component: PurchaseOrders },
      { path: 'purchasing/received-stocks', component: ReceivedStocks },

      { path: 'reports/sales', component: SalesReport },
      { path: 'reports/inventory', component: InventoryReport },
      { path: 'reports/costing', component: CostingReport },
      { path: 'reports/profit', component: ProfitReport },

      { path: 'settings/business-profile', component: BusinessProfile },
      { path: 'settings/users-roles', component: UsersRoles },
      { path: 'settings/tax-discount', component: TaxDiscount },
      { path: 'settings/payment-methods', component: PaymentMethods }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router