# Generated by Django 2.0 on 2018-01-30 21:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projets', '0006_todo_entree'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo_entree',
            name='date_realisee',
            field=models.DateTimeField(null=True, verbose_name='Date de realisation'),
        ),
    ]
