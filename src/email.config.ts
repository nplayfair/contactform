import * as dotenv from 'dotenv';

dotenv.config();

export default {
  user: process.env.USERNAME ?? '',
  email: process.env.EMAIL ?? '',
  key: process.env.KEY ?? '',
};
