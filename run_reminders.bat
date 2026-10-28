@echo off
cd /d "%~dp0cms"
python manage.py send_appointment_reminders
