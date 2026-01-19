# VitalCare Web Application

VitalCare is a web-based application designed to manage patient, doctor, and admin information securely. It provides functionalities for appointments, medical notes, prescriptions, and database management.

---

## Features

### Basic Designs
- Front page designs for all users.
- Database E/R diagram created for database structure.

### IndexedDB Integration
- IndexedDB database created and managed with JSON data from the server.
- **CRUD Operations**:
  - Add records ✅
  - Delete records ✅
  - Update records ✅

### Account Types & Permissions
- **Patient**: Access to personal info, appointments, prescriptions.
- **Doctor**: Review and update patient history, medical notes, prescriptions.
- **Admin**: Full management of patient info and account access.

### Admin Functionality
- Add patient details: Name, address, telephone, DOB, NHS number.
- Update or delete patient records.

### Patient Functionality
- Book appointments and request prescriptions.
- View stored personal info and medical notes.

### Doctor Functionality
- Review patient history and medical notes.
- Add to patient history, medical notes, and prescriptions.

### Validation & Basic Security
- Password-protected accounts.
- Input validation and sanitization (password, email, etc.).
- Passwords meet applied security standards.

### Security (Encryption)
- Encryption applied to passwords and sensitive data.
- Decryption and secure usage of stored data.

### Advanced Features
- JSON data collected from server and processed.
- AES-256 or better encryption for sensitive information.

---

## Installation
1. Clone the repository:  
   ```bash
   git clone <repo-url>
