# Generated by Django 2.0 on 2018-01-30 19:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("projets", "0005_auto_20180102_2233")]

    operations = [
        migrations.CreateModel(
            name="TODO_Entree",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("texte", models.TextField(blank=True)),
                ("realisee", models.BooleanField(default=False)),
                (
                    "date_creation",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="Date de creation"
                    ),
                ),
                (
                    "date_update",
                    models.DateTimeField(
                        auto_now=True, verbose_name="Date de mise a jour"
                    ),
                ),
                (
                    "date_realisee",
                    models.DateTimeField(verbose_name="Date de realisation"),
                ),
                (
                    "projet",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="projets.Projet"
                    ),
                ),
            ],
        )
    ]
