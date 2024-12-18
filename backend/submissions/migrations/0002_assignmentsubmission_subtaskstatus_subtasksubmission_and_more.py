# Generated by Django 5.1.1 on 2024-09-25 16:58

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("assignments", "0002_remove_assignmentteam_submission_count_and_more"),
        ("submissions", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="AssignmentSubmission",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "submitted_at",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                ("reviewed_at", models.DateTimeField(blank=True, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("completed", "Completed"),
                            ("in_progress", "In Progress"),
                            ("not_started", "Not Started"),
                            ("reviewed", "Reviewed"),
                        ],
                        default="not_started",
                        max_length=25,
                    ),
                ),
                ("reviewee_comment", models.TextField(blank=True, null=True)),
                ("reviewer_comment", models.TextField(blank=True, null=True)),
                (
                    "assignment_reviewee",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="assignments.assignmentreviewee",
                    ),
                ),
                (
                    "assignment_reviewer",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="assignments.assignmentreviewer",
                    ),
                ),
                (
                    "assignment_team",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="assignments.assignmentteam",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SubtaskStatus",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("completed", "Completed"), ("pending", "Pending")],
                        max_length=20,
                    ),
                ),
                (
                    "assignment_reviewee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="assignments.assignmentreviewee",
                    ),
                ),
                (
                    "assignment_subtask",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="assignments.assignmentsubtask",
                    ),
                ),
            ],
            options={
                "unique_together": {("assignment_reviewee", "assignment_subtask")},
            },
        ),
        migrations.CreateModel(
            name="SubtaskSubmission",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("reviewee_comment", models.TextField(blank=True, null=True)),
                (
                    "assignment_submission",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="submissions.assignmentsubmission",
                    ),
                ),
                (
                    "assignment_subtask",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="assignments.assignmentsubtask",
                    ),
                ),
            ],
            options={
                "unique_together": {("assignment_submission", "assignment_subtask")},
            },
        ),
        migrations.DeleteModel(
            name="AssignemntSubmission",
        ),
    ]
