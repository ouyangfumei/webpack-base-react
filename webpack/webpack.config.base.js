const webpack = require('webpack');
const path = require('path');
const ROOT_PATH = path.resolve(__dirname,'..');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { loader } = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports =(env,argv) =>{
    // console.log(env);//undefind
    console.log(process.env)
    // console.log(argv,'argv---')
    const devMode = argv.mode !== 'production';
    const isMinimize = !devMode; // 是否压缩代码
    // 利用ProvidePlugin这个webpack内置API将React设置为全局引入，从而无需单个页面import引入
    let webpackProvide = {
        React: 'react',
        ReactDOM: 'react-dom',
        // _: 'lodash'
    };
    const webpackConfig = {
        // devtool:'source-map',  //生产环境默认是none，无法确认报错的位置，建议生产环境分析问题使用source-map，可以定位具体报错行,但是代码不安全
        mode:'development',
        performance: {
            hints: 'warning'  //做优化用的，开发环境warning（警告），生产error（错误）当有超过250kb 的资源
        },
        entry:path.join(ROOT_PATH,'src'),  
        output:{
            path:path.join(ROOT_PATH,'dist'), //根目录下的dist文件
            filename:'js/[name].js',  //指定输出文件
            // http://www.hellojava.com/a/90834.html?
            // todo 生成chunkhash文件，这种格式文件在内容没有改变时候不会更新hash，有利于持久化缓存
            chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
        },
        module:{
            rules:[
                {
                    test: /\.(jsx?|tsx?)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                          presets: ['@babel/preset-env', '@babel/preset-react','@babel/preset-typescript']
                        }
                    }
                },
                {
                    test: /\.less$/,
                    exclude: /(node_modules|bower_components)/,
                    use:[
                        //开发或者测试环境用这个：创建标签，将css放到标签中
                        //⽣产环境会把css⽂件分离出来（有利于⽤户端缓存、并⾏加载及减⼩js包的⼤⼩）
                        devMode?'style-loader':
                        {
                            loader: MiniCssExtractPlugin.loader, 
                        }, 
                        'css-loader', //序列化css
                        { // css预处理器 通过postcss.config写其他插件
                            loader: 'postcss-loader',
                        },
                        'less-loader'  //通过less输出css
                    ]
                },
                // {
                //     test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                //     use:{
                //         // 最后png等存位置eg：dist/assert/test.png
                //         loader:'url-loader',
                //         options:{
                //             outputPath:'assert/imgs', //存放的位置
                //             publicPath:'../assert/imgs', //相对于outputPath的位置
                //             name:'[name].[ext]',   //name为图片名称占位，ext为文件后缀
                //             limit:1024 * 3,     //阈值 超过阈值的图片会独立文件，没有超过会处理成base64
                //         }
                //     }
                // }
                {      
                // background: url("../../assets/logo.png");,相对于未打包时候的路径
                // 构建后生成在 dist/assets/images/logo.hash.png , 代码中注入引用路径
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    'file-loader?hash=sha512&digest=hex&limit=8192&name=assets/images/[name].[hash:8].[ext]'
                ]
            },
            ]
        },
        plugins:[
            new HtmlWebpackPlugin({
                template:'./src/index.html', //自动将./src/index.html文件添加到打包目录中
                minify: {
                    removeComments: true,//清理html中的注释
                    collapseWhitespace: isMinimize // 移除空白
                }
            }), 
             // 抽离注入在js的css代码，构建后生成 dist/css 下，（有利于⽤户端缓存、并⾏加载及减⼩js包的⼤⼩）
            new MiniCssExtractPlugin({
                filename:'css/[name].css',  //分离的css存放的位置,
                chunkFilename: 'css/[name].[contenthash:8].css'
            }),
             // 拷贝静态文件 报错compilation.getCache is not a function
            //  new CopyWebpackPlugin({
            //     patterns:[{ from: path.join(ROOT_PATH,'src/static'), to: path.join(ROOT_PATH,'dist') }]
            //  }),
            // 利用ProvidePlugin这个webpack内置API将React设置为全局引入，从而无需单个页面import引入
            new webpack.ProvidePlugin(webpackProvide),
        ],
        // 文件别名
        resolve:{
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
            modules: [path.join(ROOT_PATH, 'node_modules')],
            alias:{
                '@': path.join(ROOT_PATH,'src'),
                '@/pages': path.join(ROOT_PATH,'src/pages'),
            }
        },
        // 优化项
        // 文档地址：https://webpack.docschina.org/configuration/optimization/
        optimization: {
            // 文档地址：https://webpack.docschina.org/configuration/optimization/
            minimize: isMinimize, // 是否压缩代码，build时候执行压缩
            // minimizer: [
            //     new MinifyPlugin({}, {
            //         sourceMap: "cheap-module-source-map"
            //     })
            // ],
            minimizer: [
                //  压缩代码插件
                new UglifyJSPlugin({
                    sourceMap: true, // 是否生成压缩后的对照，方便我们定位error
                    uglifyOptions: {
                        // ie8: true,
                        compress: {
                            // 压缩时候去掉console、debugger
                            drop_debugger: true,
                            drop_console: true
                        }
                    }
                })
            ],
            usedExports: true,
            sideEffects: true,
            // 优化持久化缓存 , 辅助说明：https://segmentfault.com/q/1010000014954264
            runtimeChunk: {
                name: 'manifest'
            },
            // 代码切割
            splitChunks: {
                minSize: 30000, // (默认是30000)：形成一个新代码块最小的体积
                minChunks: 1, // （默认是1）：在分割之前，这个代码块最小应该被引用的次数（译注：保证代码块复用性，默认配置的策略是不需要多次引用也可以被分割）
                maxAsyncRequests: 5, //（默认是3）：一个入口最大的并行请求数
                maxInitialRequests: 3, //（默认是5）：按需加载时候最大的并行请求数
                name: false,
                cacheGroups: {
                    vendor: { // 对于从node_modules引用的第三方包的代码，构建后生成在 dist/js/vendor.chunkhash.js
                        // test用于控制哪些模块被这个缓存组匹配到。原封不动传递出去的话，它默认会选择所有的模块。可以传递的值类型：RegExp、String和Function
                        test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
                        name: 'vendor', // name(打包的chunks的名字)：字符串或者函数(函数可以根据条件自定义名字)
                        chunks: 'initial', // chunks (默认是async) ：initial、async和all
                        priority: 1, // 缓存组打包的先后优先级
                        reuseExistingChunk: false // 可设置是否重用该chunk
                    },
                    common: {
                        // 抽离 fp-common 下 公共的模块
                        test: /[\\/]fp-common[\\/]/,
                        name: 'common',
                        chunks: 'initial',
                        priority: 1
                    }
                }
            }
        }
    }
    return webpackConfig;
}