# Generated by Django 5.1.1 on 2024-09-25 16:58

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="user_bio",
            field=models.CharField(max_length=250),
        ),
    ]
