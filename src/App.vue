<template>
  <div class="container">
    <vue-headful
        title="Babel Between Us: Application"
        description="Babel Between Us is an exploration of collaborative creativity and digital ethnography, through a large scale online co-created writing process. We are currently looking for eighteen people to join us as writers."
        image="/glyphs.jpeg"
    />
    <Slides :messages="messages" :slides="slides" :go="go" />
  </div>
</template>

<script>
import Slides from './components/Slides.vue'
import vueHeadful from 'vue-headful';

const allLocales = require.context('.', true, /\.\/assets\/data\/.*\.json$/).keys()
  .map(path => path.replace('./assets/data/', '').replace('.json', ''))
  .reduce((result, locale) => (
    { ...result, [locale]: (() => require(`./assets/data/${locale}.json`))() }
  ), {})

export default {
  name: 'edgeryders-form-bbu',
  data: () => ({
    locale: 'en',
    page: 'home',
    airtableData: []
  }),
  methods: {
    go(page) { this.page = page },
    on(page) { return this.page === page },
    setLocale(locale) { this.locale = locale },
  },
  computed: {
    locales() { return Object.keys(allLocales) },
    data() { return allLocales[this.locale] },
    messages() { return this.data.messages },
    brand() { return this.data.brand },
    slides() { return this.data.slides.map(s => Object.assign({}, this.data.slideDefaults, s)) },
    initialSlide() { return this.slides[0] }
  },
  components: { Slides, vueHeadful }
}
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    display: flex;
  }
</style>
