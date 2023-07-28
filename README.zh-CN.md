<h1 align="center">vite-plugin-copy-dts</h1>
<br/>
<p align="center">
    <a href="https://npmjs.com/package/vite-plugin-copy-dts">
        <img src="https://img.shields.io/npm/v/vite-plugin-copy-dts.svg" alt="npm package">
    </a>
    <a href="https://img.shields.io/npm/l/vite-plugin-copy-dts">
      <img src="https://img.shields.io/npm/l/vite-plugin-copy-dts" alt="license"/>
    </a>
</p> 
<br/>


**中文** | [English](./README.md)


vite 将合并 [额外的dts声明] 到指定的输出文件中，
解决了`declare module` 和 `declare global` 
无法正常添加到打包d.ts目标声明文件中的问题   

```javascript
import copyDtsPlugin from 'vite-plugin-copy-dts'

export default defineConfig({
  plugins:[
    copyDtsPlugin({
       files:[
          {
            from:['types/*','src/types/extension.d.ts']
            to:'target.d.ts',
            excludes:['types/excludes.d.ts']
          },
          {
            from:'src/types/extension.d.ts',
            to:'target.d.ts'
          }
       ]
    })
  ]
})

```

### 文件注释标注

您可以在要复制的源文件中添加`双斜杠`注释实现代码截断合并

- `@copy-start` or `@start-copy` 标注目标文件的合并起点
- `@copy-block` or `@block-copy` 在某文件中任意地方使用该标注将会忽略该文件的合并

```javascript
import {} from 'vite'
// @copy-start   将从这里开始复制，会忽略前面的代码只复制后面代码，无标注情况下会全部复制
// @copy-block   如果在某个文件中发现该标注，则该文件中任何代码都不会被合并

function test(){}

type Test = {}

```

## Options Types


```javascript
export type EntryFunctionOption = {
    /** 指定根目录，后面files中定义的路径会以该root路径作为基准,默认当前项目环境路径 */
    root?: string
    
    /** 延时执行合并操作，单位ms，默认1000ms，如果遇到打包没合并，请尝试增加该时间
     * 为什么要延时？ 因为该插件是在其他dts打包工具打包完成输出文件之后(vite插件钩子writeBundle中)进行合并的，
     * 该插件无法控制其他dts打包工具进度，只能在合适时间进行合并 */
    delayMerge?: number,
    
    /** 日志级别 */
    logLevel?: LogLevel,
    
    /** 传入的文件映射数组 */
    files: Array<{
        /** 来自哪个文件或者路径，支持glob语法 */
        from: Array<string> | string,
        /** 要合并到哪个输出的d.ts文件中 */
        to: string;
        /** 要排除的文件 */
        excludes?: Array<string>
    }>,
}
```
## Notice

该插件合并过程未经过任何编译，只是简单将源文件代码原封不动追加到目标文件中

## 许可证

MIT 许可证.
