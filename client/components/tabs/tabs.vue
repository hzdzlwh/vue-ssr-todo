<script>
import TabContainer from './tab-container.vue'

export default {
  name: 'Tabs',
  provide () {
    const data = {}

    Object.defineProperty(data, 'value', {
      get: () => {
        return this.value
      },
      enumerable: true
    })

    return {
      data: data // data必须作为一个属性返回才能实现reactive
    }
  },
  data () {
    return {
      panes: []
    }
  },
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  render () {
    return (
      <div class="tabs">
        <ul class="tabs-header">
          {this.$slots.default}
        </ul>
        <tab-container panes={this.panes}></tab-container>
      </div>
    )
  },
  methods: {
    onChange (index) {
      this.$emit('change', index)
    }
  },
  components: {
    TabContainer
  }
}
</script>

<style lang="stylus" scoped>
.tabs-header
  display flex
  list-style none
  margin 0
  padding 0
  border-bottom 2px solid #ededed
</style>
