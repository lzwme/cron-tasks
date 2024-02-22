export default async ({ logger, FeUtils: { execPromisfy } }) => {
  return {
    /** @type { import('cron').CronJobParams[] } */
    configList: [
      {
        desc: 'chatgpt-sites 每日更新',
        cronTime: '0 0 8 * * *',
        // onTick: {
        //   command: 'tsx',
        //   args: ['src/index.ts','--no-bot', '--ci'],
        //   options: {
        //     cwd: 'D:\\coding\\chatgpt-sites',
        //     stdio: 'inherit',
        //     windowsHide: true,
        //   }
        // },
        onTick: async () => {
          const r = await execPromisfy('tsx src/index.ts --no-bot --ci', null, { cwd: 'D:\\coding\\chatgpt-sites' });
          if (r.stderr) logger.error(r.stderr);
        },
      },
    ],
  };
};
