<template>
  <li :class="klass">
    <textarea
      @keypress="prevalidateTextarea($event)" 
      @paste="onPaste($event)"
      v-if="isTextarea"
      class="textarea"
      :ref="name"
      :placeholder="placeholder"
      v-model="response[name].value"
      v-on:keyup.meta.enter="next"
      v-on:keyup.ctrl.enter="next"
    />
    <label class="label" v-else>
      <input
        @keypress="prevalidateInput($event)"
        @paste="onPaste($event)"
        :ref="name"
        :id="name"
        class="input"
        :placeholder="placeholder"
        :type="type"
        v-model="response[name].value"
        v-on:keyup.enter="next"
      />
      <span v-if="isCheckbox">{{placeholder}}</span>
    </label>
    <Error :error="error" />
  </li>
</template>

<script>
import Error from './Error'

export default {
  props: {
    response: Object,
    type: String,
    name: String,
    placeholder: String,
    half: Boolean,
    settings: Object,
    autofocus: Boolean,
    next: Function
  },
  mounted() { this.handleFocus() },
  updated() { this.handleFocus() },
  computed: {
    error() { return this.response[this.name].error },
    klass() { return `${this.half ? 'half' : 'full'} ${this.type}` },
    isTextarea() { return this.type === 'textarea' },
    isCheckbox() { return this.type === 'checkbox' },
    textarea() { return this.$refs[this.name] },
    isFocused() { return document.activeElement == this.textarea },
    isUsername() { return this.type === 'username'},
    isLimited() { return this.settings.limit || this.response.settings.limit }
  },
  methods: {
    handleFocus() { if (this.autofocus && !this.isFocused) { this.textarea.focus() } },
    prevalidateInput: function(evt) {
      if (this.isLimited) {
        this.$set(this.response[this.name], 'value', this.response[this.name]['value'].slice(0,this.isLimited))
      }
      if (this.isUsername) {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        let char = String.fromCharCode(charCode)
        let pattern = /^[a-zA-Z0-9]+$/;
        if (!pattern.test(char))
          { 
            evt.preventDefault() 
          } 
      }
    },
    onPaste: function(evt) {
      let paste = (evt.clipboardData || window.clipboardData).getData('text');
      let overflow = this.isLimited < (paste.length + this.response[this.name]['value'].length)
      if (this.isLimited && overflow) {
        evt.preventDefault()
      } 
      else { return true }
    },
    prevalidateTextarea: function(evt) {
      this.isLimited
        ? this.isLimited < this.response[this.name]['value'].length
          ? evt.preventDefault()
          : true
        : true
      this.response.settings.limit
        ? this.$set(this.response[this.name], 'value', this.response[this.name]['value'].slice(0,this.isLimited))
        : true
    }
  },
  components: { Error }
}
</script>

<style lang="scss" scoped>
  .half {
    float: left;
    width: 50%;

    &:nth-child(2) .input { border-left: 1px solid; }
  }

  .textarea {
    padding: 0.4rem;
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    border-radius: 2px;
    min-height: 10rem;
  }

  .input {
    width: 100%;
    padding: 1rem 0.5rem;
    border: 0px solid black;
    border-top: 1px solid;
    border-bottom: 1px solid;
    font-size: 14px;
    margin-bottom: -1px;
  }

  .checkbox {
    margin: 2rem 0;
    display: block;

    .label {
      display: flex;
    }

    .input {
      width: auto;
      margin-right: 1rem;
    }
  }
</style>
