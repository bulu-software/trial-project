import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

# Logger setup
logger = logging.getLogger("email_service")
logging.basicConfig(level=logging.INFO)

SECRET_KEY = os.getenv("SECRET_KEY", "plantshop_super_secret_jwt_key_2026_change_in_production")
ALGORITHM = "HS256"
RESET_TOKEN_EXPIRE_MINUTES = 30
OTP_EXPIRE_MINUTES = 10

# SMTP Configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").replace(" ", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USER or "noreply@plantshop.com")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "PlantShop Support")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def create_reset_token(email: str, expires_minutes: int = RESET_TOKEN_EXPIRE_MINUTES) -> str:
    """Generate a signed JWT token specifically for password reset."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload = {
        "sub": email,
        "type": "reset_password",
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_reset_token(token: str) -> Optional[str]:
    """Verify password reset JWT token and return the email if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_type = payload.get("type")
        email = payload.get("sub")
        if token_type != "reset_password" or not email:
            return None
        return email
    except JWTError as e:
        logger.warning(f"Invalid reset token: {e}")
        return None


def get_otp_html_template(user_name: str, otp_code: str) -> str:
    """Generate modern HTML email template for 6-digit OTP code."""
    otp_digits = " ".join(list(otp_code))
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code - PlantShop</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #09090b;
      color: #f4f4f5;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }}
    .wrapper {{
      width: 100%;
      background-color: #09090b;
      padding: 40px 15px;
    }}
    .container {{
      max-width: 520px;
      margin: 0 auto;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }}
    .header {{
      background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
      padding: 32px 24px;
      text-align: center;
    }}
    .header h1 {{
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }}
    .header p {{
      margin: 6px 0 0 0;
      color: #a7f3d0;
      font-size: 14px;
    }}
    .body {{
      padding: 32px 28px;
      text-align: center;
    }}
    .body p {{
      font-size: 15px;
      line-height: 1.6;
      color: #d4d4d8;
      margin: 0 0 16px 0;
      text-align: left;
    }}
    .otp-box {{
      background-color: #09090b;
      border: 2px dashed #10b981;
      border-radius: 14px;
      padding: 20px;
      margin: 28px 0;
      text-align: center;
    }}
    .otp-code {{
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 10px;
      color: #34d399;
      font-family: 'Courier New', Courier, monospace;
    }}
    .expiry-note {{
      background-color: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 13px;
      color: #6ee7b7;
      margin-top: 24px;
      text-align: left;
    }}
    .footer {{
      background-color: #121215;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #71717a;
      border-top: 1px solid #27272a;
    }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>🌱 PlantShop</h1>
        <p>Verification Code</p>
      </div>
      <div class="body">
        <p>Hello <strong>{user_name}</strong>,</p>
        <p>Use the 6-digit OTP code below to reset your PlantShop account password:</p>
        
        <div class="otp-box">
          <div class="otp-code">{otp_digits}</div>
        </div>
        
        <div class="expiry-note">
          ⏱️ This OTP code is valid for <strong>{OTP_EXPIRE_MINUTES} minutes</strong>. Do not share this code with anyone.
        </div>

        <p style="margin-top: 20px; font-size: 13px; color: #a1a1aa;">
          If you didn't request a password reset, please ignore this email or contact support immediately.
        </p>
      </div>
      <div class="footer">
        © {datetime.now().year} PlantShop. All rights reserved.<br>
        This is an automated security message, please do not reply.
      </div>
    </div>
  </div>
</body>
</html>
"""


def send_otp_email(to_email: str, user_name: str, otp_code: str) -> bool:
    """Send a 6-digit OTP email to the user's registered email address."""
    logger.info(f"📧 Preparing OTP verification email for: {to_email}")

    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning(
            f"⚠️ SMTP credentials not set in .env! DEV OTP CODE for {to_email}: {otp_code}"
        )
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your PlantShop verification code"
        msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        msg["To"] = to_email

        plain_text = (
            f"Hello {user_name},\n\n"
            f"Your 6-digit PlantShop password reset verification code is: {otp_code}\n\n"
            f"This code will expire in {OTP_EXPIRE_MINUTES} minutes.\n"
            f"Do not share this code with anyone.\n"
        )
        html_content = get_otp_html_template(user_name=user_name, otp_code=otp_code)

        msg.attach(MIMEText(plain_text, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=15) as server:
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())

        logger.info(f"✅ OTP email successfully sent to {to_email}")
        return True

    except Exception as e:
        logger.error(f"❌ Failed to send OTP email to {to_email}: {e}")
        return False


def send_reset_password_email(to_email: str, user_name: str, reset_token: str) -> bool:
    """Send a password reset email with the full reset link."""
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    logger.info(f"🔗 RESET LINK GENERATED FOR: {to_email}")
    logger.info(f"🔗 URL: {reset_link}")

    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("⚠️ SMTP credentials not configured. Reset link logged to console.")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Reset Your PlantShop Password"
        msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        msg["To"] = to_email

        plain_text = (
            f"Hello {user_name},\n\n"
            f"We received a request to reset your PlantShop password.\n\n"
            f"Click the link below to set a new password:\n{reset_link}\n\n"
            f"This link will expire in {RESET_TOKEN_EXPIRE_MINUTES} minutes.\n"
            f"If you did not request this, you can safely ignore this email.\n"
        )
        msg.attach(MIMEText(plain_text, "plain"))

        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=15) as server:
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())

        logger.info(f"✅ Reset password email successfully sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to send reset password email: {e}")
        return False
