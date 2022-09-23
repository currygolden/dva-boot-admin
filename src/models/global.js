import $$ from 'cmn-utils';
import modelEnhance from '@/utils/modelEnhance';

export default modelEnhance({
  namespace: 'global',

  state: {
    menu: [],
    flatMenu: [],
  },

  effects: {
    *getMenu({ payload }, { call, put }) {
      console.log('start')
      const { status, data } = yield call(getMenu, payload);
      if (status) {
        // 树形数据拍平
        const loopMenu = (menu, pitem = {}) => {
          menu.forEach(item => {
            if (pitem.path) {
              item.parentPath = pitem.parentPath ? pitem.parentPath.concat(pitem.path) : [pitem.path];
            }
            if (item.children && item.children.length) {
              loopMenu(item.children, item);
            }
          });
        }
        loopMenu(data);
        console.log('data', data)

        yield put({
          type: 'getMenuSuccess',
          payload: data,
        });
      }
    },
  },
  // 纯函数，修改状态
  reducers: {
    getMenuSuccess(state, { payload }) {
      return {
        ...state,
        menu: payload,
        flatMenu: getFlatMenu(payload),
      };
    }
  },
});

export function getFlatMenu(menus) {
  let menu = [];
  menus.forEach(item => {
    if (item.children) {
      menu = menu.concat(getFlatMenu(item.children));
    }
    menu.push(item);
  });
  return menu;
}

export async function getMenu(payload) {
  return $$.post('/user/menu', payload);
}