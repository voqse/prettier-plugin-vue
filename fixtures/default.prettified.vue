<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
})
defineEmits(['click', 'submit', 'reset'])
</script>

<template>
  <button :type="type" :class="$style.button" @click="$emit('click', $event)" @submit="$emit('submit', $event)" @reset="$emit('reset', $event)">
    <slot />
  </button>
</template>

<style lang="scss" module>
.button {
  display: block;
  width: 100%;
  text-align: center;
  font-family: "Helvetica Nue", sans-serif;
  user-select: none;
}
</style>
