import { computed, ref } from 'vue';

interface PullToRefreshOptions {
  onRefresh: () => Promise<unknown>;
  threshold?: number;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 64,
}: PullToRefreshOptions) {
  const startY = ref(0);
  const distance = ref(0);
  const refreshing = ref(false);
  const ready = computed(() => distance.value >= threshold);

  const isAtTop = (event: TouchEvent) => {
    const target = event.currentTarget as HTMLElement | null;
    return (target?.closest('.page-scroll')?.scrollTop ?? window.scrollY) <= 0;
  };

  const onTouchStart = (event: TouchEvent) => {
    if (refreshing.value || !isAtTop(event)) return;
    startY.value = event.touches[0]?.clientY ?? 0;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!startY.value || refreshing.value || !isAtTop(event)) return;
    const currentY = event.touches[0]?.clientY ?? startY.value;
    distance.value = Math.min(
      88,
      Math.max(0, (currentY - startY.value) * 0.45),
    );
  };

  const reset = () => {
    startY.value = 0;
    distance.value = 0;
  };

  const onTouchEnd = async () => {
    if (!startY.value) return;
    if (!ready.value) {
      reset();
      return;
    }
    refreshing.value = true;
    distance.value = threshold;
    try {
      await onRefresh();
    } finally {
      refreshing.value = false;
      reset();
    }
  };

  return { distance, onTouchEnd, onTouchMove, onTouchStart, ready, refreshing };
}
