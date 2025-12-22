<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings.store'

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
    background-color: unset;
    border-radius: 25px;
    padding: 5px;
    color: var(--vt-c-white);
  }
}
</style>
