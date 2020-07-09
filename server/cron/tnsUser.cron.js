const CronJob = require('cron').CronJob;

const service = require('../services/cron.service');
const logger = require('../utils/logger');

module.exports = new CronJob({
  cronTime: '00 00 * * * *',
  start: false,
  onTick: async () => {
    try {
      console.log('Start fetching TNS users');
      console.time('Finish fetching TNS users');
      await service.fetchTnsUsers();
    } catch (err) {
      logger.error(err.stack);
    } finally {
      console.timeEnd('Finish fetching TNS users');
    }
  }
});
