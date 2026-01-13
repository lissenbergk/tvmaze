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
  margin-bottom: $spacing-5;

  @include breakpoint(small) {
    flex-direction: column;
    justify-content: center;
    gap: $spacing-5;
  }
}

h1 {
  color: white;
  font-size: $font-size-4xl;
}

.genre {
  margin-bottom: $spacing-8;

  h2 {
    margin-bottom: $spacing-5;
    font-size: $font-size-3xl;
  }

  .show-grid {
    display: flex;
    gap: $spacing-5;
    margin-top: -$spacing-4;
    padding-top: $spacing-4;
    overflow: auto;

    .load-more-button {
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      background-color: unset;
      padding: $spacing-3;
      width: $size-button-lg;
      height: $size-button-lg;

      .inner-load-more-button {
        flex-shrink: 0;
        align-self: center;
        transition: $transition-base;
        border: $border-md solid var(--vt-c-black);
        border-radius: $radius-full;
        background-color: var(--vt-c-white);
        padding: $spacing-3;
        width: $size-icon-sm;
        height: $size-icon-sm;
        color: var(--vt-c-black);

        &:hover {
          cursor: pointer;
          border-color: var(--vt-c-white);
          background-color: var(--vt-c-black);
          color: var(--vt-c-white);
        }
      }
    }
  }
}
</style>
