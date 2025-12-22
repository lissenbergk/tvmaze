<script setup lang="ts">
import ShowDisplay from '@/components/ShowDisplay.vue'
import { computed, onMounted } from 'vue'
import { useShowsStore } from './stores/shows.store'
import OrderSelect from './components/OrderSelect.vue'
import SearchShows from './components/SearchShows.vue'

const shows = useShowsStore()

onMounted(() => {
  if (!shows.shows.length) {
    shows.getShows()
  }
})

const genres = computed(() => Object.keys(shows.genreBasedShows))
</script>

<template>
  <main>
    <div class="configuration">
      <SearchShows></SearchShows>
      <OrderSelect></OrderSelect>
    </div>

    <div class="genre" v-for="genre in genres" :key="genre">
      <h1>{{ genre }}</h1>

      <div class="show-grid">
        <ShowDisplay
          :show="show"
          v-for="show in shows.genreBasedShows[genre]"
          :key="`show-${show.id}`"
        ></ShowDisplay>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.configuration {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.genre {
  margin-bottom: 40px;

  h1 {
    margin-bottom: 20px;
  }

  .show-grid {
    display: flex;
    gap: 20px;
    overflow: auto;
  }
}
</style>
