# Generated by Django 5.1.5 on 2025-03-01 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0033_remove_adoptionrequest_adoption_reason'),
    ]

    operations = [
        migrations.AddField(
            model_name='adoptionrequest',
            name='adoption_reason',
            field=models.TextField(blank=True, null=True),
        ),
    ]
