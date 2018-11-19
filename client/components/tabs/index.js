import Tabs from './tabs.vue'
import Tab from './tab.vue'

export default (Vue) => {
  Vue.component(Tabs.name, Tabs)
  Vue.component(Tab.name, Tab)
}

/*
usage:
<tabs :value="tabValue" @change="tabChange">
    <tab label="tab1" index="1">
        <span>tab content1</span>
    </tab>
    <tab index="2">
        <span slot="label">tab2</span>
        <span>tab content2</span>
    </tab>
</tabs>

*/
