const CronJob = require('cron').CronJob;

const service = require('../services/cron.service');
const logger = require('../utils/logger');

module.exports = new CronJob({
  cronTime: '00 00 00 * * *',
  start: false,
  onTick: async () => {
    try {
      console.log('Start deleting unused files');
      console.time('Finish deleting unused files');
      await service.deleteFiles();
    } catch (err) {
      logger.error(err.stack);
    } finally {
      console.timeEnd('Finish deleting unused files');
    }
  }
});
