let localConfig = {};
// try {
//     localConfig = require('./config.local');
// } catch (err) { /*ignore*/ }
const defaultAppConfig = {
  backend_host: "https://62zrxtutca.execute-api.us-east-1.amazonaws.com/dev"
};
const AppConfig = {
    ...defaultAppConfig,
    ...localConfig
}
export default AppConfig;
