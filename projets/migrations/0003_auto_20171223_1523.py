# Generated by Django 2.0 on 2017-12-23 14:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("projets", "0002_auto_20171216_2304")]

    operations = [
        migrations.CreateModel(
            name="Journal_Entree",
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
            ],
        ),
        migrations.AlterField(
            model_name="projet", name="slug", field=models.SlugField()
        ),
        migrations.AlterField(
            model_name="projet",
            name="titre",
            field=models.CharField(max_length=80, unique=True),
        ),
        migrations.AddField(
            model_name="journal_entree",
            name="projet",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to="projets.Projet"
            ),
        ),
    ]
