<template>
  <div class="navigation flex">
    <div v-if="!allowBack" />
    <button :title="backTitle" class="navigate primary-background" v-if="allowBack" v-on:click="back">{{backText}}</button>
    <Progress :index="index" :maxIndex="maxIndex" />
    <button :title="nextTitle" :class="buttonColor" v-if="allowNext" :disabled='isLoading' v-on:click="next">{{nextText}}</button>
  </div>
</template>

<script>
import Progress from './Progress'

export default {
  props: {
    back: Function,
    backText: String,
    backTitle: String,
    next: Function,
    loading: Boolean,
    nextText: String,
    nextTitle: String,
    nextUrl: String,
    index: Number,
    maxIndex: Number,
  },
  computed: {
    allowBack() { return this.back && this.backText },
    allowNext() { return this.next && this.nextText },
    isLoading() { 
      return this.loading 
    },
    buttonColor() {
      return this.isLoading
        ? "navigate disabled-background"
        : "navigate primary-background"
    }
  },
  components: { Progress }
}
</script>

<style scoped>
  .flex {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .navigate {
    border: solid 2px;
    border-color: white;
    padding: 0.75rem 3rem;
    color: white;
    border-radius: 2rem;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
    font-family: sans-serif;
  }
</style>
