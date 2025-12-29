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
    <img :src="show?.image?.original" />

    <div class="text">
      <h2>{{ show.name }}</h2>
      <h4>{{ show.status }}</h4>
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
  transition: transform 0.25s ease-in-out;
  border-radius: 10px;

  img {
    filter: brightness(90%) saturate(90%);
    transition: filter 0.25s ease-in-out;
    border-radius: 10px;
    aspect-ratio: 2 / 3;
    max-width: 300px;

    @include breakpoint(medium) {
      max-width: 200px;
    }

    @include breakpoint(small) {
      max-width: 100px;
    }
  }

  .text {
    position: absolute;
    top: 10px;
    right: 10px;
    left: 10px;
    border-radius: 10px;
    background-color: rgb(0 0 0 / 0.5);
    padding: 10px;
    max-width: 60%;

    @include breakpoint(medium) {
      max-width: 100%;
    }

    @include breakpoint(small) {
      h2 {
        font-size: 14px;
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
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 10px;
    background-color: rgb(0 0 0 / 0.5);
    padding: 10px;

    @include breakpoint(medium) {
      top: unset;
      right: unset;
      bottom: 10px;
      left: 10px;
    }

    @include breakpoint(small) {
      font-size: 12px;
    }

    svg {
      margin-right: 5px;
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
