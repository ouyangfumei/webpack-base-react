const path = require('path');
const ROOT_DIST = path.resolve(__dirname,'./dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { loader } = require('mini-css-extract-plugin');

module.exports = {
    devtool:'source-map',  //生产环境默认是none，无法确认报错的位置，建议生产环境分析问题使用source-map，可以定位具体报错行,但是代码不安全
    mode:'development',
    entry:'./src/index.js',  
    output:{
        path:ROOT_DIST,  //根目录下的dist文件
        filename:'[name].js'  //指定输出文件
    },
    module:{
        rules:[
            {
                test: /\.less$/,
                use:[
                    // 'style-loader', //开发或者测试环境用这个：创建标签，将css放到标签中
                    MiniCssExtractPlugin.loader, //⽣产环境会把css⽂件分离出来（有利于⽤户端缓存、并⾏加载及减⼩js包的⼤⼩）
                    'css-loader', //序列化css
                    'postcss-loader',  //处理css
                    'less-loader'  //通过less输出css
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        outputPath:'assert/', //存放的位置
                        publicPath:'../assert', //获取的相对位置
                        name:'assert/[name].[ext]',   //name为图片名称占位，ext为文件后缀
                        limit:1024 * 3,     //阈值 超过阈值的图片会独立文件，没有超过会处理成base64
                    }
                }
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                  }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html' //自动将./src/index.html文件添加到打包目录中
        }), 
        new MiniCssExtractPlugin({
            filename:'css/[name].css'  //分离的css存放的位置,
        })
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
}