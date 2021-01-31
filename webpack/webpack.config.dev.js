const webpack = require('webpack');
// webpack config 合成器，常用于不同环境使用不同配置
const { merge } = require('webpack-merge');
const BaseConfig = require('./webpack.config.base');

module.exports = (env,argv) =>{
    return merge(BaseConfig(env,argv),{
        devtool: 'eval-source-map', // 生成的代码对照，定位代码正确位置
        plugins: [
            new webpack.NamedModulesPlugin(), //用于启动HMR时可以显示模块的相对路径
            new webpack.HotModuleReplacementPlugin() //hot module replacement 启动模块热替换的插件
        ],
        devServer: {    
            contentBase: "./dist",    
            open: true,   
            port: 7777,  //服务端口
            proxy: {      //设置服务器代理
                "/api": {       
                     target: "http://localhost:8888"      
                }    
            }
        }
    })
}