<script setup lang="ts">
import { computed } from 'vue'
import { useShowsStore } from '@/stores/shows.store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const showsStore = useShowsStore()

const props = defineProps({
  visible: Boolean,
  showId: Number,
})

const showObject = computed(() => showsStore.getShowById(props.showId))
</script>

<template>
  <div v-show="visible" class="modal">
    <div class="inner-modal">
      <img v-if="showObject?.image" :src="showObject.image.original" />

      <div class="show-details">
        <h1>{{ showObject.name }}</h1>

        <ul class="tags">
          <li class="tag genre-tag" v-for="genre in showObject.genres">{{ genre }}</li>

          <li class="tag runtime-tag">
            <font-awesome-icon icon="fa-solid fa-clock" />

            {{ showObject.runtime }} min
          </li>

          <li class="tag rating-tag">
            <font-awesome-icon icon="fa-solid fa-star" />

            {{ showObject.rating.average }}/10
          </li>
        </ul>

        <p v-html="showObject.summary"></p>
      </div>

      <font-awesome-icon
        class="exit"
        @click="$emit('close-modal')"
        icon="fa-regular fa-circle-xmark"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  margin: unset;
  padding: unset;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 40%,
    rgba(0, 0, 0, 0.7) 60%,
    rgba(0, 0, 0, 0.7) 70%,
    rgba(0, 0, 0, 0.4) 90%,
    rgba(255, 255, 255, 0) 100%
  );
  height: 100vh;
  width: 100vw;
  z-index: +1;
  overflow-y: hidden;

  .inner-modal {
    display: flex;
    margin: 60px auto;
    max-width: 60%;
    padding: 40px;
    background: var(--vt-c-black);
    border-radius: 10px;
    gap: 40px;
    height: fit-content;
    position: relative;
    overflow: visible;

    @include breakpoint(large) {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        display: none;
      }
    }

    img {
      aspect-ratio: 2 / 3;
      width: 300px;
      height: 400px;
      border-radius: 10px;
      padding: 2px;
      border: 1px solid var(--color-text);
    }

    .show-details {
      h1 {
        color: var(--vt-c-white);
        font-weight: 600;

        @include breakpoint(medium) {
          font-size: 24px;
        }
      }

      .tags {
        list-style: none;
        display: flex;
        padding: unset;
        flex-wrap: wrap;
        margin: 10px 0 20px 0;
        gap: 10px;

        @include breakpoint(medium) {
          font-size: 12px;
        }

        .tag {
          padding: 0 10px;
          border-radius: 25px;

          &.genre-tag {
            outline: 1px solid var(--vt-c-white);
            color: white;
          }

          &.rating-tag {
            svg {
              color: var(--color-gold);
            }
          }
        }
      }

      @include breakpoint(medium) {
        p {
          font-size: 12px;
        }
      }
    }

    .exit {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 20px;
      height: 20px;
      color: var(--vt-c-white);
      transition: color 0.25s ease-in-out;

      &:hover {
        color: var(--color-red);
        cursor: pointer;
      }
    }
  }
}
</style>
