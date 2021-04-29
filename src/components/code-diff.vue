<!--
  @name: 代码对比功能
  @description:
  @author: xuyong
  @time: 2021/4/19
-->
<template>
  <div class="code-diff">
    <div
      v-show="showMenu === true && list.length > 0"
      class="diff-menu"
    >
      <el-input
        v-model="searchText"
        placeholder="请输入文件名称"
        prefix-icon="el-icon-search"
        clearable
      />
      <div class="menu-content">
        <el-menu
          :default-active="activeIndex"
          :default-openeds="defaultOpeneds"
          @select="handleSelect"
        >
          <diffMenu
            v-for="item of operateMenu"
            :key="item.label"
            :message="item"
            :parent-path="item.label"
          />
        </el-menu>
      </div>
    </div>
    <div class="diff-list">
      <div class="list-content">
        <verticalDiff
          v-for="(item,index) of verticalList"
          v-show="type === 'vertical'"
          :key="'vertical' + index"
          :message="item"
        />
        <horizontalDiff
          v-for="(item,index) of horizontalList"
          v-show="type === 'horizontal'"
          :key="'horizontal' + index"
          :message="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import set from 'lodash/set';
import verticalDiff from './vertical-diff.vue';
import horizontalDiff from './horizontal-diff.vue';
import diffMenu from './diff-menu.vue';

const path = require('path');
// 根据文件的后缀展示不同的图标
const iconJSON = {
  '.vue': '#icon-vue',
  '.js': '#icon-js',
  '.html': '#icon-html',
  '.css': '#icon-css',
  '.less': '#icon-css',
  '.scss': '#icon-css',
  '.sass': '#icon-css',
  '.svg': '#icon-svg',
  '.md': '#icon-md',
  other: '#icon-file',
};
export default {
  name: 'CodeDiff',
  components: {
    verticalDiff,
    horizontalDiff,
    diffMenu,
  },
  props: {
    // change列表
    list: {
      type: Array,
      default: () => [],
    },
    // 是否展示目录
    showMenu: {
      type: Boolean,
      default: false,
    },
    /*
    * 展示的代码对比是水平的还是垂直的
    * vertical 垂直的
    * horizontal 水平的
    * */
    type: {
      type: String,
      validator(value) {
        return ['vertical', 'horizontal'].indexOf(value) !== -1;
      },
      default: 'vertical',
    },
  },
  data() {
    return {
      // 当前被激活的目录项
      activeIndex: '',
      // 默认打开的目录
      defaultOpeneds: [],
      // 筛选的内容
      searchText: '',
    };
  },
  computed: {
    // 根据传进来的文件列表生成修改文件的目录
    operateMenu() {
      const menu = {};
      const filterList = this.verticalList.filter(({ newPath }) => newPath.includes(this.searchText));
      filterList.forEach((item) => {
        const pathArray = item.newPath.split('/');
        const fileName = pathArray.pop();
        if (pathArray.length === 0) {
          menu[fileName] = item;
        } else {
          set(menu, pathArray.join('.'), { [fileName]: item });
        }
      });
      console.log('---------------');
      console.log('menu', menu, filterList);
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.defaultOpeneds = [];
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.activeIndex = filterList.length > 0 ? filterList[0].newPath : '';
      const menuArray = this.generateMenu(menu);
      console.log(menuArray);
      return menuArray;
    },
    // 对change列表的数据进行处理，生成水平的代码对比
    horizontalList() {
      return this.verticalList.map((item) => {
        const resultLine = []; // 处理的结果
        let storeLine = []; // 暂时存储的数组
        let storeIndex = 0; // 暂时储存数组的下标
        let moreAdd = false; // 新增的行数比删除的行数多
        item.line.forEach((single) => {
          const {
            text, lineType, preIndex, nowIndex,
          } = single;
          if (lineType === 'normal-line') {
            if (storeLine.length > 0) {
              // 如果暂存的数组中有数据，将暂存数据保存后清空
              console.log(storeLine);
              resultLine.push(...storeLine);
              storeLine = [];
              storeIndex = 0;
              moreAdd = false;
            }
            resultLine.push({
              preText: text, nowText: text, preLineType: lineType, nowLineType: lineType, preIndex, nowIndex,
            });
          } else if (lineType === 'delete-line') {
            storeLine.push({
              preText: text, nowText: '', preLineType: lineType, nowLineType: 'normal-line', preIndex, nowIndex,
            });
            // ===以下的为类型为add时
          } else if (moreAdd === false && storeLine[storeIndex] !== undefined) {
            // 暂时存储中有值
            storeLine[storeIndex].nowText = text;
            storeLine[storeIndex].nowLineType = lineType;
            storeLine[storeIndex].nowIndex = nowIndex;
            storeIndex += 1;
          } else {
            storeLine.push({
              preText: '', nowText: text, preLineType: 'normal-line', nowLineType: lineType, preIndex, nowIndex,
            });
            moreAdd = true;
          }
        });
        resultLine.push(...storeLine);
        return {
          ...item,
          line: resultLine,
        };
      });
    },
    // 对change列表的数据进行处理，生成垂直的代码对比
    verticalList() {
      return this.list.map((item) => {
        const { newPath, diff } = item;
        const extname = path.extname(newPath);
        // 新增的总行数
        let addTotal = 0;
        // 删除的总行数
        let deleteTotal = 0;
        const line = [];
        // 原来的行数
        let preIndex = 0;
        // 现在的行数
        let nowIndex = 0;
        diff.split('\n').forEach((single) => {
          let lineType = 'normal-line';

          if (single.startsWith('@@ ')) {
            console.log(single);
            preIndex = Number(single.match(/-(\d+)/)[1]);
            nowIndex = Number(single.match(/\+(\d+)/)[1]);
            console.log(preIndex, nowIndex);
            return false;
          }
          if (single.startsWith('+')) {
            lineType = 'add-line';
            addTotal += 1;
            nowIndex += 1;
          } else if (single.startsWith('-')) {
            lineType = 'delete-line';
            deleteTotal += 1;
            preIndex += 1;
          } else {
            preIndex += 1;
            nowIndex += 1;
          }
          line.push({
            text: single,
            lineType,
            preIndex: lineType === 'add-line' ? '' : preIndex - 1,
            nowIndex: lineType === 'delete-line' ? '' : nowIndex - 1,
          });
          return undefined;
        });
        return {
          ...item, // 原来的传进来的数据
          icon: iconJSON[extname] || iconJSON.other,
          line,
          addTotal,
          deleteTotal,
        };
      });
    },
  },
  methods: {
    // 将修改的文件拆分成目录结构
    generateMenu(menu) {
      const array = [];
      Object.keys(menu).forEach((key) => {
        const json = menu[key];
        if (json.diff !== undefined) {
          // 表示是叶子结点
          array.push({
            ...json,
            label: key,
          });
        } else {
          this.defaultOpeneds.push(key);
          array.push({
            label: key,
            children: this.generateMenu(json),
          });
        }
      });
      return array;
    },
    // 更改选中的目录项时触发
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      const anel = document.getElementsByClassName(this.type + key)[0];
      anel.scrollIntoView();
    },
  },
};
</script>

<style lang='scss'>
.code-diff {
  display:flex;
  max-height:600px;
  // 设置全局的样式
  ul{
    margin:0;
    padding: 0;
    li{
      list-style: none;
    }
  }
  .operation{
    flex:1;
    text-align: right;
    margin-right:20px;
    .add-number{
      color: #168f48;
      margin-right: 4px;
    }
    .delete-number{
      color: #db3b21;
    }
  }
  .icon{
    width: 18px;
    height: 18px;
    margin-left:12px;
    margin-right:6px;
    cursor: pointer;
    &:first-of-type{
      margin-right: 0;
    }
  }
  .diff-menu{
    display: flex;
    flex-direction: column;
    width:300px;
    margin-right:20px;
    .menu-content{
      flex:1;
      margin-top:16px;
      border: 1px solid #e6e6e6;
      overflow: auto;
      >.el-menu{
        display: inline-block;
      }
    }
  }
  .diff-list{
    flex:1;
    overflow-y:auto;
    overflow-x: hidden;
    .diff-card{
      margin-bottom:16px;
      border-radius:4px;
      font-size:14px;
      .diff-header{
        position: sticky;
        top:0;
        display:flex;
        height:48px;
        align-items: center;
        border: 1px solid #e5e5e5;
        border-radius:4px 4px 0 0;
        background-color: #fafafa;
        font-weight:bold;
        svg.shrink-icon{
          width: 12px;
          height: 12px;
        }
      }
      ul.diff-content{
        padding:0;
        margin:0;
        border: 1px solid #e5e5e5;
        border-top:none;
        border-radius:0 0 4px 4px;
        li{
          display:flex;
          list-style: none;
          .tag{
            box-sizing: border-box;
            width:50px;
            padding:2px 10px 2px 0;
            border-right: 1px solid #e5e5e5;
            text-align: right;
            color: rgba(0,0,0,0.3);
          }
          .code{
            flex:1;
            padding:0 2px;
            white-space: pre-wrap;
            word-break: break-all;
          }
        }
        .add-line{
          background-color: #ddfbe6;
          .tag{
            border-color: #c7f0d2;
            color: #9bb0a1;
          }
        }
        .delete-line{
          background-color: #f9d7dc;
          .tag{
            border-color: #fac5cd;
          }
        }
        .normal-line .tag{
          background-color: #fafafa;
        }
      }
      .empty-content{
        height:44px;
        line-height: 44px;
        text-align:center;
        .link{
          color: #1b69b6;
          cursor: pointer;
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
