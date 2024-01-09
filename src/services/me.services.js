import prisma from '../config/prisma.instance.js';
import createError from 'http-errors';
import { createResetPasswordToken } from '../helpers/jwt.service.js';
import { sendMail } from '../helpers/nodeMailer.js';
import { templateResetPassword, MAIL_RESET_PASSWORD_SUBJECT } from '../constant/mailTemplate.js';
import connectToRedis from '../config/redis.client.js';

export default {
  forGotPassword: async (email) => {
    try {
      //* check email aready exists
      const userInfo = await prisma.user.findUnique({ where: { email } });
      if (!userInfo) {
        throw createError.NotFound('Email does not exist.');
      }

      //* create reset password token
      const resetPassToken = await createResetPasswordToken(email);

      //* send to mail reset password url
      if (resetPassToken) {
        try {
          await sendMail(email, MAIL_RESET_PASSWORD_SUBJECT, templateResetPassword(userInfo.name, resetPassToken));
        } catch (err) {
          throw err;
        }
      }
      Promise.resolve(true);
    } catch (err) {
      throw err;
    }
  },

  resetUserPasswordByEmail: async (email, password) => {
    try {
      //* validate password
      // const { error } = passwordValidate({ password });
      // if (error) {
      //   throw createError(error.details[0].message);
      // }
      //* hash password
      // const salt = await bcrypt.genSalt(10);
      // const hashPassword = await bcrypt.hash(password, salt);

      //* update password
      const userUpdated = await prisma.user.update({
        where: { email },
        data: { password },
      });

      //* delete token stored before in redis
      if (userUpdated) {
        const redis = await connectToRedis();
        await redis.del(email);
      }
    } catch (err) {
      throw err;
    }
  },
};
