<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useSettingsStore } from '@/stores/settings.store'
import { useShowsStore } from '@/stores/shows.store'

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
      <input v-model="searchQuery" placeholder="Search for shows" />

      <button>
        <font-awesome-icon icon="fa-solid fa-search" />
      </button>
    </form>

    <button @click="resetType">
      <font-awesome-icon icon="fa-solid fa-rotate-left" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  gap: 10px;

  button {
    height: 100%;
    padding: 5px;
    border-radius: 25px;
    border: 1px solid var(--vt-c-white-mute);
    transition: all 0.25s ease-in-out;

    &:hover {
      border: 1px solid var(--vt-c-white);
      background-color: var(--vt-c-black);
      color: var(--vt-c-white);
      cursor: pointer;
    }
  }

  form {
    border-collapse: collapse;

    input {
      background-color: unset;
      border-radius: 25px 0 0 25px;
      border: 1px solid var(--vt-c-white-mute);
      outline: unset;
      padding: 5px 10px;
      color: var(--vt-c-white);
    }

    button {
      border-radius: 0 25px 25px 0;
    }
  }
}
</style>
