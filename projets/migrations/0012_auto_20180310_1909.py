# Generated by Django 2.0 on 2018-03-10 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("projets", "0011_auto_20180310_1909")]

    operations = [
        migrations.AlterField(
            model_name="projet", name="titre", field=models.CharField(max_length=80)
        )
    ]
