# Generated by Django 5.1.5 on 2025-02-14 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_delete_featuredtestimonial'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='featured',
            field=models.BooleanField(default=False),
        ),
    ]
