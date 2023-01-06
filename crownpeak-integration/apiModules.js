const { request } = require('requestify');
const config = require('./config');

const baseURL = `${config.CP_API_BASE}/${config.CP_API_INSTANCE}/cpt_webservice/accessapi`;
// setup http headers
const options = {
  body: '',
  method: 'POST',
  headers: {
    'x-api-key': config.CP_API_KEY,
    'Content-Type': 'application/json; charset=utf8',
    Accept: 'application/json',
    Cookie: '',
  },
};

// handles cookies between http calls
function processCookies(resp) {
  if (resp.headers['set-cookie'] != null) {
    const cooks = resp.headers['set-cookie'];
    cooks.forEach((cookie) => {
      const [parts] = cookie.split(';');
      options.headers.Cookie += `${parts};`;
    });
  }
}

// http call
async function restPost(url, body) {
  console.log('start');
  const fullUrl = baseURL + url;
  options.body = body;
  console.log(`Start calling : ${fullUrl}`);
  try {
    const res = await request(fullUrl, options);
    processCookies(res);
    return (JSON.parse(res.body));
  } catch (err) {
    console.log(err);
    // todo: handle http 429, rate limiting busy, retry-after
    throw new Error(`Error calling: ${fullUrl}`);
  }
}

exports.auth = async () => {
  const body = {
    instance: config.CP_API_INSTANCE,
    username: config.CP_API_USERNAME,
    password: config.CP_API_PASSWORD,
    remember_me: false,
  };
  const res = await restPost('/auth/authenticate', body);
  return res;
};

exports.assetExists = async (path) => {
  const body = { assetIdOrPath: path };
  const res = await restPost('/asset/Exists', body);
  return res;
};

exports.assetUpload = async (newName, folderId, modelId, workflowId, bytes) => {
  const body = {
    newName,
    destinationFolderId: folderId,
    modelId,
    workflowId,
    bytes,
  };
  const res = await restPost('/asset/Upload', body);
  return res;
};

exports.assetCreate = async (newName, folderId,
  modelId, type, devTemplateLanguage, templateId, workflowId) => {
  const body = {
    newName,
    destinationFolderId: folderId,
    modelId,
    type,
    devTemplateLanguage,
    templateId,
    workflowId,
  };
  if (folderId === 0 || folderId === undefined) {
    console.log(`create asset error, folderId = ${folderId}`);
    throw new Error('not allowed to import to root');
  }
  const res = await restPost('/asset/Create', body);
  return res;
};

exports.assetUpdate = async (destId, content) => {
  const body = {
    assetId: destId,
    fields: {
      body: content,
    },
  };
  const res = await restPost('/Asset/Update', body);
  return res;
};

exports.assetBranch = async (destId) => {
  const body = {
  };
  const res = await restPost(`/Asset/Branch/${destId}`, body);
  return res;
};

exports.assetPrepare = async (destId, fileName, modelId, totalSize) => {
  const body = {
    destinationId: destId,
    label: fileName,
    totalSize,
    modelId,
  };
  const res = await restPost('/upload/assetprepare', body);
  return res;
};

exports.bytes = async (data, uploadTicket) => {
  const body = {
    bytes: data,
    base64: null,
    checksum: null,
    uploadTicket,
  };
  const res = await restPost('/upload/bytes', body);
  return res;
};
exports.assetComplete = async (destId, fileName, modelId, uploadTicket) => {
  const body = {
    destinationId: destId,
    label: fileName,
    modelId,
    uploadTicket,
  };
  const res = await restPost('/upload/assetcomplete', body);
  return res;
};

exports.assetRepublish = async (destId, commandId) => {
  const body = {
    assetId: destId,
    commandId,
    skipDependencies: true,
  };
  const res = await restPost('/asset/executeworkflowcommand', body);
  return res;
};
