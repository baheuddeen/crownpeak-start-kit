const Workflow = require('./enums');

/**
 * Update these variables to set what branch on crownpeak the jira branch the
 * build will upload its artifacts to.
 *
 * Workflow.Dev
 * Workflow.Stage
 */
module.exports = {
  'dev': Workflow.Dev,
  'stage': Workflow.Stage,
};
