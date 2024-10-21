from django.urls import reverse
from django.conf import settings
from django.core.mail import send_mail
from urllib.parse import urljoin

def _get_invite_url(invitation):
    invite_url = reverse('accept_invite',kwargs={'invite_token':invitation.invite_token})
    return urljoin(settings.FRONTEND_BASE_URL + '/', invite_url)

def send_invite_email(invitation):
    invite_url = _get_invite_url(invitation)
    owner_name = invitation.space.owner.first_name + ' '+invitation.space.owner.last_name
    subject = 'You are invited to join a space !'
    body = f"Hi,\n\nYou have been invited to join a space by {owner_name}. The invitation link is given below\n{invite_url}\n\nPlease click the link above to accept the invite ( you have to login/register first ! ).\nThe invitation link is valid till {invitation.expires_at}. Make sure to join before the link expires\n"
    
    if invitation.message_by_owner is not None:
        body += f"Here is a message from {owner_name},\n{invitation.message_by_owner}\n"
        
    send_mail(
        subject,
        body,
        settings.DEFAULT_FROM_EMAIL,
        [invitation.email],
        fail_silently=False,
    )
    