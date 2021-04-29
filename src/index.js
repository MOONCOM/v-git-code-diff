import {
  Menu, Submenu, MenuItem, Message, Input, Icon,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/menu.css';
import 'element-ui/lib/theme-chalk/submenu.css';
import 'element-ui/lib/theme-chalk/menu-item.css';
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/icon.css';

import codeDiff from './components/code-diff.vue';
import './iconfont/iconfont';
import './iconfont/iconfont.css';

export default function (Vue) {
  // 导入elementUI中的组件
  [Menu, Submenu, MenuItem, Input, Icon].forEach((item) => Vue.use(item));
  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$message = Message;

  // 注册全局的git代码对比组件
  Vue.component('v-git-code-diff', codeDiff);
}
