let currentActiveUser = null; // Variável renomeada para o usuário logado

// Dados de pacientes de exemplo, alterados e com alguns campos adicionais para demonstração
let registeredPatients = [
    {
        id: 101,
        fullName: "Carolina Alves Pereira",
        cpf: "111.222.333-44",
        contactPhone: "(11) 98765-4321",
        contactEmail: "carolina.alves@email.com",
        birthDate: "1980-11-22",
        genderIdentity: "F",
        residentialAddress: "Rua das Palmeiras, 300",
        cityLocation: "São Paulo",
        lastVisit: "20/04/2024" // Data de última consulta alterada
    },
    {
        id: 102,
        fullName: "Roberto Lima Costa",
        cpf: "555.666.777-88",
        contactPhone: "(11) 97777-8888",
        contactEmail: "roberto.lima@email.com",
        birthDate: "1995-03-10",
        genderIdentity: "M",
        residentialAddress: "Avenida Central, 750",
        cityLocation: "Guarulhos", // Cidade alterada
        lastVisit: "18/04/2024"
    },
    {
        id: 103,
        fullName: "Fernanda Santos Rocha",
        cpf: "999.888.777-66",
        contactPhone: "(11) 96666-5555",
        contactEmail: "fernanda.rocha@email.com",
        birthDate: "1988-07-01",
        genderIdentity: "F",
        residentialAddress: "Travessa da Esperança, 50",
        cityLocation: "Campinas", // Cidade alterada
        lastVisit: "15/04/2024"
    }
];

// Funções para gerenciamento de visualizações (telas)
function displayView(viewId) { // Função renomeada
    // Ocultar todas as visualizações
    document.querySelectorAll('.view').forEach(view => { // Classe alterada
        view.classList.remove('active');
    });
    // Mostrar a visualização específica
    document.getElementById(viewId).classList.add('active');
}

function showControlPanel() { // Função renomeada
    displayView('controlPanel'); // ID da view alterado
}

function showPatientRegistrationForm() { // Função renomeada
    displayView('patientRegistrationSection'); // ID da view alterado
    // Limpar formulário ao exibir
    document.querySelector('.patient-registration-form').reset(); // Classe alterada
}

function showPatientOverviewList() { // Função renomeada
    displayView('patientOverviewSection'); // ID da view alterado
    renderPatientDataTable(); // Função renomeada
}

function performLogout() { // Função renomeada
    currentActiveUser = null; // Variável renomeada
    displayView('accessSection'); // ID da view alterado
    // Limpar formulário de login
    document.querySelector('.access-form').reset(); // Classe alterada
}

// Função para processar a autenticação (login)
function handleAuthSubmission(event) { // Função renomeada
    event.preventDefault();
    const loginFormData = new FormData(event.target); // Variável renomeada
    const profileRole = loginFormData.get('profileRole'); // Nome do campo alterado
    const userEmail = loginFormData.get('userEmail'); // Nome do campo alterado
    const userPasskey = loginFormData.get('userPasskey'); // Nome do campo alterado

    // Simples validação (em um sistema real, seria via backend)
    if (userEmail && userPasskey) {
        currentActiveUser = { // Variável renomeada
            email: userEmail,
            role: profileRole, // Nome do campo alterado
            name: retrieveUserName(profileRole) // Função renomeada
        };
        // Atualizar nome do usuário no painel de controle
        document.getElementById('displayName').textContent = currentActiveUser.name; // ID do elemento alterado, variável renomeada
        displayToast('Acesso realizado com sucesso à plataforma!', 'success'); // Função e mensagem renomeadas
        showControlPanel(); // Função renomeada
    } else {
        displayToast('Por favor, preencha todas as credenciais de acesso.', 'error'); // Função e mensagem renomeadas
    }
}

function retrieveUserName(userRole) { // Função renomeada
    const assignedNames = { // Variável renomeada
        'physician': 'Dr(a). Ana Paula', // Nome e tipo alterados
        'nurse': 'Enf. Ricardo Silva', // Nome e tipo alterados
        'admin': 'Supervisor(a) Geral' // Nome e tipo alterados
    };
    return assignedNames[userRole] || 'Usuário do SGIS'; // Variável e texto renomeados
}

// Função para processar o registro de paciente
function processPatientRecord(event) { // Função renomeada
    event.preventDefault();
    const patientFormData = new FormData(event.target); // Variável renomeada
    const newPatientEntry = { // Variável renomeada
        id: registeredPatients.length + 101, // ID inicial alterado
        fullName: patientFormData.get('patientFullName'), // Nome do campo alterado
        cpf: patientFormData.get('patientIdentifier'), // Nome do campo alterado
        contactPhone: patientFormData.get('patientContactPhone'), // Nome do campo alterado
        contactEmail: patientFormData.get('patientContactEmail'), // Nome do campo alterado
        birthDate: patientFormData.get('patientBirthDate'), // Nome do campo alterado
        genderIdentity: patientFormData.get('patientGenderIdentity'), // Nome do campo alterado
        residentialAddress: patientFormData.get('patientResidentialAddress'), // Nome do campo alterado
        cityLocation: patientFormData.get('patientCityLocation'), // Nome do campo alterado
        lastVisit: new Date().toLocaleDateString('pt-BR') // Nome do campo alterado
    };
    // Adicionar à lista de pacientes
    registeredPatients.push(newPatientEntry); // Variável renomeada
    displayToast('Registro de paciente efetuado com sucesso!', 'success'); // Função e mensagem renomeadas
    showControlPanel(); // Função renomeada
}

// Função para renderizar a tabela de pacientes
function renderPatientDataTable() { // Função renomeada
    const tableBody = document.getElementById('patientRecordsBody'); // ID do tbody alterado
    tableBody.innerHTML = ""; // Limpa o corpo da tabela
    registeredPatients.forEach(patient => { // Variável renomeada
        const patientAge = calculatePatientAge(patient.birthDate); // Função renomeada
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

// Função para calcular idade
function calculatePatientAge(dateOfBirth) { // Função renomeada
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Função de busca/filtragem de pacientes
function filterPatientRecords(searchKey) { // Função renomeada, parâmetro renomeado
    const lowerCaseSearchKey = searchKey.toLowerCase(); // Variável renomeada
    const filteredRecords = registeredPatients.filter(patient => // Variável renomeada, variável renomeada
        patient.fullName.toLowerCase().includes(lowerCaseSearchKey) ||
        patient.cpf.includes(searchKey) ||
        patient.contactPhone.includes(searchKey)
    );
    const tableBody = document.getElementById('patientRecordsBody'); // ID do tbody alterado
    tableBody.innerHTML = "";
    filteredRecords.forEach(patient => { // Variável renomeada
        const patientAge = calculatePatientAge(patient.birthDate); // Função renomeada
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

// Funções dos botões de ação da tabela (exemplo)
function viewPatientDetails(patientIdentification) { // Função e parâmetro renomeados
    const selectedPatient = registeredPatients.find(p => p.id === patientIdentification); // Variáveis renomeadas
    if (selectedPatient) {
        alert(`Visualizando informações de: ${selectedPatient.fullName}\nCPF: ${selectedPatient.cpf}\nTelefone: ${selectedPatient.contactPhone}\nE-mail: ${selectedPatient.contactEmail || 'Não informado'}\nEndereço: ${selectedPatient.residentialAddress}, ${selectedPatient.cityLocation}`);
    }
}

function editPatientRecord(patientIdentification) { // Função e parâmetro renomeados
    const selectedPatient = registeredPatients.find(p => p.id === patientIdentification); // Variáveis renomeadas
    if (selectedPatient) {
        displayToast(`Editando registro de: ${selectedPatient.fullName}. (Funcionalidade de edição completa seria implementada aqui)`, 'info'); // Função e mensagem renomeadas
    }
}

// Função para exibir notificações (Toast)
function displayToast(messageText, messageType = 'info') { // Função e parâmetros renomeados
    const toastNotification = document.createElement('div'); // Variável renomeada
    toastNotification.className = `toast-notification toast-${messageType}`; // Classe alterada
    toastNotification.textContent = messageText; // Variável renomeada

    // Estilos do toast (mantidos semelhantes, mas com novas classes)
    toastNotification.style.cssText = `
        position: fixed;
        top: 25px; /* Posição ajustada */
        right: 25px; /* Posição ajustada */
        background: ${messageType === 'success' ? '#28a745' : messageType === 'error' ? '#dc3545' : '#17a2b8'}; /* Novas cores */
        color: white;
        padding: 1.1rem 1.8rem; /* Padding ajustado */
        border-radius: 8px; /* Borda ajustada */
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15); /* Sombra ajustada */
        z-index: 1000;
        opacity: 0; /* Começa invisível */
        transform: translateY(-20px); /* Começa ligeiramente acima */
        animation: toastIn 0.4s ease-out forwards; /* Nova animação de entrada */
    `;

    document.body.appendChild(toastNotification);

    // Remover após 3.5 segundos
    setTimeout(() => {
        toastNotification.style.animation = 'toastOut 0.4s ease-in forwards'; // Nova animação de saída
        setTimeout(() => {
            document.body.removeChild(toastNotification);
        }, 400); // Tempo para a animação de saída
    }, 3500); // Tempo total de exibição
}

// Adicionar estilos de animação do toast (novos keyframes)
const toastStyles = document.createElement('style'); // Variável renomeada
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
            transform: translateY(-20px); /* Sai para cima */
        }
    }
`;
document.head.appendChild(toastStyles);

// Máscaras para inputs (renomeadas e com lógica similar)
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CPF
    const cpfInputControl = document.getElementById('patientIdentifier'); // ID do input alterado
    if (cpfInputControl) {
        cpfInputControl.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // Máscara para telefone
    const phoneInputControl = document.getElementById('patientContactPhone'); // ID do input alterado
    if (phoneInputControl) {
        phoneInputControl.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Novo formato para DDD
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }
});