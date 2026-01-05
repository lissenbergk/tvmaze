<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings.store'
import { computed } from 'vue'

const store = useSettingsStore()

const order = computed({
  get: () => store.sortingOrder,
  set: (value) => store.setSortingOrder(value),
})
</script>

<template>
  <div class="order">
    <p>Sort (by rating)</p>

    <select v-model="order">
      <option value="desc">Descending</option>
      <option value="asc">Ascending</option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
.order {
  display: flex;
  align-items: center;
  gap: 20px;

  select {
    border-radius: 25px;
    background-color: unset;
    padding: 5px;
    color: var(--vt-c-white);
  }
}
</style>
