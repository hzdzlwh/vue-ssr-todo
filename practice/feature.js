import Vue from 'vue'

const ChildComponent = {
    inject: ['yeye'],
    template: '<div>child component</div>',
    mounted() {
        console.log(this.$parent.$options.name)
        console.log(this.yeye)
    }
}

const component = {
    name: 'comp',
    components: {
        ChildComponent
    },
    template: `
        <div :style="style">
            <slot></slot>
            <child-component></child-component>
        </div>
    `,
    data() {
        return {
            style: {
                width: '200px',
                height: "200px",
                border: '1px solid #aaa'
            }
        }
    }
}

new Vue({
    provide() {
        return {
            yeye: this
        }
    },
    components: {
        CompOne: component
    },
    el: "#root",
    data() {
        return {
            value: '123'
        }
    },
    template: `
        <comp-one>
            <span>this is content</span>
        </comp-one>
    `
})
