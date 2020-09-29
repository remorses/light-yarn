Faster yarn commands 


## Examples


```
yarn lightrun tsc -v
yarn lightrun scriptName

yarn lightexec tsc -v

yarn lightnode file.js

yarn workspaces foreach --parallel lightexec echo ciao
```

## TODOs

- env vars interpolation like `--jobs ${CI_LERNA_CONCURRENCY:-8}`