import meServices from '../services/me.services.js';

export default {
  forGotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      await meServices.forGotPassword(email);
      res.status(200).json({
        status: 200,
        message: 'reset password information send to mail',
      });
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { email } = req.payload;
      const { password } = req.body;

      await meServices.resetUserPasswordByEmail(email, password);
      res.status(200).json({
        status: 200,
        message: 'reset password success.',
      });
    } catch (err) {
      next(err);
    }
  },
};
