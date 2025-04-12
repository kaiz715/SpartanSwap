import smtplib, ssl
from environment import sender_email, password

port = 587
smtp_server = "smtp.gmail.com"

def send_email(receiver_email, subject, message):
    """Function to send an email using Gmail's SMTP server"""
    email_message = f"Subject: {subject}\n\n{message}"
    
    # Connect to the server
    context = ssl.create_default_context()
    try:
        server = smtplib.SMTP(smtp_server,port=port)
        server.starttls(context=context) # Secure the connection
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, email_message)
    except Exception as e:
        print(e)
    finally:
        server.quit() 
    
# Example usage
# send_email("kaizheng31@gmail.com", "Test Subject", "This is a test message.")