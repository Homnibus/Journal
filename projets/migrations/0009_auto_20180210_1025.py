# Generated by Django 2.0 on 2018-02-10 09:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("projets", "0008_auto_20180210_1020")]

    operations = [
        migrations.AlterField(
            model_name="todo_entree",
            name="date_creation",
            field=models.DateTimeField(editable=False, verbose_name="Date de creation"),
        )
    ]
