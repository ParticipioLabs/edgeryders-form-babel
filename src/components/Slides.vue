<template>
  <div :class="{ slides: true, 'primary-background': slide.settings.invert }">
    <div class="content">
      <Title class="even" v-bind="slide" />
      <div class="even">
        <Body v-bind="slide" :response="response" :next="next" />
        <Fields v-bind="slide" :response="response" :next="next" />
        <Error v-for="error in errors" :key="error" :error="error" />
      </div>
    </div>
    <Progress :index="slide.index" :maxIndex="maxIndex" mobile />
    <Navigation
      :back="back"
      :next="next"
      :loading="loading"
      :maxIndex="maxIndex"
      v-bind="slide"
    />
  </div>
</template>

<script>
import Title      from './Title'
import Body       from './Body'
import Fields     from './Fields'
import Error      from './Error'
import Progress   from './Progress'
import Navigation from './Navigation'
import submit     from '../helpers/discourse'
import { submitAirTableResponse, getAirTableResponses } from '../helpers/airtable'
import { generateResponse, generateBabelResponse } from '../helpers/discourse'

export default {
  props: { 
    go: Function, 
    slides: Array, 
    messages: Object
  },
  data() { return { form: {}, currentIndex: 0, airtable: [], airtableRecord: '', errors: [], loading: false } },
  created () {
    this.slides.filter(s => s.index).forEach(({ index, body, settings, fields }) => {
      this.$set(this.form, index, { body, settings })
      fields.forEach(({ name, settings = {} }) => {
        this.$set(this.form[index], name, { settings })

        if (localStorage.getItem('bbuform')) {
          try {
            let localForm = JSON.parse(localStorage.getItem('bbuform'));
            this.$set(this.form[index][name], 'value', localForm[index][name]['value'])
          } catch(e) {
            localStorage.removeItem('  bbuform');
          }
        } else {
          this.$set(this.form[index][name], 'value', '')
        }

        this.$set(this.form[index][name], 'error', '')
      })
    })
  },
  mounted () {
    getAirTableResponses().then(
      response => { 
        this.airtable = response.records
        this.randomRecord()
      }
    )
  },
  computed: {
    currentAirtableRecord() { return this.airtableRecord },
    slide()    { 
      let slide = this.slides[this.currentIndex] 
      slide.airtable = this.airtable
      slide.random = this.randomRecord
      slide.recordid = this.currentAirtableRecord
      return slide
    },
    response() { return this.form[this.slide.index] || {} },
    maxIndex() { return Math.max(...this.slides.map(slide => slide.index || 0)) },
    back()     { return this.currentIndex > 0 ? this.retreat : null },
    next()     { 
      return () => (
      this.slide.submit
        ? this.validate() && this.setLoading(true) && submit(this.form, this.messages)
          .then(response => (submitAirTableResponse(this.form))
            .then(response => (this.proceed() && this.setLoading(false))
            ,this.fail)
          ,this.fail)
        : this.validate() && this.proceed()
    )}
  },
  methods: {
    retreat() { this.currentIndex -= 1 },
    proceed() { 
      this.currentIndex += 1 
      this.storeResponses()
    },
    setLoading(bool) {
      this.loading = bool
      return true
    },
    fail(errors) { 
      this.errors = errors 
      this.setLoading(false)
    },
    validate() {
      this.errors = []
      const { index, fields } = this.slide
      if (!index || !fields) { return true }

      fields.forEach(({ name, required, error }) => (
        this.response[name].error = (required && !this.response[name].value) ? error : null
      ))
      return Object.values(this.response).every(({ error }) => !error)
    },
    randomRecord() {
      let oldRecord = this.airtableRecord
      this.airtableRecord = this.airtable[Math.floor(Math.random() * this.airtable.length)].id
      this.form.prompt = {
        body: "This is the prompt that the applicant responded to:",
        prompt: {
          value: this.airtable.find( ({ id }) => id === this.airtableRecord ).fields.fiction,
          settings: {omit: false}
        },
        settings: {columnName: "prompt", omitBody: false}
      }
      if (oldRecord == this.airtableRecord) { this.randomRecord() }
    },
    storeResponses() {
      const parsed = JSON.stringify(this.form);
      localStorage.setItem('bbuform', parsed);
    }
  },
  components: { Title, Body, Fields, Error, Progress, Navigation }
}
</script>

<style scoped lang="scss">
  .slides {
    padding: 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .content {
    display: flex;
    max-height: 80vh;
  }

  .even {
    flex-basis: 50%;
    margin-right: 2rem;
  }

  @media (max-width: 768px) {
    .slides { padding: 2rem; }

    .content { flex-direction: column; }

    .cancel {
      position: absolute;
      top: 2rem;
      right: 2rem;
    }
  }
</style>
