# Generated by Django 5.0.2 on 2024-02-18 15:18

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0003_remove_appuser_score_appuser_is_vendor'),
    ]

    operations = [
        migrations.CreateModel(
            name='WebsiteUserModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fname', models.CharField(max_length=25)),
                ('lname', models.CharField(max_length=25)),
                ('score', models.IntegerField(default=0)),
                ('user_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]