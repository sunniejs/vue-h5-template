<script setup>
import AppErrorBoundary from '@/components/common/AppErrorBoundary.vue'
import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useUserStore } from '@/store/accessors'
const user = useUserStore()
const queryClient = useQueryClient()
const sessionVersion = ref(0)
watch(
  () => user.token,
  () => {
    // Cancel old queries before remounting pages, including KeepAlive and chat scopes.
    queryClient.clear()
    sessionVersion.value += 1
  },
  { flush: 'sync' }
)
</script>

<template>
  <AppErrorBoundary>
    <RouterView :key="sessionVersion" />
  </AppErrorBoundary>
</template>
