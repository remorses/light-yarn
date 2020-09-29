import chalk from 'chalk'
import memoizefs from 'memoize-fs'
import os from 'os'
import _ from 'lodash'
import path from 'path'
import exec from './commands/exec'
import node from './commands/node'
import run from './commands/run'

var Module = require('module')
require('@yarnpkg/core')
require('@yarnpkg/fslib')
require('cross-spawn')
const names = ['@yarnpkg/core', '@yarnpkg/fslib', 'cross-spawn']
const mods = Object.assign(
    {},
    ...names.map((x) => ({
        [x]: require(x),
    })),
)

replaceRequire(dynamicRequire)

export const memoizer = memoizefs({
    cachePath: path.resolve(os.tmpdir(), 'yarn-plugin-cache'),
})

const plugin = {
    name: `plugin-hello-world`,
    factory: () => ({
        hooks: {
            afterAllInstalled() {
                console.error(chalk.green(`Invalidating lightweight cache`))
                memoizer.invalidate()
            },
        },
        commands: [run, exec, node],
    }),
}

// eslint-disable-next-line arca/no-default-export
export default plugin

module.exports = plugin

function dynamicRequire(originalRequire, name) {
    return mods[name]
}

function replaceRequire(newRequire) {
    var originalRequire = Module.prototype.require

    Module.prototype.require = function (name) {
        //do your thing here
        return newRequire(originalRequire, name)
    }
}

// const requireByName = (
//     name: string,
//     makeGlobal?: string | boolean,
// ): Promise<any> =>
//     getAllModules().then((modules) => {
//         let returnMember
//         let module = _.find<any, any>(modules, (module) => {
//             if (_.isObject(module.exports) && name in module.exports) {
//                 returnMember = true
//                 return true
//             } else if (
//                 _.isFunction(module.exports) &&
//                 module.exports.name === name
//             ) {
//                 return true
//             }
//         })
//         if (module) {
//             module = returnMember ? module.exports[name] : module.exports
//             if (makeGlobal) {
//                 const moduleName =
//                     makeGlobal === true ? name : (makeGlobal as string)
//                 window[moduleName] = module
//                 console.log(
//                     `Module or module export saved as 'window.${moduleName}':`,
//                     module,
//                 )
//             } else {
//                 console.log(`Module or module export 'name' found:`, module)
//             }
//             return module
//         }
//         console.warn(`Module or module export '${name}'' could not be found`)
//         return null
//     })

// // Returns promise that resolves to all installed modules
// function getAllModules() {
//     return new Promise((resolve) => {
//         const id = _.uniqueId('fakeModule_')
//         window['webpackJsonp'](
//             [],
//             {
//                 [id]: function (module, exports, __webpack_require__) {
//                     resolve(__webpack_require__.c)
//                 },
//             },
//             [id],
//         )
//     })
// }
