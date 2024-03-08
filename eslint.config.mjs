import config from "@markormesher/eslint-config";

for (let i = 0; i < config.length; ++i) {
  if (config[i].languageOptions?.parserOptions?.project) {
    config[i].languageOptions.parserOptions.project = "./tsconfig.all.json";
  }
}

export default config;
