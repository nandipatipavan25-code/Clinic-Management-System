import os
import django
from datetime import datetime, date, time, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from apps.auth_module.models import CustomUser
from apps.users.models import Doctor, Receptionist, Technician, Patient
from apps.appointments.models import Appointment, DoctorAvailability, Invoice
from apps.medical_records.models import Drug, ScanOrder, Prescription, PrescribedMedication, ScanResult

print("Seeding CLMS users for all roles...")

PASSWORD = "Password123!"

# 1. Senior Doctor (Admin)
senior_doctor_user, created = CustomUser.objects.get_or_create(
    username="seniordoctor",
    defaults={
        "email": "seniordoctor@clinic.com",
        "first_name": "Sarah",
        "last_name": "Connor",
        "role": "senior_doctor",
        "is_staff": True,
        "is_superuser": True,
        "is_active": True,
    }
)
senior_doctor_user.set_password(PASSWORD)
senior_doctor_user.role = "senior_doctor"
senior_doctor_user.is_staff = True
senior_doctor_user.is_superuser = True
senior_doctor_user.save()

sr_doc, _ = Doctor.objects.get_or_create(
    user=senior_doctor_user,
    defaults={
        "specialty": "Cardiology",
        "registration_number": "DOC-SR-01",
        "accepts_inperson": True,
        "accepts_virtual": True,
        "is_visible_to_patients": True,
        "average_rating": 4.9,
        "total_reviews": 15,
    }
)
print(f"[OK] Senior Doctor: {senior_doctor_user.email} (Username: {senior_doctor_user.username})")

# 2. Doctor
doctor_user, created = CustomUser.objects.get_or_create(
    username="doctor",
    defaults={
        "email": "doctor@clinic.com",
        "first_name": "John",
        "last_name": "Watson",
        "role": "doctor",
        "is_staff": True,
        "is_active": True,
    }
)
doctor_user.set_password(PASSWORD)
doctor_user.role = "doctor"
doctor_user.save()

doc, _ = Doctor.objects.get_or_create(
    user=doctor_user,
    defaults={
        "specialty": "General Medicine",
        "registration_number": "DOC-WATSON-01",
        "accepts_inperson": True,
        "accepts_virtual": True,
        "is_visible_to_patients": True,
        "average_rating": 4.8,
        "total_reviews": 10,
    }
)
print(f"[OK] Doctor: {doctor_user.email} (Username: {doctor_user.username})")

# 3. Receptionist
receptionist_user, created = CustomUser.objects.get_or_create(
    username="receptionist",
    defaults={
        "email": "receptionist@clinic.com",
        "first_name": "Emma",
        "last_name": "Stone",
        "role": "receptionist",
        "is_staff": True,
        "is_active": True,
    }
)
receptionist_user.set_password(PASSWORD)
receptionist_user.role = "receptionist"
receptionist_user.save()

Receptionist.objects.get_or_create(user=receptionist_user)
print(f"[OK] Receptionist: {receptionist_user.email} (Username: {receptionist_user.username})")

# 4. Technician
technician_user, created = CustomUser.objects.get_or_create(
    username="technician",
    defaults={
        "email": "technician@clinic.com",
        "first_name": "Alan",
        "last_name": "Turing",
        "role": "technician",
        "is_staff": True,
        "is_active": True,
    }
)
technician_user.set_password(PASSWORD)
technician_user.role = "technician"
technician_user.save()

Technician.objects.get_or_create(user=technician_user)
print(f"[OK] Technician: {technician_user.email} (Username: {technician_user.username})")

# 5. Patient
patient_user, created = CustomUser.objects.get_or_create(
    username="patient",
    defaults={
        "email": "patient@clinic.com",
        "first_name": "Alice",
        "last_name": "Smith",
        "role": "patient",
        "is_active": True,
    }
)
patient_user.set_password(PASSWORD)
patient_user.role = "patient"
patient_user.save()

patient_profile, _ = Patient.objects.get_or_create(
    user=patient_user,
    defaults={
        "patient_id": "PAT-1001",
        "full_name": "Alice Smith",
        "date_of_birth": date(1995, 5, 15),
        "gender": "Female",
        "mobile_number": "9876543210",
        "email": "patient@clinic.com",
        "blood_group": "O+",
        "known_allergies": "Penicillin",
        "chronic_conditions": "None",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500001",
    }
)
print(f"[OK] Patient: {patient_user.email} (Username: {patient_user.username})")

# Second Patient for multi-patient testing
patient_user2, _ = CustomUser.objects.get_or_create(
    username="bobpatient",
    defaults={
        "email": "bob@example.com",
        "first_name": "Bob",
        "last_name": "Marley",
        "role": "patient",
        "is_active": True,
    }
)
patient_user2.set_password(PASSWORD)
patient_user2.save()

patient_profile2, _ = Patient.objects.get_or_create(
    user=patient_user2,
    defaults={
        "patient_id": "PAT-1002",
        "full_name": "Bob Marley",
        "date_of_birth": date(1988, 8, 20),
        "gender": "Male",
        "mobile_number": "9876543211",
        "email": "bob@example.com",
        "blood_group": "B+",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560001",
    }
)

# 6. Doctor Availabilities (Monday through Saturday)
for d in [sr_doc, doc]:
    for day in range(6): # Mon to Sat
        DoctorAvailability.objects.get_or_create(
            doctor=d,
            day_of_week=day,
            appointment_type="in_person",
            defaults={
                "start_time": time(9, 0),
                "end_time": time(17, 0),
                "slot_duration": 20,
            }
        )
        DoctorAvailability.objects.get_or_create(
            doctor=d,
            day_of_week=day,
            appointment_type="virtual",
            defaults={
                "start_time": time(17, 30),
                "end_time": time(19, 30),
                "slot_duration": 20,
            }
        )
print("[OK] Doctor availabilities configured")

# 7. Sample Appointments & Queue
today = date.today()

# Checked-in appointment (Active in Queue)
app1, _ = Appointment.objects.get_or_create(
    patient=patient_profile,
    doctor=doc,
    date=today,
    time=time(10, 0),
    defaults={
        "appointment_type": "in_person",
        "status": "checked_in",
        "queue_token": "Q-001",
        "queue_type": "scheduled",
        "priority": 3,
        "check_in_time": timezone.now() - timedelta(minutes=15),
        "amount_paid": 500.00,
    }
)

# In-progress appointment (Active in Queue)
app2, _ = Appointment.objects.get_or_create(
    patient=patient_profile2,
    doctor=sr_doc,
    date=today,
    time=time(10, 30),
    defaults={
        "appointment_type": "in_person",
        "status": "in_progress",
        "queue_token": "Q-002",
        "queue_type": "scheduled",
        "priority": 2,
        "check_in_time": timezone.now() - timedelta(minutes=30),
        "amount_paid": 800.00,
    }
)

# Future confirmed appointment
app3, _ = Appointment.objects.get_or_create(
    patient=patient_profile,
    doctor=sr_doc,
    date=today + timedelta(days=1),
    time=time(11, 0),
    defaults={
        "appointment_type": "virtual",
        "status": "confirmed",
        "meeting_link": "https://meet.google.com/xyz-test-clms",
        "amount_paid": 800.00,
    }
)
print("[OK] Sample appointments & queue records created")

# 8. Invoices
Invoice.objects.get_or_create(
    invoice_id="INV-001",
    defaults={
        "appointment": app1,
        "patient": patient_profile,
        "doctor": doc,
        "consultation_fee": 500.00,
        "tax": 90.00,
        "total_amount": 590.00,
        "payment_status": "PAID",
        "payment_mode": "Cash",
        "transaction_id": "TXN10001",
    }
)
Invoice.objects.get_or_create(
    invoice_id="INV-002",
    defaults={
        "appointment": app2,
        "patient": patient_profile2,
        "doctor": sr_doc,
        "consultation_fee": 800.00,
        "tax": 144.00,
        "total_amount": 944.00,
        "payment_status": "PENDING",
    }
)
print("[OK] Sample invoices created")

# 9. Scan Orders for Technician
ScanOrder.objects.get_or_create(
    patient=patient_profile,
    doctor=doc,
    scan_type="Chest X-Ray",
    defaults={
        "status": "pending",
        "notes": "Patient reporting persistent dry cough for 2 weeks",
    }
)
ScanOrder.objects.get_or_create(
    patient=patient_profile2,
    doctor=sr_doc,
    scan_type="Brain MRI",
    defaults={
        "status": "in_progress",
        "notes": "Check for frontal lobe symptoms",
    }
)
print("[OK] Sample scan orders for technician created")

# 10. Sample Drugs & Prescription
paracetamol, _ = Drug.objects.get_or_create(
    name="Paracetamol 500mg",
    defaults={
        "generic_name": "Acetaminophen",
        "description": "Analgesic and antipyretic",
        "dosage_form": "Tablet",
        "manufacturer": "GSK",
    }
)
amoxicillin, _ = Drug.objects.get_or_create(
    name="Amoxicillin 250mg",
    defaults={
        "generic_name": "Amoxicillin",
        "description": "Broad-spectrum antibiotic",
        "dosage_form": "Capsule",
        "manufacturer": "Cipla",
    }
)

presc, _ = Prescription.objects.get_or_create(
    appointment=app1,
    defaults={
        "patient": patient_profile,
        "doctor": doc,
        "notes": "Take after food. Drink plenty of water.",
        "follow_up_date": today + timedelta(days=7),
    }
)
PrescribedMedication.objects.get_or_create(
    prescription=presc,
    drug=paracetamol,
    defaults={
        "dosage": "500mg",
        "frequency": "Three times a day",
        "duration": "5 days",
        "instructions": "After food",
    }
)
PrescribedMedication.objects.get_or_create(
    prescription=presc,
    drug=amoxicillin,
    defaults={
        "dosage": "250mg",
        "frequency": "Twice a day",
        "duration": "7 days",
        "instructions": "Complete full course",
    }
)
print("[OK] Prescriptions and medications created")
print("\nAll roles and data seeded successfully!")
