<!--
  @name: 代码对比功能
  @description: 垂直的代码对比
  @author: xuyong
  @time: 2021/4/19
-->
<template>
  <div
    class="vertical-diff diff-card"
    :class="'vertical' + message.newPath"
  >
    <div class="diff-header">
      <svg
        class="icon shrink-icon"
        aria-hidden="true"
        @click="shrink = !shrink"
      >
        <use :xlink:href="shrink === true ? '#icon-you' : '#icon-xia'" />
      </svg>
      <svg
        class="icon"
        aria-hidden="true"
      >
        <use :xlink:href="message.icon" />
      </svg>
      <span class="file-name">{{ message.newPath }}</span>
      <svg
        class="icon"
        aria-hidden="true"
        @click="copy(message.newPath)"
      >
        <use
          xlink:href="#icon-wenjian"
          title="复制文件路径"
        />
      </svg>
      <div class="operation">
        <span class="add-number">+ {{ message.addTotal }}</span>
        <span class="delete-number">- {{ message.deleteTotal }}</span>
      </div>
    </div>
    <ul
      v-show="shrink === false"
      class="diff-content"
    >
      <li
        v-for="(item,index) of message.line"
        :key="index"
        :class="item.lineType"
      >
        <span class="tag">{{ item.preIndex }}</span>
        <span class="tag">{{ item.nowIndex }}</span>
        <span class="code">{{ item.text }}</span>
      </li>
    </ul>
    <div
      v-show="shrink === true"
      class="empty-content"
    >
      改动的代码被折叠起来了，<span
        class="link"
        @click="shrink = false"
      >点击进行展开</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalDiff',
  props: {
    message: {
      type: Object,
      value: () => {},
    },
  },
  data() {
    return {
      // 是否收起
      shrink: false,
    };
  },
  methods: {
    // 将指定的文本复制到剪贴板
    copy(text) {
      const aux = document.createElement('input');
      aux.setAttribute('value', text);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand('copy');
      document.body.removeChild(aux);
      if (this.$message) {
        this.$message.success('已复制到粘贴板');
      }
    },
  },
};
</script>

<style lang="scss">
.vertical-diff{

}
</style>
