# Generated by Django 5.1.5 on 2025-02-15 07:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_adoption_is_available_adoptionrequest'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AdoptionRequest',
        ),
    ]
