<template>
<div v-if='!!cascader_set'>
    <!-- {{data}} -->
    <!-- {{sync_value}} -->
    <!-- {{data.options}} -->
    <!-- <br> -->
    <!-- {{cascader_set}} -->
    <el-divider content-position="left">级联设置</el-divider>

    <el-form-item label="是否显示完整的路径">

        <el-switch v-model="cascader_set['show-all-levels']"></el-switch>

        <el-alert :content="关闭则仅显示最后一级"></el-alert>

    </el-form-item>

    <el-form-item label="是否多选">

        <el-switch  v-model="cascader_set.multiple"></el-switch>

    </el-form-item>

    <el-form-item label="多选模式下是否折叠Tag">

    <el-switch v-model="cascader_set['collapse-tags']"></el-switch>

</el-form-item>

    <el-form-item label="父节点选中后不包含子节点">

        <el-switch v-model="cascader_set.checkStrictly"></el-switch>

    </el-form-item>

    <el-form-item label="选项分隔符">

        <el-input v-model="cascader_set.separator"></el-input>

    </el-form-item>

    <el-form-item label="是否可搜索选项">
        <el-switch v-model="cascader_set.filterable"></el-switch>
    </el-form-item>


</div>
</template>

<script>
import propsync from 'vue-propsync'

export default {
    name: 'Ccascader_set',
    props: {
        value: {
            type: Object,
            isSync: true
        },
        data: {

        },
        formdata: {

        }

    },
/*     watch: {
        cascader_set: {
            handler(newValue, oldValue) {
                console.log('input',newValue)
                this.$emit('input', this.sync_value)
            },
            deep: true
        },
    }, */
    mixins: [propsync],
    data() {
        return {
            cascader_set: null,
        }
    },
    mounted() {

        this.cascader_set = this.sync_value.options.cascader_set;
        // JSON.parse(JSON.stringify(this.sync_value.options.cascader_set));

/*         let default_value = {
            height: 200,
            toolbar: 'undo redo | formatselect fontsizeselect bold italic underline | bullist numlist blockquote | fullscreen code',
            menubar: 'edit insert view format table'
        }

        for (let key in default_value) {
            if (!this.cascader_set[key]) {
                this.cascader_set[key] = default_value[key] + '';
            }
        }
        不能赋予参数，因为fm里面的data是多层props传递的
        */

    },
    methods: {
        //此函数此处无应用
        whenMultipleChanged(val){

            if (val){
                this.sync_value.options.defaultValue=[]
            }else{
                this.sync_value.options.defaultValue=null;
            }

        }
    }
}
</script>

<style>
</style>
