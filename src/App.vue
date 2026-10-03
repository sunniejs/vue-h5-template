<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useUserStore } from '@/store/modules/user';

const user = useUserStore();
const queryClient = useQueryClient();
const sessionVersion = ref(0);
watch(
  () => user.token,
  () => {
    // Cancel old queries before remounting pages, including KeepAlive and chat scopes.
    queryClient.clear();
    sessionVersion.value += 1;
  },
  { flush: 'sync' },
);
</script>

<template>
  <AppErrorBoundary>
    <RouterView :key="sessionVersion" />
  </AppErrorBoundary>
</template>
