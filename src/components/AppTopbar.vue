<script setup>
import Avatar from 'primevue/avatar'

import { businessProfile } from '../composables/useBusinessProfile'
defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <button
        v-if="!sidebarOpen"
        class="menu-toggle"
        type="button"
        @click="emit('toggle-sidebar')"
      >
        <i class="pi pi-bars"></i>
      </button>

      <div class="brand">
        <div class="brand-logo">
          <img
            v-if="businessProfile.logo"
            :src="businessProfile.logo"
            alt="Business logo"
          />
          <i v-else class="pi pi-shop"></i>
        </div>

        <div>
          <h2>{{ businessProfile.businessName }}</h2>
          <p>{{ businessProfile.businessType }}, POS & Costing System</p>
        </div>
      </div>
    </div>

    <div class="user">
      <Avatar
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        shape="circle"
      />

      <div>
        <div class="name">John Vincent</div>
        <div class="role">Owner</div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;

  height: 72px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 28px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  width: 42px;
  height: 42px;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  background: #ffffff;
  color: #111827;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: 0.2s ease;
}

.menu-toggle:hover {
  background: #f3f4f6;
}

.menu-toggle i {
  font-size: 17px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;

  display: grid;
  place-items: center;

  border-radius: 14px;
  overflow: hidden;

  background: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-logo i {
  font-size: 17px;
}

.brand h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.03em;
}

.brand p {
  margin: 3px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.role {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

@media (max-width: 640px) {
  .brand p {
    display: none;
  }

  .user .name,
  .user .role {
    display: none;
  }
}
</style>