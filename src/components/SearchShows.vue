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

      <button>
        <font-awesome-icon icon="fa-solid fa-search" />
      </button>
    </form>

    <button @click="resetType" data-testid="reset-button">
      <font-awesome-icon icon="fa-solid fa-rotate-left" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;

  button {
    flex-shrink: 0;
    transition: all 0.25s ease-in-out;
    border: 1px solid var(--vt-c-white-mute);
    border-radius: 25px;
    padding: 5px;
    height: 100%;

    &:hover {
      cursor: pointer;
      border: 1px solid var(--vt-c-white);
      background-color: var(--vt-c-black);
      color: var(--vt-c-white);
    }
  }

  form {
    display: flex;
    border-collapse: collapse;

    input {
      outline: unset;
      border: 1px solid var(--vt-c-white-mute);
      border-radius: 25px 0 0 25px;
      background-color: unset;
      padding: 5px 10px;
      color: var(--vt-c-white);

      @include breakpoint(small) {
        font-size: 10px;
      }
    }

    button {
      border-radius: 0 25px 25px 0;
    }
  }
}
</style>
