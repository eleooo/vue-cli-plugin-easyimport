<template>
  <div class="app">
    <div class="components">
      <div>
        <code>ComponentA.vue</code>
        <component-a></component-a>
      </div>
      <div>
        <code>ImgComponent.vue</code>
        <ImgComponent></ImgComponent>
      </div>
      <div>
        <code>ScopedStyles.vue</code>
        <scoped-styles />
      </div>
      <div>
        <code>Nested2Component.vue</code>
        <Nested2Component />
      </div>
    <div>
      <code>DuplicateImport.vue</code>
      <DuplicateImport />
    </div>
    <div>
      <code>ChainedImport.vue</code>
      <ChainedImport />
    </div>
    <div>
      <code>FunctionalComponent.vue</code>
      <FunctionalComponent />
    </div>
    <div>
      <code>JavascriptComponent.vue</code>
      <javascript-component />
    </div>
    <div>
      <code>SplitComponent.vue</code>
      <SplitComponent />
    </div>
    </div>
    <div>
      <a-button>Click Me</a-button>
    </div>
    <div class="icons-list">
      <a-icon type="home" />
      <a-icon type="setting" theme="filled" />
      <a-icon type="smile" theme="outlined" />
      <a-icon type="sync" spin />
      <a-icon type="smile" :rotate="180" />
      <a-icon type="loading" />
    </div>
  </div>
</template>

<script>
import SplitComponent from "@/components/SplitComponent";
export default {
  name: "App",
  components: { SplitComponent },
};
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 24px;
}
.components {
  padding: 10px;
}
.components > div > div {
  display: inline;
}
</style>
