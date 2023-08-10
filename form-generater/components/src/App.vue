<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }

</script>

<style lang="less">
  ._hide_show {
    display: none;
  }

  /* body {
  -webkit-print-color-adjust: exact !important;
} */
  .pd5 {
    padding: 5px
  }

  .pd10 {
    padding: 10px
  }

  .mg10 {
    margin: 10px;
  }

  .mg-t5 {
    margin-top: 5px
  }

  .mg-b5 {
    margin-bottom: 5px
  }

  .mg-r5 {
    margin-right: 5px;
  }

  .mg-l5 {
    margin-left: 5px;
  }

  .pd-l {
    padding-left: 10px;
  }

  .pd-r {
    padding-right: 10px;
  }

  .pd-t {
    padding-top: 10px;
  }

  .pd-b {
    padding-bottom: 10px;
  }

  .width100 {
    width: 100%;
  }

  .fz15 {
    font-size: 15px;
  }

  .fz14 {
    font-size: 14px;
  }

  .fz13 {
    font-size: 13px;
  }

  .fz12 {
    font-size: 12px;
  }

  .pointer {
    cursor: pointer;
  }

  .text-right {
    text-align: right;
  }

  .table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    margin-bottom: 10px;
    font-size: 13px;
  }

  .table>tbody>tr>td,
  .table>tbody>tr>th,
  .table>tfoot>tr>td,
  .table>tfoot>tr>th,
  .table>thead>tr>td,
  .table>thead>tr>th {
    padding: 4px;
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
  }

  .table-bordered>tbody>tr>td,
  .table-bordered>tbody>tr>th,
  .table-bordered>tfoot>tr>td,
  .table-bordered>tfoot>tr>th,
  .table-bordered>thead>tr>td,
  .table-bordered>thead>tr>th {
    border: 1px solid #ddd;
  }

  .table-bordered {
    border: 1px solid #ddd;
  }

  .table-bordered>tbody>tr>td,
  .table-bordered>tbody>tr>th,
  .table-bordered>tfoot>tr>td,
  .table-bordered>tfoot>tr>th,
  .table-bordered>thead>tr>td,
  .table-bordered>thead>tr>th {
    border: 1px solid #ddd;
  }

  hr {
    background-color: #c1c1c1;
    height: 1px !important;
    border: none;
  }

  .pointer {
    cursor: pointer;
  }

  .clear {
    clear: both;
  }

  .el-table .emergency_row,
  .el-table .el-table__row--striped.emergency_row td {
    background: #ffe598 !important;
    color: #5a5a5a;
  }


  // 提示框手机效果
  @media screen and (min-width: 260px) and (max-width: 450px) {
    .el-message-box {
      width: auto;
    }
    /*.el-select-dropdown.el-popper{*/
    /*  left: 30px !important;*/
    /*}*/
  }


  /* 如果小于500的话 */
  @media screen and (max-device-width: 500px) {
    .workbench .el-card__body {
      padding: 20px 0;
    }

    /* 解决message居顶部的问题 */
    // .el-message-box {
    //   width: 90%;
    // }

    // .el-select-dropdown.el-popper {
    //   left: 30px !important;
    // }

    .el-autocomplete-suggestion.el-popper {
      width: auto !important;
    }

    .flowdealer .el-card__body,
    .flowChose .el-card__body {
      padding: 15px 8px;
    }


  }


  .el-card {
    overflow: visible;
  }

  .frommark-ctable {

    .el-input {
      width: 100%;
    }

    .el-select {
      width: 100%;
    }

    .el-autocomplete {
      width: 100%;
    }


  }

</style>

<style lang="less">
  .printDataClassShow {
    position: relative;
  }

  .printDataClassShow .el-radio__inner::after {
    border: #000 4px solid;
    width: 0;
    height: 0
  }

  .top_absbtns {
    // }
    // .printbtn {
    position: absolute;
    right: 0px;
    top: 4px;
    z-index: 3;
  }


  // .printDataClassShow{

  // }

  .printDataClassShow {

    .el-radio__inner::after {
      border: black 4px solid;
      width: 0px;
      height: 0px;
    }

    // .timeline {
    //     margin: 0px 15px;
    // }

    // .timeline-item {
    //     margin: 0px 0 0 15px;
    //     padding-bottom: 0;

    // }

    // .timeline-circle {
    //     left: -20px;
    // }

    .el-table__empty-block {
      height: 100px;
    }

    .el-input.is-disabled .el-input__inner {
      color: #414246;
    }

    .remarkbox img {
      max-width: 100%;
      height: auto;
    }

    .el-radio__input.is-disabled .el-radio__inner,
    .el-radio__input.is-disabled.is-checked .el-radio__inner,
    .el-radio__input .el-radio__inner,
    .el-radio__input.is-checked .el-radio__inner {
      background-color: #ffffff;
      border-color: #080808;
    }

    .el-checkbox__input.is-disabled .el-checkbox__inner,
    .el-checkbox__input .el-checkbox__inner {
      background-color: #ffffff;
      border-color: #080808;
    }

    .el-checkbox__input.is-disabled+span.el-checkbox__label,
    .el-checkbox__input+span.el-checkbox__label {
      color: #656565
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after,
    .el-checkbox__input.is-checked .el-checkbox__inner::after {
      border-color: #000000;
    }

    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner,
    .el-input .el-input__inner,
    .el-textarea .el-textarea__inner {
      background-color: #ffffff;
      color: black;
    }

    .el-radio__input.is-disabled+span.el-radio__label,
    .el-radio__input+span.el-radio__label {
      color: #656565
    }

    .el-radio__input.is-disabled.is-checked .el-radio__inner::after,
    .el-radio__input.is-checked .el-radio__inner::after {
      background-color: black
    }

  }

</style>
