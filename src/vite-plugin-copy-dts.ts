import {relative, resolve} from "node:path";
import {readFileSync} from "node:fs";
import process from "node:process";
import {Plugin} from 'vite'
import {globSync} from "glob";
import shelljs from 'shelljs'
import colors from "picocolors";

export type LogLevel = 'silent' | 'info'

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


/** 注意：该插件无任何ast语法树解析提取，只是简单的将源文件内容合并到目标文件，该插件参考了vue-router的做法
 *  您可以直接在files中定义的from指向的文件也就是即将要合并的文件中，
 *  使用双斜杠注释 // @copy-start 或者 // @start-copy，定义该d.ts文件要合并切割的起始点，默认是从第一行开始进行合并
 *  使用双斜杠注释 // @copy-block 或者 // @block-copy ，任意地方写上就行，只要遇到该字段该文件则不会被合并到目标d.ts中
 * */
export default function copyDtsPlugin(options: EntryFunctionOption): Plugin {
    const files = options.files
    const root = options.root || process.cwd()
    const delay = options.delayMerge || 1000
    const logLevel = options.logLevel || 'silent'
    const infoHeader = '[vite:copy-dts]'
    return {
        name: 'vite-plugin-copy-dts',
        apply: 'build',
        writeBundle() {
            files.forEach(item => {
                const fromList: Array<string> = Array.isArray(item.from) ? item.from : [item.from]
                const excludeList = item.excludes || []
                const excludePathList = excludeList.map((path) => globSync(resolve(root, path))).flat()
                let packDtsPath = fromList.map((path) => globSync(resolve(root, path))).flat()
                packDtsPath = packDtsPath.filter((path: string) => !excludePathList.includes(path))
                packDtsPath.forEach((fromPath) => {
                    let startLine = 1
                    const from = relative(process.cwd(), fromPath)
                    const to = relative(process.cwd(), resolve(root, item.to))
                    const content = readFileSync(from, 'utf-8');
                    const lines = content.split('\n');
                    let isBlockCopy = false
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i]
                        if (line.includes('@copy-start') || line.includes('@start-copy')) {
                            startLine = i + 2    // 找到开始标志直接退出
                            break
                        }
                        if (line.includes('@copy-block') || line.includes('@block-copy')) {
                            isBlockCopy = true  // 找到阻止该文件输出的标志直接退出
                            return
                        }
                    }
                    if (logLevel === 'info') {
                        console.log(colors.cyan(infoHeader), ':', colors.green('startLine'), startLine, colors.gray(`${from} >> ${to}`));
                    }
                    const command = `tail -n +${startLine} ${from}  >>  ${to}`
                    setTimeout(() => {
                        shelljs.exec(command)
                    }, delay)
                })
            })
        }
    }
}
