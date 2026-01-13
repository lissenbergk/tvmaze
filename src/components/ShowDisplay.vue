<script setup lang="ts">
import type { Show } from '@/types/types'
import type { PropType } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  show: {
    type: Object as PropType<Show>,
    required: true,
  },
})
</script>

<template>
  <div class="show-display">
    <img :src="show?.image?.original" :alt="`Show poster for ${show.name}`" />

    <div class="text">
      <h2>{{ show.name }}</h2>
      <h3>{{ show.status }}</h3>
    </div>

    <div v-if="show.rating" class="rating">
      <font-awesome-icon icon="fa-solid fa-star" />

      <span class="score">{{ show.rating.average }}</span>

      <span>/10</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.show-display {
  display: flex;
  position: relative;
  flex-direction: column;
  transition: $transition-base;
  border-radius: $radius-sm;

  img {
    filter: brightness(90%) saturate(90%);
    transition: $transition-base;
    border-radius: $radius-sm;
    aspect-ratio: $aspect-poster;
    max-width: $image-lg;

    @include breakpoint(medium) {
      max-width: $image-md;
    }

    @include breakpoint(small) {
      max-width: $image-sm;
    }
  }

  .text {
    position: absolute;
    top: $spacing-3;
    right: $spacing-3;
    left: $spacing-3;
    border-radius: $spacing-3;
    background-color: rgb(0 0 0 / 0.75);
    padding: $spacing-3;
    max-width: 55%;

    @include breakpoint(medium) {
      max-width: 100%;
    }

    @include breakpoint(small) {
      h2 {
        font-size: $font-size-base;
      }

      h4 {
        display: none;
      }
    }

    h2,
    h4 {
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
    }

    h2 {
      color: var(--vt-c-white);
    }

    h4 {
      color: var(--vt-c-white-mute);
      font-style: italic;
    }
  }

  .rating {
    display: flex;
    position: absolute;
    top: $spacing-3;
    right: $spacing-3;
    align-content: center;
    border-radius: $radius-sm;
    background-color: rgb(0 0 0 / 0.75);
    padding: $spacing-3;

    @include breakpoint(medium) {
      top: unset;
      right: unset;
      bottom: $spacing-3;
      left: $spacing-3;
    }

    @include breakpoint(small) {
      font-size: $font-size-sm;
    }

    svg,
    .score {
      height: $size-icon-md;
    }

    svg {
      color: var(--color-gold);
    }

    .score {
      color: var(--vt-c-white);
    }
  }

  &:hover {
    transform: translateY(-3%);

    img {
      filter: brightness(110%) saturate(110%);
      cursor: pointer;
    }
  }
}
</style>
