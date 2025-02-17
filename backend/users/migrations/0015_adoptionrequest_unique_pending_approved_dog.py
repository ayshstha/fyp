# Generated by Django 5.1.5 on 2025-02-16 04:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_remove_adoption_is_available_adoptionrequest'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='adoptionrequest',
            constraint=models.UniqueConstraint(condition=models.Q(('status__in', ['pending', 'approved'])), fields=('dog',), name='unique_pending_approved_dog'),
        ),
    ]
