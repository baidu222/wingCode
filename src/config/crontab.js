module.exports = [
    {
      cron: '*/1 * * * *',
      handle: 'admin/crontab/cloa',
      type: 'one',
      enable: true // 关闭当前定时器，默认true
    },
    {
      cron: '* 0 * * * *',
      handle: '/home/business/polling',
      type: 'one',
      enable: true // 关闭当前定时器，默认true
    }
];
