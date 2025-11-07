import { useAxios } from '@vueuse/integrations';

import 'vant/es/toast/style';

/**
 * reactive useFetchApi
 */

export default function useAxiosApi(url, config) {
  return useAxios(url, config);
}
