<template>
    <span>


        <div v-if="status=='design.show'">
            公式：{{options.formula}}
        </div>

        <span v-else>
                    {{sync_value}}
        </span>


        <div ref="hideshow" class="_hide_show" style="display:none">{{sync_value}}</div>
    </span>
</template>

<script>
    import propsync from 'vue-propsync'
    import cmixins from './mixins.js'

    export default {
        name: 'FmFrontEndView',

        mixins: [propsync, cmixins],

        watch: {


        },

        props: {
            value: {
                isSync: true
            },
            options: {
                type: Object,
                default: () => {
                    return {
                            "placeholder": "",
                            "defaultValue": null,
                            "componentName": "fm-front-end-view",
                            "formula": ""
                    }
                }
            }

        },
        data() {
            return {

            }
        },
        computed: {

        },
        mounted() {

            console.log('FmFrontEndView -mounted')

        },
        methods: {

        }
    }
</script>

<style>

</style>
