<!--
  @name: 合并请求的目录模块
  @description:
  @author: xuyong
  @time: 2021/4/20
-->
<template>
  <el-menu-item
    v-if="message.children === undefined"
    :index="parentPath"
  >
    <span class="text-ellipsis menu-name">
      <svg
        class="icon"
        aria-hidden="true"
      >
        <use :xlink:href="message.icon" />
      </svg>
      {{ message.label }}
    </span>
    <span class="operation">
      <span class="add-number">+ {{ message.addTotal }}</span>
      <span class="delete-number">- {{ message.deleteTotal }}</span>
    </span>
  </el-menu-item>
  <el-submenu
    v-else
    :index="message.label"
  >
    <template slot="title">
      <svg
        class="icon"
        aria-hidden="true"
      >
        <use xlink:href="#icon-wenjianjia1" />
      </svg>
      {{ message.label }}
    </template>
    <diff-menu
      v-for="item of message.children"
      :key="parentPath + item.label"
      :message="item"
      :parent-path="parentPath + '/' + item.label"
    />
  </el-submenu>
</template>

<script>
export default {
  name: 'DiffMenu',
  props: {
    parentPath: {
      type: String,
      default: '',
    },
    message: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang='scss'>
  .diff-menu {
    .el-menu-item{
      display:flex;
      justify-content: space-between;
      align-items: center;
      padding-right:10px;
      .menu-name{
        width:160px;
      }
      .operation{
        /*width:40px;*/
        height: 100%;
        margin:0;
      }
    }
  }
</style>
