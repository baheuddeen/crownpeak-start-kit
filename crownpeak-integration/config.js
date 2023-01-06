// eslint-disable-next-line import/no-extraneous-dependencies
const env = require('dotenv');
const Workflow = require('./enums');
const gitBranchToCrownpeakBranchMap = require('./gitBrachToCrownpeakBranchMap');

env.config();
/** Set crownpeak workflow 'Dev', 'Stage' or 'Live'
 * Current configuration pushs to Stage
 */
const { CP_API_BASE } = process.env;
const { CP_API_INSTANCE } = process.env;
const { CP_API_USERNAME } = process.env;
const { CP_API_PASSWORD } = process.env;
const { CP_API_KEY } = process.env;
const { BRANCH_NAME } = process.env;
let currentWorkflow = gitBranchToCrownpeakBranchMap[BRANCH_NAME] || null;
if (!currentWorkflow) {
  currentWorkflow = (BRANCH_NAME === 'main') ? Workflow.Live : Workflow.NOOP;
}

module.exports = {
  CP_API_BASE,
  CP_API_INSTANCE,
  CP_API_USERNAME,
  CP_API_PASSWORD,
  CP_API_KEY,
  DEV_BUNDLE_ASSET_ID,
  STAGE_BUNDLE_ASSET_ID,
  LIVE_BUNDLE_ASSET_ID,
  DEV_BUNDLE_MAP_ASSET_ID,
  STAGE_BUNDLE_MAP_ASSET_ID,
  LIVE_BUNDLE_MAP_ASSET_ID,
  DEV_CSS_ASSET_ID,
  STAGE_CSS_ASSET_ID,
  LIVE_CSS_ASSET_ID,
  DEV_MAP_CSS_ASSET_ID,
  STAGE_MAP_CSS_ASSET_ID,
  LIVE_MAP_CSS_ASSET_ID,
  DEV_WORKFLOW_COMMAND_ID,
  STAGE_WORKFLOW_COMMAND_ID,
  LIVE_WORKFLOW_COMMAND_ID,
  currentWorkflow,
  BRANCH_NAME,
};
