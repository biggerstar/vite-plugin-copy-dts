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


**English** | [中文](./README.zh-CN.md)

Vite will merge [additional dts declarations] into the specified output file,
Resolved the `declare module` and `declare global`
Problem with not being able to add to the packaged d.ts target declaration file properly

---
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

## File annotation

You can add a `double slash` annotation in the source file to be copied to achieve code truncation and merging

- `@copy-start` or `@start-copy` Mark the merge starting point of the target file
- `@copy-block` or `@block-copy` Using this annotation anywhere in a file will ignore the merging of that file

```javascript
import {} from 'vite'
// @copy-start   We will start copying from here, ignoring the previous code and only copying the following code. If there are no annotations, we will copy all of them
// @copy-block   If the annotation is found in a file, no code in that file will be merged

function test(){}

type Test = {}

```

## Options Types


```javascript
export type EntryFunctionOption = {
    /** Specify the root directory, and the paths defined in the files will be based on this root path, which defaults to the current project environment path */
    root?: string
    
    /** Delayed execution of merge operation, unit: ms, default: 1000ms. If you encounter packaging not merged, please try increasing this time
    * Why delay? Because this plugin was merged after other DTS packaging tools finished packaging the output file (in the vite plugin hook writeBundle),
    * This plugin cannot control the progress of other DTS packaging tools and can only merge at an appropriate time */
    delayMerge?: number,
    
    /** log level */
    logLevel?: LogLevel,
    
    /** Incoming file mapping array */
    files: Array<{
        /** Which file or path does it come from? Supports glob syntax */
        from: Array<string> | string,
        /** Which output d.ts file to merge into */
        to: string;
        /** Files to exclude */
        excludes?: Array<string>
    }>,
}
```
## Notice

The plugin merge process has not undergone any compilation, just simply appending the source file code intact to the target file

## License

MIT License.
