# Generated by Django 4.1 on 2024-02-26 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0003_vendormodel_bags_left'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionmodel',
            name='question',
            field=models.CharField(max_length=128),
        ),
    ]