# Generated by Django 5.1.5 on 2025-02-25 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0030_rescuerequest_rescueimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rescuerequest',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('rescued', 'Rescued'), ('declined', 'Declined')], default='pending', max_length=20),
        ),
    ]
