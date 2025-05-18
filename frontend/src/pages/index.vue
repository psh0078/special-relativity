<template>
  <div class="home-page">
    <Canvas />
    <EventList />
  </div>
</template>

<script lang="ts" setup>
import Canvas from '@/components/relativity/Canvas.vue';
import EventList from '@/components/relativity/EventList.vue';
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
}
</style>
