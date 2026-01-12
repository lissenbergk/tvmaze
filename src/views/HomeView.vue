<script setup lang="ts">
import OrderSelect from '@/components/OrderSelect.vue'
import SearchShows from '@/components/SearchShows.vue'
import ShowDisplay from '@/components/ShowDisplay.vue'
import ShowModal from '@/components/ShowModal.vue'
import { useShowsStore } from '@/stores/shows.store'
import { computed, onMounted, ref } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const shows = useShowsStore()

onMounted(() => {
  if (!shows.shows.length) {
    shows.getShows()
  }
})

const genres = computed(() => Object.keys(shows.genreBasedShows))

const showModal = ref<boolean>(false)
const selectedShowId = ref<number | null>(null)

const handleClick = (showId: number): void => {
  selectedShowId.value = showId
  showModal.value = true
}
</script>

<template>
  <ShowModal
    v-if="selectedShowId"
    @close-modal="showModal = false"
    :visible="showModal"
    :show-id="selectedShowId"
  ></ShowModal>

  <header class="configuration">
    <SearchShows></SearchShows>
    <OrderSelect></OrderSelect>
  </header>

  <main>
    <h1>Shows</h1>

    <div class="genre" v-for="genre in genres" :key="genre">
      <h2>{{ genre }}</h2>

      <div class="show-grid">
        <ShowDisplay
          @click="handleClick(show.id)"
          :show="show"
          v-for="show in shows.getVisibleShowsForGenre(genre)"
          :key="`show-${show.id}`"
          role="button"
          tabindex="0"
          @keydown.enter="handleClick(show.id)"
          @keydown.space="handleClick(show.id)"
        ></ShowDisplay>

        <button
          class="load-more-button"
          aria-label="Load more shows"
          @click="shows.getShowsForGenre(genre, 10)"
        >
          <font-awesome-icon class="inner-load-more-button" icon="fa-solid fa-angle-right" />
        </button>
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

  @include breakpoint(small) {
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }
}

h1 {
  color: white;
  font-size: 54px;
}

.genre {
  margin-bottom: 40px;

  h2 {
    margin-bottom: 20px;
    font-size: 32px;
  }

  .show-grid {
    display: flex;
    gap: 20px;
    margin-top: -15px;
    padding-top: 15px;
    overflow: auto;

    .load-more-button {
      background-color: unset;

      .inner-load-more-button {
        flex-shrink: 0;
        align-self: center;
        transition: all 0.25s ease-in-out;
        border: 1px solid var(--vt-c-white-mute);
        border: 1px solid var(--vt-c-black);
        border-radius: 25px;
        background-color: var(--vt-c-white);

        padding: 10px;
        width: 20px;
        height: 20px;
        color: var(--vt-c-black);

        &:hover {
          cursor: pointer;
          border: 1px solid var(--vt-c-white);
          background-color: var(--vt-c-black);
          color: var(--vt-c-white);
        }
      }
    }
  }
}
</style>
