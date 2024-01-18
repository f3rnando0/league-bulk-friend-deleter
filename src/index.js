process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

import LCUConnector from 'lcu-connector';
import { warn, notOk, info } from './utils/logger.js';
import { delay } from './utils/delay.js';

const connector = new LCUConnector();

info('starting application..');
info('finding lcu credentials..');

connector.start();

connector.on('connect', async (credentials) => {
  const { port, protocol, address, username, password } = credentials;

  info('found lcu credentials.');

  info('browsing your friends..');

  const friendsReq = await fetch(
    `${protocol}://${address}:${port}/lol-chat/v1/friends`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
          'base64'
        )}`,
      },
    }
  );
  const friendsData = await friendsReq.json();
  if (!friendsData) return notOk(`could'nt retrieve your friends, try again!`);

  warn(
    `deleting ${friendsData.length} friends, if you dont want that close the app imediatly.`
  );

  await delay(5000);

  friendsData.map(async (friend) => {
    const friendsReq = await fetch(
      `${protocol}://${address}:${port}/lol-chat/v1/friends/${friend.puuid}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${username}:${password}`
          ).toString('base64')}`,
        },
      }
    );
    if (friendsReq.status !== 204)
      notOk('got an error while deleting a friend');
  });

  info(`task done. exiting`);
  await delay(2000);
  process.exit(1);
});

connector.on('disconnect', async (credentials) => {
  notOk('lost connection with lcu api, restart your game and app.');
  await delay(2000);
  process.exit(1);
});
