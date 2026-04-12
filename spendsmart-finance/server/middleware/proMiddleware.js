import User from '../models/User.js';
import { sendError } from '../utils/responseHelper.js';

const requirePro = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return sendError(res, 'User not found', 404);
    if (!user.isPro) return sendError(res, 'This feature requires a Pro subscription', 403);
    req.currentUser = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default requirePro;
