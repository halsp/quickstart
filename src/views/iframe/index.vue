<template>
  <div ref="containerRef">
    <PluginSelecter />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import PluginSelecter from '/@/components/PluginSelecter.vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const containerRef = ref<HTMLDivElement>();

  function noticeChange() {
    if (!containerRef.value) return;

    const parent = window.parent;
    parent.postMessage(
      {
        width: containerRef.value!.scrollWidth,
        height: containerRef.value!.scrollHeight,
      },
      route.query.origin as string,
    );
  }

  onMounted(() => {
    if (self === top) return;

    setInterval(() => {
      noticeChange();
    }, 200);
  });
</script>
