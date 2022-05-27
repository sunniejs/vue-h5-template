import { AnyObject } from '#/global';

export function typeCheck(param: any) {
  return Object.prototype.toString.call(param);
}

/**
 * 批量修改stage
 */
export function mutateState(state: AnyObject, payload: AnyObject) {
  if (typeCheck(state) === '[object Object]' && typeCheck(payload) === '[object Object]') {
    for (const key in payload) {
      state[key] = payload[key];
    }
  } else {
    console.error('expected plain Object');
  }
}
