// eslint-disable-next-line import/no-extraneous-dependencies
const core = require('@actions/core');
const config = require('./config');
const Workflow = require('./enums');
const { updateFile, getAssetId, getFolderId, authentication } = require('./updateFile');
const { getCssFiles } = require('./prepareFiles');

console.log('workflow', config.currentWorkflow);
if (config.currentWorkflow === Workflow.NOOP) {
  return;
}

let status;
const containingFolderIdConfig = {
  css: config.CSS_FOLDER_ID
};
switch (config.currentWorkflow) {
  case Workflow.Dev:
    status = config.STATUS_DEV;
    break;
  case Workflow.Stage:
    status = config.STATUS_STAGE;
    break;
  case Workflow.Live:
    if (config.BRANCH_NAME !== 'main') {
      throw new Error(`Can't push ${config.BRANCH_NAME} to live. Only main can be pushed to live`);
    }
    status = config.STATUS_LIVE;
    break;

  default:
    throw new Error('Unknown CI Workflow');
}

async function updateFiles() {
  try {
    const cssFiles = await getCssFiles();

    await authentication();
    for(const file of cssFiles){
      let conatainigFolderId = containingFolderIdConfig[file.containingFolder];
      if(!conatainigFolderId)
      {
        conatainigFolderId = await getFolderId(file.containingFolder, config.CSS_FOLDER_ID);
        containingFolderIdConfig[file.containingFolder] = conatainigFolderId;
        console.log(conatainigFolderId);
      }
      const destFileId = await getAssetId(file.label, conatainigFolderId, status);
      console.log(destFileId);
      await updateFile(destFileId, status, file.label, file.sourcePath);
    }
    
  } catch (error) {
    core.error(error);
    core.setFailed(error);
  }
}

updateFiles();