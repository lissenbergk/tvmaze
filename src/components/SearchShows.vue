<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings.store'
import { useShowsStore } from '@/stores/shows.store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { ref } from 'vue'

const settingsStore = useSettingsStore()
const showsStore = useShowsStore()

const searchQuery = ref('')

const submit = () => {
  showsStore.searchShows(searchQuery.value)
  settingsStore.setSource('search')
}

const resetType = () => {
  settingsStore.setSource('all')
}
</script>

<template>
  <div class="search">
    <form @submit.prevent="submit">
      <input v-model="searchQuery" placeholder="Search for shows" aria-label="Search shows input" />

      <button aria-label="Search">
        <font-awesome-icon icon="fa-solid fa-search" />
      </button>
    </form>

    <button @click="resetType" data-testid="reset-button" aria-label="Reset Shows">
      <font-awesome-icon icon="fa-solid fa-rotate-left" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  flex-wrap: nowrap;
  gap: $spacing-3;

  button {
    flex-shrink: 0;
    transition: $transition-base;
    border: $border-md solid var(--vt-c-white-mute);
    border-radius: $radius-lg;
    padding: $spacing-2;
    height: 100%;

    &:hover {
      cursor: pointer;
      border-color: var(--vt-c-white);
      background-color: var(--vt-c-black);
      color: var(--vt-c-white);
    }
  }

  form {
    display: flex;
    border-collapse: collapse;

    input {
      outline: unset;
      border: $border-md solid var(--vt-c-white-mute);
      border-right: unset;
      border-radius: $radius-lg 0 0 $radius-lg;
      background-color: unset;
      padding: $spacing-2 $spacing-3;
      color: var(--vt-c-white);

      @include breakpoint(small) {
        font-size: $font-size-xs;
      }
    }

    button {
      border-radius: 0 $radius-lg $radius-lg 0;
    }
  }
}
</style>
