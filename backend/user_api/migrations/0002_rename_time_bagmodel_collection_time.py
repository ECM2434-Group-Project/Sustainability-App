# Generated by Django 4.1 on 2024-02-26 16:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bagmodel',
            old_name='time',
            new_name='collection_time',
        ),
    ]
