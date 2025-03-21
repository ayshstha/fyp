# Generated by Django 5.1.5 on 2025-03-15 06:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0034_adoptionrequest_adoption_reason'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('checkup_type', models.CharField(max_length=100)),
                ('pet_name', models.CharField(max_length=100)),
                ('pet_breed', models.CharField(max_length=100)),
                ('pet_age', models.IntegerField()),
                ('pet_weight', models.FloatField()),
                ('medical_history', models.TextField(blank=True)),
                ('current_medications', models.TextField(blank=True)),
                ('allergies', models.TextField(blank=True)),
                ('special_notes', models.TextField(blank=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('completed', 'Completed')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
