<template>
  <div ref="container" class="coordinate-system"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from 'vue';
import Two from 'two.js';
import type { Position } from '@/types/Objects';

const props = defineProps<{
  width: number;
  height: number;
  origin: Position;
  labFrameBoxY: number | null;
}>();

const container = ref<HTMLElement | null>(null);
const two = shallowRef<Two | null>(null);
let dottedXAxis: any = null;

function drawDottedXAxis(): void {
  if (!two.value || props.labFrameBoxY === null) return;

  if (dottedXAxis) {
    two.value.remove(dottedXAxis);
  }

  dottedXAxis = two.value.makeLine(0, props.labFrameBoxY, props.width, props.labFrameBoxY);
  dottedXAxis.stroke = '#000000';
  dottedXAxis.dashes = [5, 5];
  dottedXAxis.opacity = 0.5;
  two.value.update();
}

watch(() => props.labFrameBoxY, () => {
  drawDottedXAxis();
});

function drawCoordinateSystem(): void {
  if (!two.value) return;

  const xAxisOrigin = two.value.makeLine(0, props.origin.y, props.width, props.origin.y);
  xAxisOrigin.stroke = '#000000';

  const tickLength = 10;
  const tickSpacing = 80;
  const fontSize = 12;

  // To the left of origin
  for (let x = props.origin.x; x >= 0; x -= tickSpacing) {
    const tick = two.value.makeLine(x, props.origin.y - tickLength/2, x, props.origin.y + tickLength/2);
    tick.stroke = '#000000';

    const distanceFromOrigin = (props.origin.x - x) / tickSpacing;
    if (distanceFromOrigin !== 0) {
      const label = two.value.makeText(`-${distanceFromOrigin}`, x, props.origin.y + 20);
      label.size = fontSize;
      label.alignment = 'center';
    }
  }

  // To the right of origin
  for (let x = props.origin.x + tickSpacing; x <= props.width; x += tickSpacing) {
    const tick = two.value.makeLine(x, props.origin.y - tickLength/2, x, props.origin.y + tickLength/2);
    tick.stroke = '#000000';

    const distanceFromOrigin = (x - props.origin.x) / tickSpacing;
    const label = two.value.makeText(`${distanceFromOrigin}`, x, props.origin.y + 20);
    label.size = fontSize;
    label.alignment = 'center';
  }

  const originLabel = two.value.makeText('0', props.origin.x, props.origin.y + 20);
  originLabel.size = fontSize;
  originLabel.alignment = 'center';
}

onMounted(() => {
  if (!container.value) return;

  two.value = new Two({
    width: props.width,
    height: props.height,
    type: Two.Types.svg
  }).appendTo(container.value);

  const background = two.value.makeRectangle(props.origin.x, props.origin.y, props.width, props.height);
  background.fill = '#f0f0f0';
  background.noStroke();

  drawCoordinateSystem();
  two.value.update();
});
</script>

<style scoped>
.coordinate-system {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
