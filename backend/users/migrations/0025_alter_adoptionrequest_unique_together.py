# Generated by Django 5.1.5 on 2025-02-17 18:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0024_adoption_is_booked_adoptionrequest'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='adoptionrequest',
            unique_together=set(),
        ),
    ]
