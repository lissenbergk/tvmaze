<script setup lang="ts">
import type { Show } from '@/api/types'
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
    <img :src="show.image.original" />

    <div class="text">
      <h2>{{ show.name }}</h2>
      <h4>{{ show.status }}</h4>
    </div>

    <div class="rating">
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
  border-radius: 10px;

  img {
    border-radius: 10px;
    aspect-ratio: 2 / 3;
    max-width: 300px;
  }

  .text {
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 10px;
    background-color: rgb(0 0 0 / 0.5);
    padding: 10px;
    max-width: 60%;

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

    svg {
      margin-right: 5px;
      color: var(--color-gold);
    }

    .score {
      color: var(--vt-c-white);
    }
  }
}
</style>
