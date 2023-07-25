vite 合并 [额外的dts声明] 到指定的输出文件中

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
