import express from 'express';
import dotenv from 'dotenv';
import configure from './controllers';

import connectDB from './config/db';
import { handleErrors } from './middleware/handleErrors';

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;
const app = express();

// Body parse
app.use(express.json());
connectDB();
configure(app);
app.use(handleErrors);
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
