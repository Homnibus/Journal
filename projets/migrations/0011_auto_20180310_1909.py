# Generated by Django 2.0 on 2018-03-10 18:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("projets", "0010_auto_20180220_2159")]

    operations = [
        migrations.AlterField(
            model_name="projet",
            name="titre",
            field=models.CharField(blank=True, max_length=80),
        )
    ]
