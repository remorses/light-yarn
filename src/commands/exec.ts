import { BaseCommand } from "@yarnpkg/cli";
import { Configuration, execUtils, scriptUtils } from "@yarnpkg/core";
import { xfs } from "@yarnpkg/fslib";
import { Command, Usage } from "clipanion";
import path from "path";

// eslint-disable-next-line arca/no-default-export
export default class ExecCommand extends BaseCommand {
  @Command.String()
  commandName!: string;

  @Command.Proxy()
  args: Array<string> = [];

  static usage: Usage = Command.Usage({
    description: `execute a shell command`,
    details: `
      This command simply executes a shell binary within the context of the root directory of the active workspace.

      It also makes sure to call it in a way that's compatible with the current project (for example, on PnP projects the environment will be setup in such a way that PnP will be correctly injected into the environment).
    `,
    examples: [[`Execute a shell command`, `$0 exec echo Hello World`]],
  });

  @Command.Path(`lightexec`)
  async execute() {
    console.log({cwd: this.context.cwd})
    const configuration = await Configuration.find(
      this.context.cwd,
      this.context.plugins
      );
    console.log({projectCwd: configuration.projectCwd})
    console.log({commandName: this.commandName})
    console.log({args: this.args})
    // const {project} = await Project.find(configuration, this.context.cwd);

    return await xfs.mktempPromise(async (binFolder) => {
      const { code } = await execUtils.pipevp(this.commandName, this.args, {
        cwd: this.context.cwd,
        stdin: this.context.stdin,
        stdout: this.context.stdout,
        stderr: this.context.stderr,
        env: {
          ...(await scriptUtils.makeScriptEnv({ binFolder })),
          NODE_OPTIONS:
            (process.env.NODE_OPTIONS || "") +
            " --require " +
            path.resolve(configuration.projectCwd as any, ".pnp.js"),
        },
      });

      return code;
    });
  }
}
