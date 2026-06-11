<script setup>
import { ref } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div
    class="app-shell"
    :class="{ 'sidebar-open': sidebarOpen }"
  >
    <AppSidebar
      :open="sidebarOpen"
      @update:open="sidebarOpen = $event"
    />

    <section class="main-shell">
      <AppTopbar
        :sidebar-open="sidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="page-content">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f8fafc;
}

.main-shell {
  min-height: 100vh;
  transition: margin-left 0.25s ease;
}

.app-shell.sidebar-open .main-shell {
  margin-left: 320px;
}

.page-content {
  padding: 28px;
}

@media (max-width: 900px) {
  .app-shell.sidebar-open .main-shell {
    margin-left: 0;
  }

  .page-content {
    padding: 20px;
  }
}
</style>