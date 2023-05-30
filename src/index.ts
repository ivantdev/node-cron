const cron = require('node-cron');
const dotenv = require('dotenv');
const node_fetch = require('node-fetch');

dotenv.config();

const fetchInterval: string = process.env.FETCH_INTERVAL || `*/5 * * * *`;

cron.schedule(fetchInterval, async () => {
  console.log(`running your task...`);
  
  let max_attempts: number = parseInt(process.env.MAX_ATTEMPTS as string) || 5;
  let status: number = 0;
  
  while (status !== 200 && max_attempts > 0) {
    try {
      const response = await node_fetch(process.env.API_URL as string);
      status = response.status;
      console.log(`status: ${status}`);
    } catch (error) {
      console.log(`error: ${error}`);
      max_attempts = max_attempts - 1;
    }
  }
  
  if (max_attempts === 0 && status !== 200) {
    console.log(`max attempts reached, please check your API`);
  } else {
    console.log(`task completed with ${max_attempts} attempts left`);
  }
});
