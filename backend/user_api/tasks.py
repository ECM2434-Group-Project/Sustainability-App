from django.utils import timezone
from datetime import timedelta
from .models import ClaimModel, UserModel, BagModel, VendorModel, BagGroupModel


# We will be running this with django-cron, only available in linux
def check_claims():
    # Get the threshold time
    threshold_time = timezone.now() - timedelta(hours=2)

    # Get the claims that are older than 2 hours and have not been successful
    old_claims = ClaimModel.objects.filter(time__lt=threshold_time, success=False)

    for claim in old_claims:
        user = UserModel.objects.get(id=claim.user.id)
        user.score -= 10
        user.save()

        # Set the related bag's claimed field to false
        bag = BagModel.objects.get(id=claim.bag.id)
        bag.claimed = False
        bag.save()

        # Delete the claim
        claim.delete()


# Remove every bag that has field claimed set to false at 6pm
def closing_time():
    unclaimed_bags = BagModel.objects.filter(claimed=False)
    for bag in unclaimed_bags:
        bag.delete()

    # Set vendors bagLeft to 0
    vendors = VendorModel.objects.all()
    for vendor in vendors:
        vendor.bags_left = 0
        vendor.save()

    # Delete every bagGroup that has no bags left
    bagGroups = BagGroupModel.objects.all()
    for bagGroup in bagGroups:
        if bagGroup.bags_unclaimed == 0:
            bagGroup.delete()
        else:
            bagGroup.bags_unclaimed = 0
            bagGroup.save()