import chalk from 'chalk'
import memoizefs from 'memoize-fs'
import os from 'os'
import _ from 'lodash'
import path from 'path'
import exec from './commands/exec'
import node from './commands/node'
import run from './commands/run'
import findUp from 'find-up'

export const memoizer = memoizefs({
    cachePath: path.resolve(os.tmpdir(), 'yarn-plugin-cache'),
})

const plugin = {
    name: `plugin-light-yarn`,
    id: `plugin-light-yarn`,
    factory: () => {
        const pnpFile = findUp.sync('.pnp.js')
        if (pnpFile) {
            // @ts-ignore use the yarn require implementation
            __non_webpack_require__(pnpFile).setup()
        }

        return {
            hooks: {
                afterAllInstalled() {
                    // console.error(
                    //     chalk.green(`Invalidating light-yarn plugin cache`),
                    // )
                    memoizer.invalidate()
                },
            },
            id: `plugin-light-yarn`,
            commands: [run, exec, node],
        }
    },
}

export default plugin

module.exports = plugin
