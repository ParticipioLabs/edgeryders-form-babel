<template>
  <div class="titlecontainer">
    <h1 class="title" v-if="title">{{displayTitle}}</h1>
    <h3 class="subtitle" v-html="subtitle" v-if="subtitle">{{subtitle}}</h3>
    <div class="instructions" v-html="instructions" v-if="instructions">{{instructions}}</div>
    <img class="diagram" v-if="diagram.src" :src="diagram.src" :alt="diagram.alt" />
    <button class="navigate primary-background" v-if="dynamic" v-on:click="random">Select another random contribution</button>
    <div class="dynamic" v-html="prompt" v-if="dynamic">{{prompt}}</div>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    title: String,
    subtitle: String,
    instructions: String,
    diagram: Object,
    dynamic: Boolean,
    recordid: {
      type: String,
      default: ''
    },
    airtable: {
      type: Array,
      default: () => [{id: '', fields: {Contribution: ''}}]
    },
    random: Function
  },
  computed: {
    displayTitle() { return this.title.replace(/{{index}}/, this.index) },
    currentRecord () { return this.airtable.find( ({ id }) => id === this.recordid ); },
    prompt () {
      return decodeURI(this.currentRecord.fields.fiction)
        .replace(/(\[quote=").*(\"])/g, "")
        .replace(/(\[\/quote\])/g, "");
    }
  }
}
</script>

<style scoped>

  .titlecontainer {
    max-height: 100vh;
  }

  .title {
    margin-top: 0;
    max-width: 25rem;
  }

  .subtitle {
    margin-top: 0;
    max-width: 25rem;
  }

  .instructions {
    font-size: 1.2rem;
  }

  .dynamic {
    font-size: 1.2rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    max-width: 90%;
    background-color: lightgrey;
    padding: 1rem;
  }

  .diagram {
    padding-top: 2rem;
    max-width: 100%;
    max-height: 75vh;
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
