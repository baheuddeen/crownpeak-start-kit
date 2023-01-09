const env = require('dotenv');
const Workflow = require('./enums');
const gitBranchToCrownpeakBranchMap = require('./gitBrachToCrownpeakBranchMap');

env.config();
/** Set crownpeak workflow 'Dev', 'Stage' or 'Live' */
const { CP_API_BASE } = process.env;
const { CP_API_INSTANCE } = process.env;
const { CP_API_USERNAME } = process.env;
const { CP_API_PASSWORD } = process.env;
const { CP_API_KEY } = process.env;
const { BRANCH_NAME } = process.env;

/**Crownpeak */
// folders Ids.
const { CSS_FOLDER_ID } = process.env;
// Path:"/System/States/" where you can get the status Ids
const STATUS_DEV = 7932 ;
const STATUS_STAGE = 783 ;
const STATUS_LIVE = 785 ;
// Model IDs
const { ASSET_MODEL_ID } = process.env;
const { FOLDER_MODEL_ID } = process.env;

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
  CSS_FOLDER_ID,
  STATUS_DEV,
  STATUS_STAGE,
  STATUS_LIVE,
  ASSET_MODEL_ID,
  FOLDER_MODEL_ID,
  currentWorkflow,
  BRANCH_NAME,
};