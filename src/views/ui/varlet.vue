<template>
  <section class="ui-demo">
    <h2>Varlet</h2>
    <p>{{ t('common.ui.current', { framework: 'Varlet' }) }}</p>
    <div class="ui-demo__section">
      <h3>{{ t('common.ui.buttons') }}</h3>
      <div class="ui-demo__actions">
        <VarButton type="primary" size="small">{{
          t('common.ui.primary')
        }}</VarButton>
        <VarButton size="small">{{ t('common.ui.default') }}</VarButton>
        <VarButton type="danger" text size="small">{{
          t('common.ui.danger')
        }}</VarButton>
      </div>
    </div>
    <div class="ui-demo__section">
      <h3>{{ t('common.ui.settings') }}</h3>
      <VarCell
        :title="t('common.ui.notifications')"
        :description="t('common.ui.notificationsDescription')"
        ><template #extra><VarSwitch v-model="notifications" /></template
      ></VarCell>
      <VarCell
        :title="t('common.ui.plan')"
        :description="t('common.ui.pro')"
        ripple
      />
    </div>
    <div class="ui-demo__section">
      <div class="ui-demo__section-title">
        <h3>{{ t('common.ui.progress') }}</h3>
        <VarChip type="success" size="small">{{ t('common.ui.tag') }}</VarChip>
      </div>
      <p>{{ t('common.ui.progressDescription') }}</p>
      <VarProgress :value="72" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Button as VarButton,
  Cell as VarCell,
  Chip as VarChip,
  Progress as VarProgress,
  Switch as VarSwitch,
} from '@varlet/ui';
import '@varlet/ui/es/button/style/index.mjs';
import '@varlet/ui/es/cell/style/index.mjs';
import '@varlet/ui/es/chip/style/index.mjs';
import '@varlet/ui/es/progress/style/index.mjs';
import '@varlet/ui/es/switch/style/index.mjs';
const { t } = useI18n();
const notifications = ref(true);
</script>
