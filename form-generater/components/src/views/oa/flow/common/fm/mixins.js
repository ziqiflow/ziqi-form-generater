import cloneDeep from 'lodash.clonedeep';

export default {
    name: 'cmixins',
    props: {

      dataOptions:{},

      globalValue: {
        type: Object,
        default: () => {
          return {};
        }
      },

      globalSet: {},
      //是否在设计模式
      in_design: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      status: {
        type: String,
      },

      //这两个是通用的属性。使用自定义组件的时候，直接就可以使用
      //原理详见： <component v-bind:is="item2.editer_component 里面的配置
      // 和 src/components/GenerateFormItem.vue 里面的配置；

      disabled: {
        type: Boolean,
        default: () => {
          return false
        }
      },
      placeholder: {
        type: String,
        default: () => {
          return ''
        }
      },
      options: {}

      // 数据格式是[{'name'=>'xmin','uuid'=>'201020039940','deptid'=>''}]

      // users: {
      //     type: Array,
      //     default: () => {
      //         return []
      //     }
      // }
    },
    data() {
      return {
        status_arr: [],
      }
    },
    mounted() {
      if(!this.status){
        // this.status_arr=[];
        return;
      }
      this.status_arr = this.status.split('.');
    },
    methods: {
      copyobject(obj) {

        return cloneDeep(obj);
      },

      setDataOptions(value){
        console.log(value)
        this.dataOptions=value;
      }
    }

  }
