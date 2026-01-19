// ===== Open or Create Database =====
const dbRequest = indexedDB.open("VitalCareDB", 1);

dbRequest.onupgradeneeded = function(event) {
  const db = event.target.result;

  // Create Appointments Store
  if (!db.objectStoreNames.contains("appointments")) {
    db.createObjectStore("appointments", { keyPath: "id", autoIncrement: true });
  }

  // Create Patients Store
  if (!db.objectStoreNames.contains("patients")) {
    db.createObjectStore("patients", { keyPath: "id", autoIncrement: true });
  }
};

dbRequest.onsuccess = function(event) {
  const db = event.target.result;

  // ===== Initialize Default 10 Patients if Empty =====
  const txCheck = db.transaction("patients", "readonly");
  const storeCheck = txCheck.objectStore("patients");
  storeCheck.getAll().onsuccess = function(e) {
    const patients = e.target.result;
    if (patients.length === 0) {
      const defaultPatients = [
        { name: "John Doe", email: "john@example.com", phone: "1234567890", datetime: "2025-11-01 09:00", nhs: "NHS001", doctor: "Dr. Violante Rilton - Cardiologist" },
        { name: "Jane Smith", email: "jane@example.com", phone: "2345678901", datetime: "2025-11-02 10:00", nhs: "NHS002", doctor: "Dr. Erwin Handlin - Cardiologist" },
        { name: "Robert Brown", email: "robert@example.com", phone: "3456789012", datetime: "2025-11-03 11:00", nhs: "NHS003", doctor: "Dr. Rowland Blount - Cardiologist" },
        { name: "Emily Davis", email: "emily@example.com", phone: "4567890123", datetime: "2025-11-04 12:00", nhs: "NHS004", doctor: "Dr. Ettie Beardswerth - Neurology" },
        { name: "Michael Wilson", email: "michael@example.com", phone: "5678901234", datetime: "2025-11-05 13:00", nhs: "NHS005", doctor: "Dr. Monah Caghy - Neurology" },
        { name: "Sarah Johnson", email: "sarah@example.com", phone: "6789012345", datetime: "2025-11-06 14:00", nhs: "NHS006", doctor: "Dr. Si Pawling - Neurology" },
        { name: "David Lee", email: "david@example.com", phone: "7890123456", datetime: "2025-11-07 15:00", nhs: "NHS007", doctor: "Dr. Emera Mcquillan - Orthopedics" },
        { name: "Laura Clark", email: "laura@example.com", phone: "8901234567", datetime: "2025-11-08 16:00", nhs: "NHS008", doctor: "Dr. Rad Philipad - Orthopedics" },
        { name: "James Lewis", email: "james@example.com", phone: "9012345678", datetime: "2025-11-09 17:00", nhs: "NHS009", doctor: "Dr. Merrily Harmson - Orthopedics" },
        { name: "Olivia Walker", email: "olivia@example.com", phone: "0123456789", datetime: "2025-11-10 18:00", nhs: "NHS010", doctor: "Dr. Zoe Galloway - Pediatrician" }
      ];

      const txAdd = db.transaction("patients", "readwrite");
      const storeAdd = txAdd.objectStore("patients");
      defaultPatients.forEach(p => storeAdd.add(p));
      txAdd.oncomplete = () => displayPatients();
    } else {
      displayPatients();
    }
  };

  // ===== Display Patients in Admin =====
  function displayPatients() {
    const tbody = document.querySelector("#patientTable tbody");
    if (!tbody) return;

    const tx = db.transaction("patients", "readonly");
    const store = tx.objectStore("patients");
    store.getAll().onsuccess = function(e) {
      const patients = e.target.result;
      tbody.innerHTML = "";
      patients.forEach(patient => {
       const row = document.createElement("tr");
		row.innerHTML = `
			<td class="row-cell">${patient.name}</td>
			<td class="row-cell">${patient.email}</td>
			<td class="row-cell">${patient.phone}</td>
			<td class="row-cell">${patient.datetime}</td>
			<td class="row-cell">${patient.nhs}</td>
			<td class="row-cell">${patient.doctor}</td>
			<td class="row-cell">
			  <button class="action-btn edit-btn" onclick="editPatient(${patient.id})">Edit</button>
			  <button class="action-btn delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
			</td>
  `;
  tbody.appendChild(row);
});

    };
  }

  // ===== Admin Add/Edit Patient =====
  const patientForm = document.getElementById("patientForm");
  let editId = null;

  if (patientForm) {
    patientForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const datetime = document.getElementById("DateTime").value.trim().replace("T", " ");
      const doctor = document.getElementById("doctor").value.trim();
      const nhs = document.getElementById("nhs").value.trim();

      if (!name || !email || !phone || !datetime || !doctor || !nhs) {
        alert("Please fill all fields!");
        return;
      }

      const tx = db.transaction("patients", "readwrite");
      const store = tx.objectStore("patients");

      if (editId) {
        store.put({ id: editId, name, email, phone, datetime, doctor, nhs });
      } else {
        store.add({ name, email, phone, datetime, doctor, nhs });
      }

      tx.oncomplete = function() {
        alert(editId ? "Patient updated!" : "Patient added!");
        patientForm.reset();
        editId = null;
        patientForm.querySelector("button[type='submit']").textContent = "Add Patient";
        displayPatients();
      };
    });
  }

  // ===== Edit & Delete Functions =====
  window.editPatient = function(id) {
    const tx = db.transaction("patients", "readonly");
    const store = tx.objectStore("patients");
    store.get(id).onsuccess = function(e) {
      const p = e.target.result;
      if (p) {
        document.getElementById("name").value = p.name;
        document.getElementById("email").value = p.email;
        document.getElementById("phone").value = p.phone;
        document.getElementById("DateTime").value = p.datetime.replace(" ", "T");
        document.getElementById("doctor").value = p.doctor;
        document.getElementById("nhs").value = p.nhs;
        editId = p.id;
        patientForm.querySelector("button[type='submit']").textContent = "Update Patient";
      }
    };
  };

  window.deletePatient = function(id) {
    const tx = db.transaction("patients", "readwrite");
    const store = tx.objectStore("patients");
    store.delete(id);
    tx.oncomplete = () => displayPatients();
  };

  // ===== Patient Appointment Booking =====
  const appointmentForm = document.getElementById("appointmentForm");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const first = document.getElementById("first").value.trim();
      const last = document.getElementById("last").value.trim();
      const number = document.getElementById("number").value.trim();
      const email = document.getElementById("email").value.trim();
      const time = document.getElementById("time").value;
      const doctor = document.getElementById("doctor").value;
      const date = document.getElementById("date").value;

      if (!first || !last || !number || !email || !time || !doctor || !date) {
        alert("Please fill all fields!");
        return;
      }

      // Save in Appointments
      const txAppt = db.transaction("appointments", "readwrite");
      txAppt.objectStore("appointments").add({ first, last, number, email, time, doctor, date });

      // Save also in Patients
      const txPatient = db.transaction("patients", "readwrite");
      const fullName = `${first} ${last}`;
      txPatient.objectStore("patients").add({
        name: fullName,
        email,
        phone: number,
        datetime: `${date} ${time}`,
        doctor,
        nhs: "N/A"
      });

      txAppt.oncomplete = function() {
        alert("Appointment booked successfully!");
        appointmentForm.reset();
      };
    });
  }
};
