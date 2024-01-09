import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import connectToRedis from '../config/redis.client.js';

const createResetPasswordToken = async (email) => {
  return new Promise((resolve, reject) => {
    //* tạo jwt token với payload = email
    const payload = { email };

    const options = {
      algorithm: 'HS256',
      expiresIn: process.env.RESET_PASSWORD_TOKEN_EXP_TIME,
    };

    const secretKey = process.env.RESET_PASSWORD_SECRECT_KEY;

    jwt.sign(payload, secretKey, options, async (error, token) => {
      if (error) {
        reject(error);
      }

      try {
        //* store token into redis {email: token}
        const redis = await connectToRedis();

        await redis.set(email, token, {
          EX: Number(process.env.RESET_PASSWORD_TOKEN_EXP_TIME_REDIS),
        });
      } catch (err) {
        reject(error);
      }

      resolve(token);
    });
  });
};

const verifyResetPasswordToken = async (req, res, next) => {
  const { token } = req.params;
  if (!token) next(createError.NotFound('reset password token not found.'));

  //* verify jwt token
  jwt.verify(token, process.env.RESET_PASSWORD_SECRECT_KEY, async (error, payload) => {
    if (error) {
      return next(createError.Unauthorized(error.message));
    }

    //* check has email in token payload
    if (!payload?.email) {
      return next(createError.Unauthorized('Reset password token is not exists.'));
    }

    //* get token in redis by email key
    const redis = await connectToRedis();
    const redisToken = await redis.get(payload.email);

    //* check email key exist in redis
    if (!redisToken) {
      return next(createError.Unauthorized('Reset password token is not exists.'));
    }

    //* compare input_token with latest_token in redis
    if (redisToken !== token) {
      return next(createError.Unauthorized('Reset password token is invalid.'));
    }

    req.payload = payload;
    next();
  });
};

export {
  createResetPasswordToken,
  verifyResetPasswordToken,
};
