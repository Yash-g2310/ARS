# Generated by Django 5.1.1 on 2024-10-03 13:03

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("spaces", "0003_alter_group_create_date_alter_groupmember_join_date_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="space",
            name="space_token",
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
        migrations.AlterField(
            model_name="group",
            name="group_name",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="space",
            name="space_bio",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="space",
            name="space_name",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="subspace",
            name="sub_space_bio",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="subspace",
            name="sub_space_name",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="subspacemember",
            name="role",
            field=models.CharField(
                choices=[("reviewer", "Reviewer"), ("reviewee", "Reviewee")],
                default="reviewee",
                max_length=30,
            ),
        ),
        migrations.CreateModel(
            name="SpaceInvitation",
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
                ("email", models.EmailField(max_length=254)),
                (
                    "invite_token",
                    models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("expires_at", models.DateTimeField()),
                ("message_by_owner", models.TextField(blank=True, null=True)),
                (
                    "space",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="spaces.space"
                    ),
                ),
            ],
        ),
    ]
