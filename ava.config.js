export default {
  compileEnhancements: false,
  files: [ "test/**/*" ],
  sources: [ "src/**/*" ],
  extensions: [ "ts" ],
  require: [ "esm", "ts-node/register", "lodash" ],
  timeout: "10s",
};
