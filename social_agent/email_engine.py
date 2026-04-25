import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import os
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()

def send_video_email(video_path, product_name):
    # --- CONFIG ---
    SENDER_EMAIL = os.getenv("EMAIL_USER")
    SENDER_PASSWORD = os.getenv("EMAIL_PASS")
    RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", "rahulsharmasujan@gmail.com")
    
    if not SENDER_PASSWORD:
        print("FAILED: EMAIL_PASS not set in environment. Skipping email.")
        return False

    print(f"INFO: Sending video to {RECIPIENT_EMAIL}...")

    # Create Message
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    msg['Subject'] = f"New Ethnicaa Reel Ready: {product_name}"

    body = f"Hello Rahul,\n\nYour new Instagram Reel for '{product_name}' is ready!\n\nInstructions:\n1. Download this video to your phone.\n2. Upload to Instagram Reels.\n3. Add a Trending Track inside the Instagram app for maximum reach.\n\nHappy Selling!\nEthnicaa Social Agent"
    msg.attach(MIMEText(body, 'plain'))

    # Attach Video
    filename = os.path.basename(video_path)
    try:
        with open(video_path, "rb") as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f"attachment; filename= {filename}")
            msg.attach(part)

        # Connect to Server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        print("SUCCESS: Video emailed successfully!")
        return True
    except Exception as e:
        print(f"FAILED: Email error: {e}")
        return False
