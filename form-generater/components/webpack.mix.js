let mix = require('laravel-mix');
const path = require('path');


mix.webpackConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
});



/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.browserSync('http://localhost:8099');
//
// Mix.listen('configReady', (webpackConfig) => {
//     webpackConfig.module.rules.push(
//         {test: /\.vue$/,
//             exclude: /bower_components/,
//             //enforce: 'pre',
//             loader: 'vue-extend-template-loader'});
//
//     // webpackConfig.module.rules.forEach(ele=>{
//     //     console.log(ele);
//     // })
//
//
// });


// mix.webpackConfig({
//         module: {
//             rules: [
//                 {
//                     test: /\.vue$/,
//                     enforce: 'pre',
//                     loader: 'vue-extend-template-loader'
//                 }
//             ]
//         }
// });



mix
    .js('src/views/oa/flow/common/fm/FmChoseChinaArea.js', 'dist/js/')
    .js('src/views/oa/flow/common/fm/FmEleCascader.js','dist/js/')
    .js('src/views/oa/flow/common/fm/FmEleAutoCompleteSample2.js','dist/js/')
    .js('src/views/oa/flow/common/fm/FmFrontEndView.js','dist/js/')


//.extract(['vue'])
    //.sourceMaps();//它会带来一些编译成本，但在使用编译后的资源文件时可以更方便的在浏览器中进行调试
