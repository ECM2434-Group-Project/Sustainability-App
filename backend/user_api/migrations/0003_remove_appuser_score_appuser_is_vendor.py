# Generated by Django 5.0.2 on 2024-02-18 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0002_bagmodel_questionmodel_vendormodel_appuser_score_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appuser',
            name='score',
        ),
        migrations.AddField(
            model_name='appuser',
            name='is_vendor',
            field=models.BooleanField(default=False),
        ),
    ]