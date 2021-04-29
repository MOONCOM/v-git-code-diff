<!--
  @name: 演示用例
  @description: 执行该组件展示测试用例
  @author: xuyong
  @time: 2021/4/28
-->
<template>
  <div class="Demo">
    <fieldset>
      <legend>参数配置</legend>
      <ul>
        <li>
          <div class="name">
            list(进行对比的数据)：
          </div>
          <div class="value">
            <a
              :href="downloadDEMO"
              type="text/json"
              download
            >list测试数据下载</a>
          </div>
        </li>
        <li>
          <div class="name">
            showMenu（是否展示目录）：
          </div>
          <div class="value">
            <label>
              <input
                v-model="showMenu"
                type="checkbox"
              >
              展示目录
            </label>
          </div>
        </li>
        <li>
          <div class="name">
            type（水平对比还是垂直对比）：
          </div>
          <div class="value">
            <label>
              <input
                type="radio"
                name="type"
                :checked="type === 'vertical'"
                @click="type = 'vertical'"
              >vertical
            </label>
            <label>
              <input
                type="radio"
                name="type"
                :checked="type === 'horizontal'"
                @click="type = 'horizontal'"
              >
              horizontal
            </label>
          </div>
        </li>
      </ul>
    </fieldset>
    <hr>
    <v-git-code-diff
      :list="demoData"
      :show-menu="showMenu"
      :type="type"
    />
  </div>
</template>

<script>
import demoData from './demoData.json';

export default {
  name: 'Demo',
  data() {
    return {
      demoData,
      showMenu: true,
      type: 'vertical',
    };
  },
  computed: {
    downloadDEMO() {
      return window.URL.createObjectURL(new Blob([JSON.stringify(demoData, undefined, 4)],
        { type: 'text/json' }));
    },
  },
  methods: {
    downloadFile() {
      window.location.href = 'demoData.json';
    },
  },
};
</script>

<style lang='scss'>
.Demo fieldset .value{
  cursor: pointer;
  user-select: none;
  label{
    cursor: pointer;
  }
}
</style>
