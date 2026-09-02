<template>
  <section class="ui-demo">
    <h2>Vant</h2>
    <p>{{ t('common.ui.current', { framework: 'Vant' }) }}</p>
    <div class="ui-demo__section">
      <h3>{{ t('common.ui.buttons') }}</h3>
      <div class="ui-demo__actions">
        <VanButton type="primary" size="small">{{
          t('common.ui.primary')
        }}</VanButton>
        <VanButton size="small">{{ t('common.ui.default') }}</VanButton>
        <VanButton type="danger" plain size="small">{{
          t('common.ui.danger')
        }}</VanButton>
      </div>
    </div>
    <div class="ui-demo__section">
      <h3>{{ t('common.ui.settings') }}</h3>
      <VanCellGroup inset>
        <VanCell
          :title="t('common.ui.notifications')"
          :label="t('common.ui.notificationsDescription')"
          ><template #right-icon
            ><VanSwitch v-model="notifications" size="20px" /></template
        ></VanCell>
        <VanCell
          :title="t('common.ui.plan')"
          :value="t('common.ui.pro')"
          is-link
        />
      </VanCellGroup>
    </div>
    <div class="ui-demo__section">
      <div class="ui-demo__section-title">
        <h3>{{ t('common.ui.progress') }}</h3>
        <VanTag type="success">{{ t('common.ui.tag') }}</VanTag>
      </div>
      <p>{{ t('common.ui.progressDescription') }}</p>
      <VanProgress :percentage="72" stroke-width="8" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Button as VanButton,
  Cell as VanCell,
  CellGroup as VanCellGroup,
  Progress as VanProgress,
  Switch as VanSwitch,
  Tag as VanTag,
} from 'vant';
import 'vant/es/button/style';
import 'vant/es/cell/style';
import 'vant/es/cell-group/style';
import 'vant/es/progress/style';
import 'vant/es/switch/style';
import 'vant/es/tag/style';
const { t } = useI18n();
const notifications = ref(true);
</script>
