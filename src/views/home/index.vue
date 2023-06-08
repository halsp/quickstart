<template>
  <div class="w-full h-full flex flex-col">
    <div class="px-10 pt-8 pb-0">
      <PluginSelecter :on-submit="onSubmit" />
    </div>

    <div ref="codeRef" class="flex-1 h-0"></div>
  </div>
</template>

<script setup lang="ts">
  import sdk, { Project } from '@stackblitz/sdk';
  import PluginSelecter from '/@/components/PluginSelecter.vue';
  import { ref } from 'vue';

  const codeRef = ref<HTMLDivElement>();

  async function onSubmit(project: Project) {
    const codeContainer = document.createElement('div');
    codeContainer.className = 'w-full h-full';

    const codeDev = codeRef.value!;
    while (codeDev.hasChildNodes()) {
      codeDev.removeChild(codeDev.firstChild!);
    }
    codeDev.appendChild(codeContainer);

    await sdk.embedProject(codeContainer, project, {
      openFile: 'init.sh',
    });
  }
</script>
