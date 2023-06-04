const cron = require('node-cron');
const dotenv = require('dotenv');
const node_fetch = require('node-fetch');

dotenv.config();

const fetchInterval: string = process.env.FETCH_INTERVAL || `*/5 * * * *`;

cron.schedule(fetchInterval, async () => {
  console.log(`running your task...`);
  
  let max_attempts: number = parseInt(process.env.MAX_ATTEMPTS as string) || 5;
  let status: number = 0;
  let flag: boolean = false;
  
  while (!flag && status !== 200 && max_attempts > 0) {
    const _response = await node_fetch(process.env.API_URL as string).then((res: any) => {
      status = res.status;
      if (res.status == 200) {
        flag = true;
      } else if (!res.ok) {
        const time = new Date().toISOString().slice(0, 23).replace('T', ' ');
        console.log(`${time} ${res.status}: ${res.statusText}`);
      }
      }).catch((err: any) => {
        console.log(`error: ${err}`);
      });
    max_attempts = max_attempts - 1;
  }

  const time = new Date().toISOString().slice(0, 23).replace('T', ' ');
  if (max_attempts === 0 && status !== 200) {
    console.log(`${time}: max attempts reached, please check your API on ${process.env.API_URL}`);
  } else {
    // time in this format [2023-06-01 12:00:00.661]
    console.log(`${time}: status ${status}: ${process.env.API_URL?.slice(0, 30)}... - task completed with ${max_attempts} attempts left`);
  }
  console.log(`ending task...`);
});
