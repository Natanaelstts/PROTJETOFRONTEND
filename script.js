let currentActiveUser = null; // Variável para o usuário logado

// Dados de pacientes de exemplo
let registeredPatients = [
    {
        id: 101, fullName: "Carolina Alves Pereira", cpf: "111.222.333-44", contactPhone: "(11) 98765-4321",
        contactEmail: "carolina.alves@email.com", birthDate: "1980-11-22", genderIdentity: "F",
        residentialAddress: "Rua das Palmeiras, 300", cityLocation: "São Paulo", lastVisit: "20/04/2024"
    },
    {
        id: 102, fullName: "Roberto Lima Costa", cpf: "555.666.777-88", contactPhone: "(11) 97777-8888",
        contactEmail: "roberto.lima@email.com", birthDate: "1995-03-10", genderIdentity: "M",
        residentialAddress: "Avenida Central, 750", cityLocation: "Guarulhos", lastVisit: "18/04/2024"
    },
    {
        id: 103, fullName: "Fernanda Santos Rocha", cpf: "999.888.777-66", contactPhone: "(11) 96666-5555",
        contactEmail: "fernanda.rocha@email.com", birthDate: "1988-07-01", genderIdentity: "F",
        residentialAddress: "Travessa da Esperança, 50", cityLocation: "Campinas", lastVisit: "15/04/2024"
    }
];

// Dados de agendamentos de exemplo
let registeredAppointments = [
    {
        id: 201, patientId: 101, patientName: "Carolina Alves Pereira", date: "2025-07-20", time: "10:00",
        reason: "Consulta de rotina", professional: "Dr. Ana Paula", type: "Presencial"
    },
    {
        id: 202, patientId: 102, patientName: "Roberto Lima Costa", date: "2025-07-21", time: "14:30",
        reason: "Retorno pós-cirúrgico", professional: "Dr. Carlos Mendes", type: "Presencial"
    }
];

// Dados de prontuários de exemplo
let medicalRecords = [
    {
        id: 301, patientId: 101, patientName: "Carolina Alves Pereira", date: "2025-04-20", reason: "Check-up anual",
        professional: "Dr. Ana Paula", notes: "Paciente em bom estado geral. Exames de rotina solicitados.", prescription: ""
    },
    {
        id: 302, patientId: 103, patientName: "Fernanda Santos Rocha", date: "2025-04-15", reason: "Dor de cabeça persistente",
        professional: "Enf. Ricardo Silva", notes: "Paciente com cefaleia tensional. Orientado repouso.", prescription: "Analgésico comum."
    }
];


// Funções para gerenciamento de visualizações (telas)
function displayView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

function showControlPanel() {
    displayView('controlPanel');
}

function showPatientRegistrationForm() {
    document.querySelector('.patient-registration-form').reset();
    displayView('patientRegistrationSection');
}

function showPatientOverviewList() {
    renderPatientDataTable();
    displayView('patientOverviewSection');
}

// NOVA FUNÇÃO: Mostrar tela de Programar Novo Agendamento
function showNewAppointmentForm() {
    document.querySelector('.appointment-form').reset();
    populatePatientSelect('appointmentPatient');
    displayView('newAppointmentSection');
}

// NOVA FUNÇÃO: Mostrar tela de Gerenciar Prontuários
function showMedicalRecordsList() {
    document.getElementById('newMedicalRecordForm').style.display = 'none';
    renderMedicalRecordsTable();
    displayView('medicalRecordsSection');
}

// NOVA FUNÇÃO: Mostrar formulário de Novo Prontuário dentro da tela de prontuários
function showNewMedicalRecordForm() {
    document.querySelector('.medical-record-form').reset();
    populatePatientSelect('recordPatient');
    document.getElementById('newMedicalRecordForm').style.display = 'block';
    document.getElementById('newMedicalRecordForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// NOVA FUNÇÃO: Esconder formulário de Novo Prontuário
function hideNewMedicalRecordForm() {
    document.getElementById('newMedicalRecordForm').style.display = 'none';
}


function performLogout() {
    currentActiveUser = null;
    displayView('accessSection');
    document.querySelector('.access-form').reset();
    document.getElementById('displayName').textContent = "Dr(a). [Nome do Usuário]";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidNumber(input) {
    return /^\d+$/.test(input);
}

// Função de login simplificada
function handleAuthSubmission(event) {
    event.preventDefault();
    const loginFormData = new FormData(event.target);
    const profileRole = loginFormData.get('profileRole');
    const userEmail = loginFormData.get('userEmail');
    const userNumber = loginFormData.get('userPasskey');

    if (!userEmail || !userNumber) {
        displayToast('Por favor, preencha o e-mail e a numeração.', 'error');
        return;
    }

    if (!isValidEmail(userEmail)) {
        displayToast('Por favor, insira um endereço de e-mail válido.', 'error');
        return;
    }

    if (!isValidNumber(userNumber)) {
        displayToast('A "numeração" deve conter apenas dígitos.', 'error');
        return;
    }

    currentActiveUser = {
        email: userEmail,
        role: profileRole,
        name: retrieveUserName(profileRole, userEmail)
    };
    document.getElementById('displayName').textContent = currentActiveUser.name;
    displayToast('Acesso realizado com sucesso à plataforma!', 'success');
    showControlPanel();
}

function retrieveUserName(userRole, userEmail) {
    if (userRole === 'admin') {
        return 'Supervisor(a) Geral';
    } else if (userRole === 'physician') {
        const namePart = userEmail.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
        return `Dr(a). ${namePart}`;
    } else if (userRole === 'nurse') {
        const namePart = userEmail.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
        return `Enf. ${namePart}`;
    }
    return 'Usuário do SGIS';
}

function handleForgotPassword() {
    displayToast('Funcionalidade de recuperação de chave de acesso será implementada futuramente.', 'info');
}

// NOVA FUNÇÃO: Lógica para processar novo agendamento
function processNewAppointment(event) {
    event.preventDefault();
    const appointmentFormData = new FormData(event.target);

    const patientId = appointmentFormData.get('appointmentPatient');
    const date = appointmentFormData.get('appointmentDate');
    const time = appointmentFormData.get('appointmentTime');
    const reason = appointmentFormData.get('appointmentReason');
    const professional = appointmentFormData.get('appointmentProfessional');
    const type = appointmentFormData.get('appointmentType');

    if (!patientId || !date || !time || !reason || !professional || !type) {
        displayToast('Por favor, preencha todos os campos do agendamento.', 'error');
        return;
    }

    const patientName = registeredPatients.find(p => p.id === parseInt(patientId)).fullName;

    const newAppointment = {
        id: registeredAppointments.length > 0 ? Math.max(...registeredAppointments.map(a => a.id)) + 1 : 201,
        patientId: parseInt(patientId),
        patientName: patientName,
        date: date,
        time: time,
        reason: reason,
        professional: professional,
        type: type
    };

    registeredAppointments.push(newAppointment);
    displayToast('Agendamento registrado com sucesso!', 'success');
    showControlPanel();
}

// NOVA FUNÇÃO: Lógica para processar novo prontuário
function processNewMedicalRecord(event) {
    event.preventDefault();
    const recordFormData = new FormData(event.target);

    const patientId = recordFormData.get('recordPatient');
    const date = recordFormData.get('recordDate');
    const reason = recordFormData.get('recordReason');
    const notes = recordFormData.get('recordNotes');
    const prescription = recordFormData.get('recordPrescription');

    if (!patientId || !date || !reason || !notes) {
        displayToast('Por favor, preencha os campos obrigatórios do prontuário.', 'error');
        return;
    }

    const patientName = registeredPatients.find(p => p.id === parseInt(patientId)).fullName;
    const professionalName = currentActiveUser ? retrieveUserName(currentActiveUser.role, currentActiveUser.email) : "Profissional Desconhecido";

    const newRecord = {
        id: medicalRecords.length > 0 ? Math.max(...medicalRecords.map(r => r.id)) + 1 : 301,
        patientId: parseInt(patientId),
        patientName: patientName,
        date: date,
        reason: reason,
        professional: professionalName,
        notes: notes,
        prescription: prescription
    };

    medicalRecords.push(newRecord);
    displayToast('Prontuário salvo com sucesso!', 'success');
    hideNewMedicalRecordForm();
    renderMedicalRecordsTable();
}


// Função para popular selects de paciente
function populatePatientSelect(selectId) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">Selecione um Paciente</option>';
    registeredPatients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.fullName} (CPF: ${patient.cpf})`;
        selectElement.appendChild(option);
    });
}

// Função para renderizar a tabela de pacientes
function renderPatientDataTable() {
    const tableBody = document.getElementById('patientRecordsBody');
    tableBody.innerHTML = "";

    registeredPatients.forEach(patient => {
        const patientAge = calculatePatientAge(patient.birthDate);
        const tableRow = `
            <tr>
                <td>${patient.fullName}</td>
                <td>${patient.cpf}</td>
                <td>${patient.contactPhone}</td>
                <td>${patientAge}</td>
                <td>${patient.lastVisit}</td>
                <td>
                    <button class="action-quick-btn" title="Visualizar Detalhes" onclick="viewPatientDetails(${patient.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-quick-btn" title="Modificar Registro" onclick="editPatientRecord(${patient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += tableRow;
    });
}

// NOVA FUNÇÃO: Renderizar a tabela de prontuários
function renderMedicalRecordsTable() {
    const tableBody = document.getElementById('medicalRecordsBody');
    tableBody.innerHTML = "";

    medicalRecords.forEach(record => {
        const tableRow = `
            <tr>
                <td>${record.id}</td>
                <td>${record.patientName}</td>
                <td>${record.date}</td>
                <td>${record.reason}</td>
                <td>${record.professional}</td>
                <td>
                    <button class="action-quick-btn" title="Visualizar Detalhes" onclick="viewMedicalRecordDetails(${record.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += tableRow;
    });
}

// NOVA FUNÇÃO: Visualizar detalhes do prontuário
function viewMedicalRecordDetails(recordId) {
    const selectedRecord = medicalRecords.find(r => r.id === recordId);
    if (selectedRecord) {
        alert(
            `Detalhes do Prontuário ${selectedRecord.id}\n` +
            `Paciente: ${selectedRecord.patientName}\n` +
            `Data: ${selectedRecord.date}\n` +
            `Motivo: ${selectedRecord.reason}\n` +
            `Profissional: ${selectedRecord.professional}\n` +
            `Notas: ${selectedRecord.notes}\n` +
            `Prescrição: ${selectedRecord.prescription || 'N/A'}`
        );
    }
}

// NOVA FUNÇÃO: Filtrar prontuários
function filterMedicalRecords(searchKey) {
    const lowerCaseSearchKey = searchKey.toLowerCase();
    const filteredRecords = medicalRecords.filter(record =>
        record.patientName.toLowerCase().includes(lowerCaseSearchKey) ||
        record.date.includes(searchKey) ||
        record.reason.toLowerCase().includes(lowerCaseSearchKey)
    );

    const tableBody = document.getElementById('medicalRecordsBody');
    tableBody.innerHTML = "";

    filteredRecords.forEach(record => {
        const tableRow = `
            <tr>
                <td>${record.id}</td>
                <td>${record.patientName}</td>
                <td>${record.date}</td>
                <td>${record.reason}</td>
                <td>${record.professional}</td>
                <td>
                    <button class="action-quick-btn" title="Visualizar Detalhes" onclick="viewMedicalRecordDetails(${record.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += tableRow;
    });
}

// Função para calcular idade
function calculatePatientAge(dateOfBirth) {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Funções dos botões de ação da tabela de pacientes
function viewPatientDetails(patientIdentification) {
    const selectedPatient = registeredPatients.find(p => p.id === patientIdentification);
    if (selectedPatient) {
        alert(
            `Visualizando informações de: ${selectedPatient.fullName}\n` +
            `CPF: ${selectedPatient.cpf}\n` +
            `Telefone: ${selectedPatient.contactPhone}\n` +
            `E-mail: ${selectedPatient.contactEmail || 'Não informado'}\n` +
            `Endereço: ${selectedPatient.residentialAddress}, ${selectedPatient.cityLocation}`
        );
    }
}

function editPatientRecord(patientIdentification) {
    const selectedPatient = registeredPatients.find(p => p.id === patientIdentification);
    if (selectedPatient) {
        displayToast(
            `Editando registro de: ${selectedPatient.fullName}. ` +
            `(Funcionalidade de edição completa seria implementada aqui)`,
            'info'
        );
    }
}

// Função para exibir notificações (Toast)
function displayToast(messageText, messageType = 'info') {
    const toastNotification = document.createElement('div');
    toastNotification.className = `toast-notification toast-${messageType}`;
    toastNotification.textContent = messageText;

    toastNotification.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        background: ${messageType === 'success' ? '#28a745' : messageType === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1.1rem 1.8rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        animation: toastIn 0.4s ease-out forwards;
    `;

    document.body.appendChild(toastNotification);

    setTimeout(() => {
        toastNotification.style.animation = 'toastOut 0.4s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(toastNotification);
        }, 400);
    }, 3500);
}

const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes toastIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes toastOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(toastStyles);

document.addEventListener('DOMContentLoaded', function() {
    const cpfInputControl = document.getElementById('patientIdentifier');
    if (cpfInputControl) {
        cpfInputControl.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    const phoneInputControl = document.getElementById('patientContactPhone');
    if (phoneInputControl) {
        phoneInputControl.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }
});
