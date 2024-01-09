import dotenv from 'dotenv';
dotenv.config();

// subject template mail reset pass
export const MAIL_RESET_PASSWORD_SUBJECT = '[SuperMarket Management reset password]';

export const templateResetPassword = (name, token) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
      <style>
          body {
              display: flex;
              margin: 0;
              padding: 0;
              color: #000000;
              font-family: Arial, sans-serif;
          }
  
          .container {
              max-width: 600px;
              margin: auto auto;
              padding: 30px;
              border: #f0f0f0 2px solid;
              border-radius: 8px;
              background-color: #f6fafc;
          }
  
          p {
              line-height: 1.4;
              margin-bottom: 15px;
          }
  
          h1 {
              padding: 0;
              margin: 0;
              font-size: 26px;
          }
  
          hr {
              border-color: #ffffff;
          }
  
          .wrap-button {
              display: flex;
          }
  
          .login-button {
              display: inline-block;
              background-color: #3AAEE0;
              padding: 10px 20px;
              border-radius: 4px;
              font-weight: bold;
              text-align: center;
              color: #FFFFFF;
              text-decoration: none;
              margin: 15px auto 0;
              box-shadow: 0 5px 10px rgba(58, 174, 224, 0.5);
          }
  
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Hello ${name},</h1>
          <p>You have requested to reset your password for the <b style="color: rgb(244, 131, 61);">SuperMarket Management</b> system!</p>
          <hr/>
          <p>You cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link!</p>
          <div class="wrap-button">
              <a href="${process.env.CLIENT_URL}/reset-password/${token}" class="login-button">Reset Password</a>
          </div>
      </div>
  </body>
  </html>`;
};
