from django.utils import timezone
from datetime import timedelta
from .models import ClaimModel, UserModel, BagModel

# We will be running this with django-cron, only available in linux

def check_claims():
    # Get the threshold time
    threshold_time = timezone.now() - timedelta(hours=2)

    # Get the claims that are older than 2 hours and have not been successful
    old_claims = ClaimModel.objects.filter(time__lt=threshold_time, success=False)

    # For each of these claims
    for claim in old_claims:
        # Decrease the related user's score by 10
        user = UserModel.objects.get(id=claim.user.id)
        user.score -= 10
        user.save()

        # Set the related bag's claimed field to false
        bag = BagModel.objects.get(id=claim.bag.id)
        bag.claimed = False
        bag.save()

        # Delete the claim
        claim.delete()
