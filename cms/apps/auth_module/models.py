from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('senior_doctor', 'Senior Doctor'),
        ('doctor', 'Doctor'),
        ('receptionist', 'Receptionist'),
        ('technician', 'Technician'),
        ('patient', 'Patient'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    avatar_url = models.URLField(blank=True, null=True)
    google_id = models.CharField(max_length=200, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        super().clean()

    def __str__(self):
        return f"{self.email} ({self.role})"

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=CustomUser)
def create_staff_profile(sender, instance, created, **kwargs):
    from django.contrib.auth.models import Group

    # Create associated profile if needed
    if instance.role in ['doctor', 'senior_doctor']:
        from apps.users.models import Doctor
        Doctor.objects.get_or_create(
            user=instance,
            defaults={
                'specialty': 'Cardiology' if instance.role == 'senior_doctor' else 'General Medicine',
                'registration_number': f'REG-{instance.id}',
                'accepts_inperson': True,
                'accepts_virtual': True,
                'is_visible_to_patients': True,
            }
        )
    elif instance.role == 'receptionist':
        from apps.users.models import Receptionist
        Receptionist.objects.get_or_create(user=instance)
    elif instance.role == 'technician':
        from apps.users.models import Technician
        Technician.objects.get_or_create(user=instance)
    elif instance.role == 'patient':
        from apps.users.models import Patient
        import random
        if not hasattr(instance, 'patient_profile'):
            rand_mobile = f"9{random.randint(100000000, 999999999)}"
            while Patient.objects.filter(mobile_number=rand_mobile).exists():
                rand_mobile = f"9{random.randint(100000000, 999999999)}"
            Patient.objects.get_or_create(
                user=instance,
                defaults={
                    'patient_id': f"PAT-{instance.id:04d}",
                    'full_name': instance.get_full_name() or instance.username or "Patient",
                    'date_of_birth': "1995-01-01",
                    'gender': "Other",
                    'mobile_number': rand_mobile,
                    'email': instance.email
                }
            )

    # Automatically assign the user to the correct permission Group
    role_to_group = {
        'doctor': 'Doctor',
        'senior_doctor': 'Doctor',
        'receptionist': 'Receptionist',
        'technician': 'Technician'
    }
    
    group_name = role_to_group.get(instance.role)
    if group_name:
        # Get or create the group in case it doesn't exist
        group, _ = Group.objects.get_or_create(name=group_name)
        # Clear existing groups to ensure they only have their respective permissions
        instance.groups.clear()
        instance.groups.add(group)
