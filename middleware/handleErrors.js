import { GeneralError } from '../utils/error';

export const handleErrors = async (err, req, res, next) => {
  if (err instanceof GeneralError) {
    const code = err.getCode();
    return res.status(code).json({ name: err.name, message: err.message });
  }
  return res.status(500).json({
    name: 'internal server error', message: err.message,
  });
};
