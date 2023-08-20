<template>
<div>
<!--    {{dataOptions}}-->
<!--    :trigger-on-focus="false"-->
    <el-autocomplete @change="change" :debounce='1000' :trigger-on-focus="false"                     :disabled="disabled" v-model="sync_value" :fetch-suggestions="querySearchAsync" :placeholder='placeholder' :value-key="keyvalue2" @select="handleSelect">
        <template slot-scope="{ item }">
            {{ item.label }}
        </template>
    </el-autocomplete>
 <div ref="hideshow" class="_hide_show" style="display:none">{{sync_value}}</div>

</div>
</template>

<script>
import propsync from 'vue-propsync'
import cmixins from './mixins.js'

export default {
    name: 'CEleAutoComplete2',

    mixins: [propsync, cmixins],

    // updated() {
    //     this.$forceUpdate();
    // },

    watch: {



            // dataOptions: {
            //     handler(newval,oldval) {
            //         console.log(JSON.stringify(newval),JSON.stringify(oldval))
            //         if (!!this.nowcallback){
            //             this.nowcallback(newval)
            //             this.nowcallback=null;
            //         }
            //     },
            //     deep: true
            // },


        sync_value(){
                console.log('this.sync_value',this.sync_value)
               this.$emit('input', this.sync_value);
        }

    },

    props: {
        keyvalue: {
            type: String,
            default: () => {
                return 'value'
            },
        },
        value: {
            isSync: true
        },
        options: {
            type: Object,
            default: () => {
                return {
                    "placeholder": "",
                    "defaultValue": null,
                    "componentName": "fm-ele-auto-complete-sample",
                    "eleautocompletesampleset": {
                        "remoteUrlAlias": "",
                        "remoteUrl": "",
                        "props": {
                            "value": "value",
                            "label": "label",
                        }
                    },
                    width: '100%',
                    "disabled": false
                }
            }
        }

    },
    data() {
        return {
            keyvalue2: this.keyvalue,
            lastchangevalue:null,

            nowcallback:null,

        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
        setDataOptions(value){
            console.log(value)
            this.dataOptions=value;

            if (!!this.nowcallback){
                            this.nowcallback(value)
                            this.nowcallback=null;
            }


        },
        emitchange(value){
            if(value!=this.lastchangevalue){
                this.lastchangevalue=value;
                this.$emit('change', value);
            }
        },

        change(value){
            // handleSelect 提交了。change就不提交
            this.emitchange(value)

        },

        handleSelect(item) {
            // this.sync_value = item;
            // this.showvalue = this.sync_value.label;
            this.sync_value=item.value;
            // this.$emit('change', item.value);
            this.emitchange(item.value)
        },
        querySearchAsync(string, callback) {

            console.log('string', string)

            var ops=null;

            if (!!this.options.tableset){
                ops=this.options.tableset;
            }else{
                ops=this.options;
            }


            switch (ops.sourceType) {
                case 'json':
                case 'options':
                        callback(this.dataOptions.filter(e => {
                            if (!!e.label){
                               return e.label.indexOf(string)>-1;
                            }
                            if (!!e.value){
                                return e.value.indexOf(string)>-1;
                            }
                        }))
                    break;
                default:
                    let options=this.copyobject(this.options);

                    if(!!options.tableset){
                        //如果是表格情况下

                        let data=options.tableset.datasourceAdvanced.props.data;
                        if(!data){
                            data='{}';
                        }
                        options.tableset.datasourceAdvanced.props.data=
                            JSON.stringify(
                                Object.assign(JSON.parse(data),{
                            'q':string
                        }))
                        console.log('options',options.tableset)
                        this.$emit('initdataoptions', options.tableset);

                    }else{
                        let data=options.props.data;
                        if(!data){
                            data='{}';
                        }
                        options.props.data=JSON.stringify(Object.assign(JSON.parse(data),{
                            'q':string
                        }))
                        console.log('options',options)
                        this.$emit('initdataoptions', options);
                    }



                    this.nowcallback=callback;
                    break;
            }
        }
    }
}
</script>

<style>

</style>
