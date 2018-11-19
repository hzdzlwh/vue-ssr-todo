import Vue from 'vue'

const Componet = {
    props: {
        active: Boolean,
        propOne: String
    },
    template:  `
        <div>
            <input type="text" v-model="text">
            <span @click="handleChange">{{propOne}}</span>
            <span v-show="active">see me if active</span>
        </div>
    `,
    data() {
        return {
            text: 0
        }
    },
    methods: {
        handleChange() {
            this.$emit('change')
        }
    }
}

// const CompVue = Vue.extend(Componet)
//
// new CompVue({
//     el: '#root',
//     propsData: {
//         propOne: 'xxx'
//     }
// })

const component2 = {
    extends: Componet,
    data() {
        return {
            text: 1
        }
    }
}

new Vue({
    el: '#root',
    components: {
        Comp: component2
    },
    template: `<comp></comp>`
})
