<script setup>
defineProps({
  title: String,
  value: String,
  detail: String,
  icon: String
})
</script>

<template>
  <article class="stat-card surface-card">
    <div class="stat-icon">
      <i :class="icon"></i>
    </div>

    <div>
      <p>{{ title }}</p>
      <strong>{{ value }}</strong>
      <span>{{ detail }}</span>
    </div>
  </article>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 16px;
  color: #4f46e5;
  background: #eef2ff;
}

p {
  margin: 0;
  color: #64748b;
  font-size: 0.86rem;
  font-weight: 650;
}

strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 1.6rem;
  line-height: 1;
  letter-spacing: -0.04em;
}

span {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-size: 0.82rem;
}
</style>
