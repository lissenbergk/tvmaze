<script setup lang="ts">
import { useShowsStore } from '@/stores/shows.store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, nextTick, useTemplateRef, watch } from 'vue'

const showsStore = useShowsStore()

const props = defineProps({
  visible: Boolean,
  showId: Number,
})

const showObject = computed(() => (props.showId ? showsStore.getShowById(props.showId) : undefined))
const modal = useTemplateRef('modal')

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      nextTick(() => modal?.value?.focus())
    }
  },
)
</script>

<template>
  <div
    v-if="showObject"
    v-show="visible"
    class="modal"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    ref="modal"
    @keyup.esc="$emit('close-modal')"
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <div class="inner-modal">
      <img
        v-if="showObject?.image"
        :src="showObject.image.original"
        :alt="`Show poster for ${showObject.name}`"
      />

      <div class="show-details">
        <h2 id="modal-title">{{ showObject?.name }}</h2>

        <ul class="tags">
          <li class="tag genre-tag" :key="genre" v-for="genre in showObject?.genres">
            {{ genre }}
          </li>

          <li class="tag runtime-tag">
            <font-awesome-icon icon="fa-solid fa-clock" />

            {{ showObject?.runtime }} min
          </li>

          <li class="tag rating-tag">
            <font-awesome-icon icon="fa-solid fa-star" />

            {{ showObject?.rating?.average }}/10
          </li>
        </ul>

        <p id="modal-description" v-html="showObject?.summary"></p>
      </div>

      <button aria-label="Close dialog">
        <font-awesome-icon
          class="exit"
          @click="$emit('close-modal')"
          icon="fa-regular fa-circle-xmark"
        />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: +1;
  margin: unset;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 40%,
    rgba(0, 0, 0, 0.7) 60%,
    rgba(0, 0, 0, 0.7) 70%,
    rgba(0, 0, 0, 0.4) 90%,
    rgba(255, 255, 255, 0) 100%
  );
  padding: unset;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;

  .inner-modal {
    display: flex;
    position: relative;
    gap: 40px;
    margin: 60px auto;
    border-radius: 10px;
    background: var(--vt-c-black);
    padding: 40px;
    max-width: 60%;
    height: fit-content;
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
      border: 1px solid var(--color-text);
      border-radius: 10px;
      padding: 2px;
      aspect-ratio: 2 / 3;
      width: 300px;
      height: 400px;
    }

    .show-details {
      h2 {
        color: var(--vt-c-white);
        font-weight: 600;
        font-size: 34px;

        @include breakpoint(medium) {
          font-size: 24px;
        }
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 10px 0 20px 0;
        padding: unset;
        list-style: none;

        @include breakpoint(medium) {
          font-size: 12px;
        }

        .tag {
          border-radius: 25px;
          padding: 0 10px;

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
      transition: color 0.25s ease-in-out;
      width: 20px;
      height: 20px;
      color: var(--vt-c-white);

      &:hover {
        cursor: pointer;
        color: var(--color-red);
      }
    }
  }
}
</style>
