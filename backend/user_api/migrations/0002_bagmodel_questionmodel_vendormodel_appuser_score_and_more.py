# Generated by Django 5.0.2 on 2024-02-16 13:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BagModel',
            fields=[
                ('bag_id', models.AutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='QuestionModel',
            fields=[
                ('question_id', models.AutoField(primary_key=True, serialize=False)),
                ('question', models.CharField(max_length=25)),
                ('answer', models.CharField(max_length=25)),
            ],
        ),
        migrations.CreateModel(
            name='VendorModel',
            fields=[
                ('vendor_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=25)),
                ('num_bags', models.IntegerField()),
                ('location', models.CharField(max_length=25)),
            ],
        ),
        migrations.AddField(
            model_name='appuser',
            name='score',
            field=models.IntegerField(default=0),
        ),
        migrations.CreateModel(
            name='ClaimModel',
            fields=[
                ('claim_id', models.AutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField()),
                ('success', models.BooleanField(default=False)),
                ('bag_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_api.bagmodel')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='bagmodel',
            name='vendor_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_api.vendormodel'),
        ),
    ]
