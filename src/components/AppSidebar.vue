<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Drawer from 'primevue/drawer'

import { businessProfile } from '../composables/useBusinessProfile'
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open'])

const route = useRoute()

const visible = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const closeSidebar = () => {
  emit('update:open', false)
}

const isActive = (path) => {
  return route.path === path
}

const menuGroups = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        path: '/'
      }
    ]
  },
  {
    title: 'Inventory',
    items: [
      {
        label: 'Ingredients',
        icon: 'pi pi-list',
        path: '/inventory/ingredients'
      },
      {
        label: 'Products',
        icon: 'pi pi-shopping-bag',
        path: '/inventory/products'
      },
      {
        label: 'Stock In',
        icon: 'pi pi-plus-circle',
        path: '/inventory/stock-in'
      },
      {
        label: 'Stock Out',
        icon: 'pi pi-minus-circle',
        path: '/inventory/stock-out'
      },
      {
        label: 'Units',
        icon: 'pi pi-calculator',
        path: '/inventory/units'
      },
      {
        label: 'Categories',
        icon: 'pi pi-tags',
        path: '/inventory/categories'
      }
    ]
  },
  {
    title: 'Recipe & Costing',
    items: [
      {
        label: 'Recipes',
        icon: 'pi pi-book',
        path: '/costing/recipes'
      },
      {
        label: 'Cost Computation',
        icon: 'pi pi-chart-line',
        path: '/costing/cost-computation'
      },
      {
        label: 'Pricing Calculator',
        icon: 'pi pi-percentage',
        path: '/costing/pricing-calculator'
      }
    ]
  },
  {
    title: 'POS',
    items: [
      {
        label: 'New Sale',
        icon: 'pi pi-cart-plus',
        path: '/pos/new-sale'
      },
      {
        label: 'Orders',
        icon: 'pi pi-list-check',
        path: '/pos/orders'
      },
      {
        label: 'Receipts',
        icon: 'pi pi-receipt',
        path: '/pos/receipts'
      }
    ]
  },
  {
    title: 'Purchasing',
    items: [
      {
        label: 'Suppliers',
        icon: 'pi pi-users',
        path: '/purchasing/suppliers'
      },
      {
        label: 'Purchase Orders',
        icon: 'pi pi-file-edit',
        path: '/purchasing/purchase-orders'
      },
      {
        label: 'Received Stocks',
        icon: 'pi pi-download',
        path: '/purchasing/received-stocks'
      }
    ]
  },
  {
    title: 'Reports',
    items: [
      {
        label: 'Sales Report',
        icon: 'pi pi-money-bill',
        path: '/reports/sales'
      },
      {
        label: 'Inventory Report',
        icon: 'pi pi-box',
        path: '/reports/inventory'
      },
      {
        label: 'Costing Report',
        icon: 'pi pi-calculator',
        path: '/reports/costing'
      },
      {
        label: 'Profit Report',
        icon: 'pi pi-chart-bar',
        path: '/reports/profit'
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        label: 'Business Profile',
        icon: 'pi pi-building',
        path: '/settings/business-profile'
      },
      {
        label: 'Users / Roles',
        icon: 'pi pi-user-edit',
        path: '/settings/users-roles'
      },
      {
        label: 'Tax / Discount',
        icon: 'pi pi-percentage',
        path: '/settings/tax-discount'
      },
      {
        label: 'Payment Methods',
        icon: 'pi pi-credit-card',
        path: '/settings/payment-methods'
      }
    ]
  }
]
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="left"
    class="royce-sidebar"
    :modal="false"
    :dismissable="false"
    :block-scroll="false"
    :showCloseIcon="false"
  >
    <template #header>
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="sidebar-logo">
            <img
              v-if="businessProfile.logo"
              :src="businessProfile.logo"
              alt="Business logo"
            />
            <i v-else class="pi pi-shop"></i>
          </div>

          <div>
            <h2>{{ businessProfile.businessName }}</h2>
            <p>{{ businessProfile.branchName || 'Management System' }}</p>
          </div>
        </div>

        <button
          class="close-btn"
          type="button"
          @click="closeSidebar"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
    </template>

    <nav class="sidebar-menu">
      <div
        v-for="group in menuGroups"
        :key="group.title || 'main'"
        class="menu-group"
      >
        <div
          v-if="group.title"
          class="group-title"
        >
          {{ group.title }}
        </div>

        <RouterLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          class="menu-link"
          :class="{ active: isActive(item.path) }"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </Drawer>
</template>

<style scoped>
.sidebar-header {
  width: 100%;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.sidebar-logo {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;

  display: grid;
  place-items: center;

  border-radius: 15px;
  overflow: hidden;

  background: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.sidebar-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-logo i {
  font-size: 18px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.03em;
}

.sidebar-header p {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.close-btn {
  width: 36px;
  height: 36px;

  border: 1px solid #e5e7eb;
  border-radius: 10px;

  background: #ffffff;
  color: #374151;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.group-title {
  margin: 22px 0 8px;

  font-size: 12px;
  font-weight: 800;
  color: #9ca3af;

  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.menu-link {
  min-height: 44px;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 11px 13px;
  border-radius: 12px;

  color: #374151;
  text-decoration: none;
  font-size: 14px;
  font-weight: 650;

  transition: 0.18s ease;
}

.menu-link i {
  width: 18px;
  font-size: 15px;
  color: #6b7280;
}

.menu-link:hover {
  background: #f3f4f6;
  color: #111827;
}

.menu-link:hover i {
  color: #111827;
}

.menu-link.active {
  background: #111827;
  color: #ffffff;
}

.menu-link.active i {
  color: #ffffff;
}
</style>