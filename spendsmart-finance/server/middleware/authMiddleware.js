import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseHelper.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 'Authorization token missing', 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) return sendError(res, 'Authorization token malformed', 401);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid token. Please log in again.';
    return sendError(res, msg, 401);
  }
};

export default authenticate;
