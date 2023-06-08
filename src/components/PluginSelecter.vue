<template>
  <a-form :model="formData" :label-col="{ style: { width: '80px' } }">
    <div class="flex space-x-10">
      <a-form-item label="项目名称" value="value" class="flex-1">
        <a-input v-model:value="formData.name" placeholder="halsp-project" />
      </a-form-item>
      <a-form-item label="运行环境" value="env" class="flex-1">
        <a-cascader
          v-model:value="formData.env"
          :options="envOptions"
          expand-trigger="hover"
          placeholder="请选择运行环境"
        />
      </a-form-item>
    </div>
    <a-form-item label="运行环境" value="plugins">
      <a-select
        v-model:value="formData.plugins"
        mode="multiple"
        placeholder="请选择运行环境"
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
          <a-button type="primary" :loading="loading" @click="handleCreate"> 立即创建 </a-button>
          <a-button v-if="fullscreenEnable" type="primary" @click="() => emit('fullscreen')">
            <div class="flex items-center space-x-2">
              <Icon icon="ant-design:fullscreen-outlined" />
              <span>全屏</span>
            </div>
          </a-button>
        </div>
      </a-form-item>
    </div>
  </a-form>
</template>

<script setup lang="ts">
  import { PropType, computed, reactive, ref, watch } from 'vue';
  import type { CascaderProps, SelectProps } from 'ant-design-vue';
  import { Project } from '@stackblitz/sdk';
  import Icon from './Icon';

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
  });

  const formData = reactive({
    name: 'halsp-project',
    env: ['1'],
    plugins: ['inject', 'router', 'pipe', 'swagger'] as string[],
    registry: 'https://registry.npmmirror.com',
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

  const envOptions = computed<CascaderProps['options']>(() => [
    {
      label: '原生 NodeJS',
      value: '1',
      flag: 'native',
    },
    {
      label: '腾讯云函数',
      pickMessage: '选择云函数类型',
      value: '2',
      children: [
        {
          label: '事件函数',
          flag: 'lambda',
          value: '2.1',
        },
        {
          label: 'Web 函数',
          flag: 'sls-http-tcloud',
          value: '2.2',
        },
      ],
    },
    {
      label: 'Azure Function App',
      flag: 'azure',
      value: '3',
    },
    {
      label: 'AWS Lambda',
      flag: 'lambda',
      value: '4',
    },
    {
      label: '阿里云函数计算',
      pickMessage: '选择云函数类型',
      value: '5',
      children: [
        {
          label: '处理事件请求',
          flag: 'lambda',
          value: '5.1',
        },
        {
          label: '处理 HTTP 请求',
          flag: 'alifc',
          value: '5.2',
        },
      ],
    },
    {
      label: '华为云函数工作流',
      pickMessage: '选择云函数类型',
      value: '6',
      children: [
        {
          label: '事件函数',
          flag: 'lambda',
          value: '6.1',
        },
        {
          label: 'Web 函数',
          flag: 'sls-http-huawei',
          value: '6.2',
        },
      ],
    },
    {
      label: '微服务',
      pickMessage: '选择微服务通讯方式',
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
        label: '依赖注入 (@halsp/inject)',
      },
      {
        value: 'router',
        label: '路由 (@halsp/router)',
      },
      {
        value: 'view',
        label: '视图渲染 (@halsp/view)',
      },
      {
        value: 'mva',
        label: 'Mva 框架 (@halsp/mva)',
        when: () => !isMicro.value,
      },
      {
        value: 'pipe',
        label: '管道 (用于参数格式化) (@halsp/pipe)',
      },
      {
        value: 'filter',
        label: '过滤器 (用于拦截请求) (@halsp/filter)',
      },
      {
        value: 'validator',
        label: '请求参数校验 (@halsp/validator)',
      },
      {
        value: 'testing',
        label: '测试工具 (@halsp/testing)',
      },
      {
        value: 'static',
        label: '静态资源 (@halsp/static)',
        when: !isMicro.value,
      },
      {
        value: 'swagger',
        label: 'Swagger 文档 (@halsp/swagger)',
        when: !isMicro.value,
      },
      {
        value: 'jwt',
        label: 'jwt 身份验证中间件 (@halsp/jwt)',
      },
      {
        value: 'env',
        label: '环境配置插件 (@halsp/env)',
      },
      {
        value: 'logger',
        label: '日志插件 (@halsp/logger)',
      },
    ].filter((item) => typeof item.when == 'undefined' || !!item.when),
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
rm -rf yarn.lock
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
      },
    };

    loading.value = true;
    try {
      await props.onSubmit(project);
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
