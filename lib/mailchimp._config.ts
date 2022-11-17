import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

export const test_ping = async () => {
  const test = await require('@mailchimp/mailchimp_marketing');
  test.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER,
  });
  const response = await test.ping.get();
  return await response;
};

export default mailchimp;
