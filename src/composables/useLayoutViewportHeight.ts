import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useLayoutViewportHeight() {
  const height = ref<string>();
  let viewport: VisualViewport | null | undefined;
  const update = () => {
    height.value = `${Math.round(viewport?.height ?? window.innerHeight)}px`;
  };

  onMounted(() => {
    if (globalThis.CSS?.supports?.('height', '1dvh')) return;

    viewport = window.visualViewport;
    update();
    window.addEventListener('resize', update);
    viewport?.addEventListener('resize', update);
  });
  onBeforeUnmount(() => {
    if (height.value === undefined) return;

    window.removeEventListener('resize', update);
    viewport?.removeEventListener('resize', update);
  });

  return height;
}
