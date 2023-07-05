import { useAxios } from '@vueuse/integrations/useAxios';

import 'vant/es/toast/style';

/**
 * reactive useFetchApi
 */

export default function useAxiosApi(url: string, config: any) {
  return useAxios(url, config);
}
