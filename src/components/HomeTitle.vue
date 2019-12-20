<template>
  <div class="homeslide">
    <h1 class="title" v-if="title">{{title}}</h1>
    <h3 class="subtitle" v-html="subtitle" v-if="subtitle">{{subtitle}}</h3>
    <img class="diagram" v-if="diagram.src" :src="diagram.src" :alt="diagram.alt" />
    <div class="instructions" v-html="whatIsThis" v-if="whatIsThis">{{whatIsThis}}</div>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    title: String,
    subtitle: String,
    diagram: Object,
    instructions: String,
    whatIsThis: String,
  },
  computed: {}
}
</script>

<style scoped>
  
  .homeslide {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  .title {
    margin-top: 0;
    max-width: 25rem;
    margin-left: auto;
    margin-right: auto;
  }

  .subtitle {
    margin-top: 0;
    max-width: 25rem;
    margin-left: auto;
    margin-right: auto;
  }

  .instructions {
    max-width: 500px;
    font-size: 1.2rem;
    margin-left: auto;
    margin-right: auto;
  }

  .diagram {
    max-width: 500px;
    max-height: 80%;
    margin: 1rem 0;
    margin-left: auto;
    margin-right: auto;
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
