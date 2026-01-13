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
    <label for="order-sort">
      Sort (by rating)

      <select id="order-sort" v-model="order">
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.order {
  display: flex;
  align-items: center;
  gap: $spacing-5;

  select {
    border-radius: $radius-lg;
    background-color: unset;
    padding: $spacing-2;
    color: var(--vt-c-white);
  }
}
</style>
