# Generated by Django 5.1.1 on 2024-09-28 07:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "submissions",
            "0002_assignmentsubmission_subtaskstatus_subtasksubmission_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="assignmentsubmission",
            name="submitted_at",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
