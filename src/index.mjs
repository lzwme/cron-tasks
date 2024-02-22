/*
 * @Author: renxia
 * @Date: 2024-02-21 10:46:58
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-22 09:12:13
 * @Description:
 */
import { CronJob } from 'cron';
import * as FeUtils from '@lzwme/fe-utils';
import { NLogger, color, execSync } from '@lzwme/fe-utils';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';

const logger = new NLogger('[cron]', { logDir: 'logs' });
const jobMap = new Map();

async function getConfig() {
  const dirs = [process.cwd(), homedir()];
  for (const dir of dirs) {
    const configFile = resolve(dir, './cron.config.mjs');
    if (fs.existsSync(configFile)) {
      const { default: cronConfig } = await import(pathToFileURL(configFile));
      return cronConfig({ logger, execSync, FeUtils });
    }
  }

  const configSampleFile = resolve(dirname(fileURLToPath(import.meta.url)), '../cron.config.sample.mjs');
  logger.error('请配置 cron.config.mjs 文件！参考：', configSampleFile);
}

async function cronJob() {
  const cfg = await getConfig();
  if (!cfg) return;

  for (let config of cfg.configList) {
    const job = CronJob.from({
      timeZone: 'Asia/Shanghai',
      onComplete: () => {
        logger.info(`任务执行完成：[${color.green(config.desc)}]`);
      },
      ...config,
      onTick: async () => {
        if (config.onTick) {
          try {
            logger.info(`任务执行中：[${color.cyan(config.desc)}]`);
            await config.onTick.call(config);
          } catch (e) {
            logger.error(e);
          }
        }
      },
    });

    job.start();
    jobMap.set(config, job);
    logger.log(`job inited: [${jobMap.size}][next: ${color.cyan(job.nextDate().toISO())}][${color.greenBright(config.desc)}]`);
  }

  logger.info(`cron job running. total: ${color.cyan(jobMap.size)}`);
}

cronJob();
