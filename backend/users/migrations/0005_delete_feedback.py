# Generated by Django 5.1.5 on 2025-02-13 14:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_feedback'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Feedback',
        ),
    ]
