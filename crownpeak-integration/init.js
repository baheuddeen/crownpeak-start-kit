// eslint-disable-next-line import/no-extraneous-dependencies
const core = require('@actions/core');
const config = require('./config');
const Workflow = require('./enums');
const { updateFile, authentication } = require('./updateFile');

if (config.currentWorkflow === Workflow.NOOP) {
  return;
}

let bundleAssetId;
let bundleMapAssetId;
let CSSAssetId;
let CSSMapAssetId;
let commandId;

switch (config.currentWorkflow) {
  case Workflow.Dev:
    bundleAssetId = config.DEV_BUNDLE_ASSET_ID;
    bundleMapAssetId = config.DEV_BUNDLE_MAP_ASSET_ID;
    CSSAssetId = config.DEV_CSS_ASSET_ID;
    CSSMapAssetId = config.DEV_MAP_CSS_ASSET_ID;
    commandId = config.DEV_WORKFLOW_COMMAND_ID;
    break;
  case Workflow.Stage:
    bundleAssetId = config.STAGE_BUNDLE_ASSET_ID;
    bundleMapAssetId = config.STAGE_BUNDLE_MAP_ASSET_ID;
    CSSAssetId = config.STAGE_CSS_ASSET_ID;
    CSSMapAssetId = config.STAGE_MAP_CSS_ASSET_ID;
    commandId = config.STAGE_WORKFLOW_COMMAND_ID;
    break;
  case Workflow.Live:
    if (config.BRANCH_NAME !== 'main') {
      throw new Error(`Can't push ${config.BRANCH_NAME} to live. Only main can be pushed to live`);
    }
    bundleAssetId = config.LIVE_BUNDLE_ASSET_ID;
    bundleMapAssetId = config.LIVE_BUNDLE_MAP_ASSET_ID;
    CSSAssetId = config.LIVE_CSS_ASSET_ID;
    CSSMapAssetId = config.LIVE_MAP_CSS_ASSET_ID;
    commandId = config.LIVE_WORKFLOW_COMMAND_ID;
    break;

  default:
    throw new Error('Unknown CI Workflow');
}

async function updateFiles() {
  try {
    await authentication();
    await updateFile(bundleAssetId, commandId, 'www-onshape-bundle.js', './dist/js/www-onshape-bundle.js');
    await updateFile(bundleMapAssetId, commandId, 'www-onshape-bundle.js.map', './dist/js/www-onshape-bundle.js.map');
    await updateFile(CSSAssetId, commandId, 'main.css', './dist/css/main.css');
    await updateFile(CSSMapAssetId, commandId, 'main.css.map', './dist/css/main.css.map');
  } catch (error) {
    core.error(error);
    core.setFailed(error);
  }
}

updateFiles();
