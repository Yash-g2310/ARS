# Generated by Django 5.1.1 on 2024-09-28 07:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("assignments", "0002_remove_assignmentteam_submission_count_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="assignment",
            name="updated_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
