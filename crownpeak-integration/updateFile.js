const fs = require('fs');
const accessAPI = require('./apiModules');

async function authentication() {
  // authentication
  try {
    await accessAPI.auth();
  } catch (err) {
    throw new Error(`can't upload the file ${err}`);
  }
}

async function updateFile(assetId, commandId, assetLabel, srcFile) {
  try {
    // reading the file async
    const fileData = await fs.promises.readFile(srcFile);

    // codding the file
    const bytes = Buffer.from(fileData).toString('base64');
    const dataSize = fileData.byteLength;

    // prepareTheAsset
    const assetPrepareRes = await accessAPI.assetPrepare(
      assetId,
      assetLabel,
      '2263',
      dataSize,
    );

    // get the upload Ticket
    const { uploadTicket } = assetPrepareRes;

    // upload the file
    await accessAPI.bytes(bytes, uploadTicket);

    // complete the change
    await accessAPI.assetComplete(
      assetId,
      assetLabel,
      '2263',
      uploadTicket,
    );

    // republish the assetcls
    await accessAPI.routeAsset(
      assetId,
      commandId,
    );
  } catch (err) {
    throw new Error(`can't upload the file ${err}`);
  }
}


async function getAssetId(label, containgFolderId, statusId) {
  try {
    return await accessAPI.getAssetId(label, containgFolderId, statusId);
  } catch (err) {
    throw new Error(`can't upload the file ${err}`);
  }
}

async function getFolderId(label, containgFolderId) {
  try {
    return await accessAPI.getFolderId(label, containgFolderId);
  } catch (err) {
    throw new Error(`can't upload the file ${err}`);
  }
}

module.exports = { updateFile, getAssetId, authentication, getFolderId };