export default {
  compileEnhancements: false,
  files: [ "tests/**/*" ],
  sources: [ "src/**/*" ],
  extensions: [ "ts" ],
  require: [ "esm", "ts-node/register", "lodash" ],
  timeout: "10s",
};
