# Generated by Django 5.1.1 on 2024-09-28 13:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0004_alter_userprofile_enrollment_no"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="enrollment_no",
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="phone_number",
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="user_bio",
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
