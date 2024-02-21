import { color, execSync } from '@lzwme/fe-utils';

export default ({ logger }) => {
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
        //     cwd: 'D:\\coding\\lzwme\\_archive\\chatgpt-sites',
        //     stdio: 'inherit',
        //     windowsHide: true,
        //   }
        // },
        onTick: () => {
          const r = execSync('tsx src/index.ts --no-bot --ci', null, 'D:\\coding\\chatgpt-sites');
          if (r.stderr) logger.error(r.stderr);
        },
      },
    ],
  };
};
