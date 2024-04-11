<template>
  <a-form :model="formData" :label-col="{ style: { width: '100px' } }">
    <div class="flex space-x-10">
      <a-form-item :label="$t('pluginSelecter.projectName')" value="value" class="flex-1">
        <a-input v-model:value="formData.name" placeholder="halsp-project" />
      </a-form-item>
      <a-form-item :label="$t('pluginSelecter.env')" value="env" class="flex-1">
        <a-cascader
          v-model:value="formData.env"
          :options="envOptions"
          expand-trigger="hover"
          :placeholder="$t('pluginSelecter.envPlaceholder')"
        />
      </a-form-item>
    </div>
    <a-form-item :label="$t('pluginSelecter.selectPlugins')" value="plugins">
      <a-select
        v-model:value="formData.plugins"
        mode="multiple"
        placeholder="$t('pluginSelecter.selectPluginsPlaceholder')"
        :options="pluginOptions"
      />
    </a-form-item>
    <div class="flex space-x-10">
      <a-form-item label="Registry" value="registry" class="flex-1">
        <a-select v-model:value="formData.registry">
          <a-select-option value="https://registry.npmjs.org">
            https://registry.npmjs.org
          </a-select-option>
          <a-select-option value="https://registry.npmmirror.com">
            https://registry.npmmirror.com
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="flex-1">
        <div class="space-x-10 flex items-center">
          <a-button type="primary" :loading="loading" @click="handleCreate">
            {{ $t('pluginSelecter.create') }}
          </a-button>
          <a-button v-if="fullscreenEnable" type="primary" @click="() => emit('fullscreen')">
            <div class="flex items-center space-x-2">
              <Icon icon="ant-design:fullscreen-outlined" />
              <span> {{ $t('pluginSelecter.fullscreen') }}</span>
            </div>
          </a-button>
        </div>
      </a-form-item>
    </div>
  </a-form>
</template>

<script setup lang="ts">
  import { PropType, computed, onMounted, reactive, ref, watch } from 'vue';
  import { CascaderProps, SelectProps, notification } from 'ant-design-vue';
  import { Project } from '@stackblitz/sdk';
  import Icon from './Icon';
  import { t, locale } from '/@/lang';

  const emit = defineEmits(['fullscreen']);

  const props = defineProps({
    onSubmit: {
      type: Function as PropType<(project: Project) => void | Promise<void>>,
      required: true,
    },
    fullscreenEnable: {
      type: Boolean,
      default: false,
    },
    init: {
      type: Boolean,
      default: false,
    },
  });

  const formData = reactive({
    name: 'halsp-project',
    env: ['1'],
    plugins: ['inject', 'router', 'pipe', 'swagger'] as string[],
    registry:
      locale.value == 'zh-CN' ? 'https://registry.npmmirror.com' : 'https://registry.npmjs.org',
  });

  const isMicro = ref(false);
  const loading = ref(false);

  watch(
    () => formData.env,
    () => {
      isMicro.value = !!getEnv(envOptions.value)?.startsWith('micro-');
      formData.plugins = formData.plugins.filter(
        (plugin) => pluginOptions.value!.filter((p) => p.value == plugin).length > 0,
      );
    },
  );

  onMounted(() => {
    if (props.init) {
      handleCreate();
    }
  });

  const envOptions = computed<CascaderProps['options']>(() => [
    {
      label: t('envDesc.native'),
      value: '1',
      flag: 'native',
    },
    {
      label: t('envDesc.tencent'),
      pickMessage: t('envDesc.selectFunctionType'),
      value: '2',
      children: [
        {
          label: t('envDesc.tencentEvent'),
          flag: 'lambda',
          value: '2.1',
        },
        {
          label: t('envDesc.tencentWeb'),
          flag: 'sls-http-tcloud',
          value: '2.2',
        },
      ],
    },
    {
      label: t('envDesc.azure'),
      flag: 'azure',
      value: '3',
    },
    {
      label: t('envDesc.aws'),
      flag: 'lambda',
      value: '4',
    },
    {
      label: t('envDesc.aliyun'),
      pickMessage: t('envDesc.selectFunctionType'),
      value: '5',
      children: [
        {
          label: t('envDesc.aliyunEvent'),
          flag: 'lambda',
          value: '5.1',
        },
        {
          label: t('envDesc.aliyunHttp'),
          flag: 'alifc',
          value: '5.2',
        },
      ],
    },
    {
      label: t('envDesc.huawei'),
      pickMessage: t('envDesc.selectFunctionType'),
      value: '6',
      children: [
        {
          label: t('envDesc.huaweiEvent'),
          flag: 'lambda',
          value: '6.1',
        },
        {
          label: t('envDesc.huaweiWeb'),
          flag: 'sls-http-huawei',
          value: '6.2',
        },
      ],
    },
    {
      label: t('envDesc.micro'),
      pickMessage: t('envDesc.selectMicro'),
      value: '7',
      children: [
        {
          label: 'TCP',
          flag: 'micro-tcp',
          value: '7.1',
        },
        {
          label: 'gRPC',
          flag: 'micro-grpc',
          value: '7.2',
        },
        {
          label: 'MQTT',
          flag: 'micro-mqtt',
          value: '7.3',
        },
        {
          label: 'Redis',
          flag: 'micro-redis',
          value: '7.4',
        },
        {
          label: 'NATS',
          flag: 'micro-nats',
          value: '7.5',
        },
      ],
    },
  ]);

  const pluginOptions = computed<SelectProps['options']>(() =>
    [
      {
        value: 'inject',
      },
      {
        value: 'router',
      },
      {
        value: 'view',
      },
      {
        value: 'mva',
        when: () => !isMicro.value,
      },
      {
        value: 'pipe',
      },
      {
        value: 'filter',
      },
      {
        value: 'validator',
      },
      {
        value: 'testing',
      },
      {
        value: 'static',
        when: !isMicro.value,
      },
      {
        value: 'swagger',
        when: !isMicro.value,
      },
      {
        value: 'jwt',
      },
      {
        value: 'env',
      },
      {
        value: 'logger',
      },
    ]
      .filter((item) => typeof item.when == 'undefined' || !!item.when)
      .map((item) => ({
        value: item.value,
        label: t(`pluginDesc.${item.value}`) + ` (@halsp/${item.value})`,
      })),
  );

  async function handleCreate() {
    const mirrorArg = ` --registry=${formData.registry}`;
    const name = formData.name || 'halsp-project';
    const env = getEnv(envOptions.value) || 'native';
    const plugins = formData.plugins.join(',');

    const command = `halsp create ${name} -e ${env} --plugins ${plugins} -pm yarn --skipInstall --skipGit --skipRun${mirrorArg}`;

    const project: Project = {
      title: 'Halsp Project',
      description: `Created by @halsp/cli with command "${command}"`,
      template: 'node',
      files: {
        'init.sh': `
yarn add @halsp/cli${mirrorArg}
mkdir .temp
cd .temp
${command}
cd ..
rm -rf .stackblitzrc
rm -rf yarn.lock
rm -rf node_modules
rm -rf init.sh
cp -r ./.temp/${name}/* ./
cp -r ./.temp/${name}/.stackblitzrc ./
rm -rf ./temp
code ./README.md
yarn install${mirrorArg}
yarn start
`,
        'package.json': `
{
  "name": "${name}",
  "version": "0.0.0"
}`,
        '.stackblitzrc': `
{
  "installDependencies": false,
  "startCommand": "sh ./init.sh"
}`,
        'README.md': `## ${t('pluginSelecter.initTips')}`,
      },
    };

    loading.value = true;
    try {
      await props.onSubmit(project);
    } catch (ex) {
      notification.error({
        message: t('pluginSelecter.createFailed'),
        description: (ex as Error)?.message || ex?.toString(),
      });
    } finally {
      loading.value = false;
    }
  }

  function getEnv(options: CascaderProps['options']): string | undefined {
    if (!formData.env?.length) return undefined;

    for (const opt of options!) {
      if (opt.value == formData.env.at(formData.env.length - 1)) {
        return opt.flag;
      }

      if (opt.children) {
        var val = getEnv(opt.children);
        if (val) return val;
      }
    }
  }
</script>
