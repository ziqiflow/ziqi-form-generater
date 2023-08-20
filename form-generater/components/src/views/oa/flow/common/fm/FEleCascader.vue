<template>
    <div v-if="!!cascader_set">
<!--        {{dataOptions}}-->
        <el-cascader
                :show-all-levels="options.cascader_set['show-all-levels']"
                :collapse-tags="options.cascader_set['collapse-tags']"
                :separator="options.cascader_set['separator']"
                :filterable="options.cascader_set['filterable']"
                :disabled="disabled"
                :clearable="options.clearable"
                :placeholder="placeholder"
                v-model="nowvalue"
                :options="dataOptions"
                :style="{width: options.width}"
                v-bind="$attrs" v-on="$listeners"
                :props="props2"
                @change="whencascadered"
        ></el-cascader>

        <div  style="display: none" v-if="!disabled">
            <el-cascader ref="temp_el_cascader"
                    show-all-levels
                    :separator="options.cascader_set['separator']"
                    :disabled="disabled"
                    v-model="nowvalue"
                    :options="dataOptions"
                    :style="{width: options.width}"
                    :props="props2"
            ></el-cascader>
        </div>
        <div  style="display: none" class="_hide_show">{{tagTexts.join('  | ')}}</div>
        <!--这个用于显示用。尝试使用正则过滤标签方式显示内容；  -->
    </div>
</template>

<script>
import propsync from 'vue-propsync'
import cmixins from './mixins.js'
    export default {
        name: "CEleCascader",
        mixins: [propsync, cmixins],
        props: {

            value: {
                type: Array,
                default: () => {
                    return []
                    //数据结构： path:[],last:lastpath,pathname:[]
                },
                isSync: true
            },


        },

        watch: {
            nowvalue: function () {
                this.whennowvaluechange()
            },
            sync_value: function () {
                //  console.log('更新', this.sync_value)

                if (!this.changefrominner) {
                    //说明是外部更新过来的。
                    this.init();
                } else {
                    this.$emit('input', this.sync_value);
                }

                this.changefrominner = false;
            },
        },

        data() {
            return {
                // cascader_set: null,
                // props:{},
                changefrominner: false,
                nowvalue:[],
                tagTexts:[],
            }
        },
        // computed: {
        //     cascader_options:function(){
        //
        //         return this.dataOptions
        //
        //     }
        // },
        computed:{
            cascader_set(){
                if (!this.options) return;
                return  this.copyobject(this.options.cascader_set);
            },
            props2(){
                if (!this.options) return;
                let attr_props={};
                if (!!this.$attrs.props)
                {
                    attr_props=this.$attrs.props;
                }
                return {
                    ...attr_props,
                    // ...this.options.props,//此处无需加因为data_option已经量化成value,label,children的结构
                    expandTrigger:this.cascader_set.expandTrigger,
                    multiple:this.cascader_set.multiple,
                    checkStrictly:this.cascader_set.checkStrictly
                    // value
                    // label
                    // children
                }
            }



        },
        methods:{

            whencascadered(){


                setTimeout(()=>{
                    var tagTexts = []; // 创建一个空数组，用于存储提取后的文本

                    //  window.cc=$(this.$refs.temp_el_cascader.$el);
                    if(this.cascader_set.multiple){
                        var tagSpans = $(this.$refs.temp_el_cascader.$el).find('.el-cascader__tags .el-tag span'); // 获取所有的span元素
                        tagSpans.each(function() {
                        tagTexts.push($(this).text().trim());
                    });
                    }else{
                        tagTexts.push($(this.$refs.temp_el_cascader.$el).find('input').val())
                    }

                    // 遍历所有的span元素，将其中的文本进行trim操作，并添加到tagTexts数组中
    
                    this.tagTexts=tagTexts;


                    console.log(tagTexts)

                    this.$emit('change',this.sync_value);
                },200)

            },
            whennowvaluechange(){
                let i=[];

                let nowvalue=null;
                if(this.cascader_set.multiple){
                    nowvalue=this.nowvalue;
                }else{
                    nowvalue=[this.nowvalue]
                }

                nowvalue.forEach(e=>{

                    let findoptions=this.dataOptions;
                    let pathname=[]
                    for (let j = 0; j < e.length; j++) {

                        let index=findoptions.findIndex(v=>{
                           return v.value==e[j]
                        });
                        pathname.push(findoptions[index].label);
                        findoptions=findoptions[index].children;
                        //e[j]
                    }

                    i.push({path:e,last:e[e.length-1],pathname:pathname})

                })
                this.changefrominner = true;
                this.sync_value=i;
                // return i;
            },
            init() {
                let  nowvalue= [];

                if (this.sync_value === null || this.sync_value.constructor != Array) {
                    this.changefrominner = true;
                    this.sync_value = [];
                }

                for (let i = 0; i < this.sync_value.length; i++) {
                    const ele = this.sync_value[i];
                    if(!this.cascader_set.multiple){
                        nowvalue=ele.path;
                    }else{
                        nowvalue.push(
                            ele.path
                        );
                    }
                }
                this.nowvalue = nowvalue;
            },

        },

        mounted() {


            this.init();

            // console.log('options', this.options);
            // if (!this.options) return;
            // this.cascader_set = this.copyobject(this.options.cascader_set);
            // this.props={
            //     ...this.options.props,
            //     expandTrigger:this.cascader_set.expandTrigger,
            //     multiple:this.cascader_set.multiple,
            //     // value
            //     // label
            //     // children
            // }


        }
    }
</script>

<style scoped>

</style>
