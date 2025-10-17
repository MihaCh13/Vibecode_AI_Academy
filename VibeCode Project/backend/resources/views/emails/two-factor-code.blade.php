<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Two-Factor Authentication Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .code-container {
            background: #f8fafc;
            border: 2px dashed #e2e8f0;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background: #fef3cd;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">AI</div>
            <h1 style="margin: 0; color: #1e293b;">Two-Factor Authentication</h1>
            <p style="margin: 10px 0 0 0; color: #64748b;">Secure access to your account</p>
        </div>

        <p>Hello <strong>{{ $user->name }}</strong>,</p>

        <p>You're trying to access your AI Tools Platform account. To complete the login process, please use the following verification code:</p>

        <div class="code-container">
            <div style="color: #64748b; font-size: 14px; margin-bottom: 10px;">Your verification code:</div>
            <div class="code">{{ $code }}</div>
        </div>

        <div class="warning">
            <strong>⚠️ Important:</strong> This code will expire in 5 minutes and can only be used once. If you didn't request this code, please ignore this email and consider changing your password.
        </div>

        <p style="margin-top: 30px;">
            If you're having trouble with this code, you can request a new one from the login page.
        </p>

        <div style="text-align: center;">
            <a href="{{ config('app.frontend_url') }}/login" class="button">Go to Login</a>
        </div>

        <div class="footer">
            <p>This email was sent by AI Tools Platform. Please do not reply to this email.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
