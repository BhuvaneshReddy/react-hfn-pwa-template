import path from 'path';

export default class ProjectWebpack {

    apply(webpackHandler) {
        webpackHandler.hooks.beforeConfig.tap('AppSemanticConfig', (env, type, config) => {
            let configs = config;
            if (!Array.isArray(config)) {
                configs = [config];
            }
            configs.forEach((wConfig) => {
                wConfig.resolve = wConfig.resolve || {};
                wConfig.resolve.alias = wConfig.resolve.alias || {};
                wConfig.resolve.alias['themes'] = path.resolve(path.join(process.env.PROJECT_ROOT, 'node_modules/semantic-ui-css/themes'));
            });
        });
    }
}
