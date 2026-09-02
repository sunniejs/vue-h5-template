<template>
  <section class="ui-demo">
    <h2>NutUI</h2>
    <p>{{ t('common.ui.current', { framework: 'NutUI' }) }}</p>
    <div class="ui-demo__section">
      <h3>{{ t('common.ui.buttons') }}</h3>
      <div class="ui-demo__actions">
        <NutButton type="primary" size="small">{{
          t('common.ui.primary')
        }}</NutButton>
        <NutButton size="small">{{ t('common.ui.default') }}</NutButton>
        <NutButton type="danger" plain size="small">{{
          t('common.ui.danger')
        }}</NutButton>
      </div>
    </div>
    <div class="ui-demo__section">
      <h3>{{ t('common.ui.settings') }}</h3>
      <NutCellGroup>
        <NutCell
          :title="t('common.ui.notifications')"
          :desc="t('common.ui.notificationsDescription')"
          ><template #link><NutSwitch v-model="notifications" /></template
        ></NutCell>
        <NutCell
          :title="t('common.ui.plan')"
          :desc="t('common.ui.pro')"
          is-link
        />
      </NutCellGroup>
    </div>
    <div class="ui-demo__section">
      <div class="ui-demo__section-title">
        <h3>{{ t('common.ui.progress') }}</h3>
        <NutTag type="success">{{ t('common.ui.tag') }}</NutTag>
      </div>
      <p>{{ t('common.ui.progressDescription') }}</p>
      <NutProgress :percentage="72" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Button as NutButton,
  Cell as NutCell,
  CellGroup as NutCellGroup,
  Progress as NutProgress,
  Switch as NutSwitch,
  Tag as NutTag,
} from '@nutui/nutui';
import '@nutui/nutui/dist/packages/button/style/css';
import '@nutui/nutui/dist/packages/cell/style/css';
import '@nutui/nutui/dist/packages/cellgroup/style/css';
import '@nutui/nutui/dist/packages/progress/style/css';
import '@nutui/nutui/dist/packages/switch/style/css';
import '@nutui/nutui/dist/packages/tag/style/css';
const { t } = useI18n();
const notifications = ref(true);
</script>
