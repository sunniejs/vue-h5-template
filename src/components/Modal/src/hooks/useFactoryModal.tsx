/*
 * @Author: Vinton
 * @Date: 2023-05-10 11:46:19
 * @Description: file content
 */

import { i18n } from '@/i18n';
import { Component } from 'vue';
import BaseModal from '../BasicModal.vue';
import { createApp, ref, defineComponent } from 'vue';

export const openFactoryModal = ({ renderComp, size }: { size?: 'normal' | 'large'; renderComp: Function }) => {
  return new Promise<string>((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let u;
    const Wrapper = defineComponent({
      setup() {
        const show = ref(true);
        const onChange = (s) => {
          show.value = s;
          if (!s) {
            // unmount app and remove root dom
            if (u) u();
            reject('user closed modal manually');
          }
        };
        const onConfirm = () => {
          resolve('confirm');
          onChange(false);
        };
        return { show, onChange, onConfirm, size };
      },
      render(proxy) {
        return (
          <BaseModal size={proxy.size} show={proxy.show} {...{ 'onUpdate:show': proxy.onChange }} onConfirm={proxy.onConfirm}>
            {renderComp()}
          </BaseModal>
        );
      },
    });
    const { unmount } = mountPropModal(Wrapper);
    u = unmount;
  });
};

const mountPropModal = (component: Component) => {
  const app = createApp(component);
  app.use(i18n);
  const root = document.createElement('div');

  document.body.appendChild(root);

  const instance = app.mount(root);

  return {
    instance,
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
};
