import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useVisualViewport() {
  const height = ref<number>();
  const update = () => {
    height.value = window.visualViewport?.height;
  };
  onMounted(() => {
    update();
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
  });
  onBeforeUnmount(() => {
    window.visualViewport?.removeEventListener('resize', update);
    window.visualViewport?.removeEventListener('scroll', update);
  });
  return { viewportHeight: height };
}
