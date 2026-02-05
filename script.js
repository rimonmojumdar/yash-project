
let dataEntryUser = {
    username: 'Night', 
    password: '12345'  
};

document.addEventListener('DOMContentLoaded', () => {
    initializeDataEntryCredentials();
   
    if (document.getElementById('entry-page')) {
        showPage('entry-page');
    }
    
    const reportDateInput = document.getElementById('report-date');
    if (reportDateInput) {
        reportDateInput.value = new Date().toISOString().substring(0, 10);
    }
});

function initializeDataEntryCredentials() {
    
    const storedUser = localStorage.getItem('dataEntryUser');
    if (storedUser) {
        dataEntryUser = JSON.parse(storedUser);
    } else {
        localStorage.setItem('dataEntryUser', JSON.stringify(dataEntryUser));
    }
    populateCountryCode();
}


function populateCountryCode() {
    const selectElement = document.getElementById('country-code');
    if (selectElement) {
        const codes = ["+880 (BD)", "+91 (IN)", "+1 (US)", "+44 (UK)"];
        codes.forEach(code => {
            const option = document.createElement("option");
            option.text = code;
            option.value = code.split(' ')[0]; 
            selectElement.add(option);
        });
       
        selectElement.value = "+880";
    }
}


function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0); 
    } else {
        console.error("Page ID not found:", pageId);
    }

    
    if (pageId === 'data-entry-login-page') {
        document.getElementById('login-error-message').textContent = '';
        document.getElementById('data-entry-login-form').reset();
    }
    if (pageId === 'password-reset-page') {
        document.getElementById('reset-error-message').textContent = '';
        document.getElementById('reset-success-message').textContent = '';
        document.getElementById('password-reset-form').reset();
    }
}


function handleTopNavClick(title, message) {
    const popupDialog = document.getElementById('popup-dialog');
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-message').textContent = message;
    popupDialog.classList.add('active');
}


function closePopup() {
    document.getElementById('popup-dialog').classList.remove('active');
}


function showForm(formId) {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(formId).classList.add('active');
    document.getElementById(formId.replace('-form', '-tab-btn')).classList.add('active');
}


function dataEntryLogin(event) {
    event.preventDefault(); 

    const usernameInput = document.getElementById('data-entry-username').value.trim();
    const passwordInput = document.getElementById('data-entry-password').value.trim();
    const errorMessage = document.getElementById('login-error-message');
    
    const storedUser = JSON.parse(localStorage.getItem('dataEntryUser'));
    
    if (usernameInput === storedUser.username && passwordInput === storedUser.password) {
        errorMessage.textContent = '';
        document.getElementById('data-entry-login-form').reset();
        showPage('data-entry-dashboard-page'); 
    } else {
        errorMessage.textContent = '❌ ইউজারনেম বা পাসওয়ার্ড ভুল হয়েছে।';
    }
}


function changeDataEntryPassword(event) {
    event.preventDefault();

    const currentPasswordInput = document.getElementById('current-password').value.trim();
    const newUsernameInput = document.getElementById('new-username').value.trim();
    const newPasswordInput = document.getElementById('new-password').value.trim();
    const errorMessage = document.getElementById('reset-error-message');
    const successMessage = document.getElementById('reset-success-message');
    
    errorMessage.textContent = '';
    successMessage.textContent = '';

    const storedUser = JSON.parse(localStorage.getItem('dataEntryUser')); 

    if (currentPasswordInput !== storedUser.password) {
        errorMessage.textContent = '❌ বর্তমান পাসওয়ার্ড ভুল হয়েছে।';
        return; 
    }

    if (newPasswordInput.length < 4) {
        errorMessage.textContent = '❌ নতুন পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।';
        return; 
    }

    const newUser = {
        username: newUsernameInput || storedUser.username, 
        password: newPasswordInput
    };

    localStorage.setItem('dataEntryUser', JSON.stringify(newUser));
    dataEntryUser = newUser; 

    successMessage.textContent = '✅ পাসওয়ার্ড পরিবর্তন সফল হয়েছে!';
    document.getElementById('password-reset-form').reset();
    
    setTimeout(() => {
        showPage('data-entry-login-page');
    }, 2000);
}


function handleFormSubmission(event) {
    event.preventDefault();
    const formId = event.target.id;
    let messageElementId = "";
    let messageText = "";

   
    if (formId === 'doctor-entry-form') {
        messageElementId = 'doctor-success-message';
        messageText = "✅ নতুন ডাক্তারের তথ্য সফলভাবে ডাটাবেসে সেভ করা হয়েছে!";
    } else if (formId === 'hospital-entry-form') {
        messageElementId = 'hospital-success-message';
        messageText = "✅ নতুন হাসপাতালের তথ্য সফলভাবে ডাটাবেসে সেভ করা হয়েছে!";
    } else if (formId === 'diagnostic-entry-form') {
        messageElementId = 'diagnostic-success-message';
        messageText = "✅ নতুন ডায়াগনস্টিক ডেটা সফলভাবে সেভ করা হয়েছে!";
    }

    if (messageElementId) {
        document.getElementById(messageElementId).textContent = messageText;
        event.target.reset(); 
        setTimeout(() => {
            document.getElementById(messageElementId).textContent = '';
        }, 3000); 
    }
}


function generateDoctorReport(event) {
    event.preventDefault();

    const doctorName = document.getElementById('report-doctor-name').value.trim();
    const specialty = document.getElementById('report-doctor-specialty').value.trim();
    const date = document.getElementById('report-date').value;
    const patientCount = parseInt(document.getElementById('report-patient-count').value.trim());
    const visitFee = parseFloat(document.getElementById('report-visit-fee').value.trim());

    if (isNaN(patientCount) || isNaN(visitFee) || patientCount <= 0 || visitFee <= 0) {
        alert("রোগীর সংখ্যা এবং ভিজিট ফি অবশ্যই সঠিক সংখ্যা হতে হবে।");
        return;
    }

    const totalIncome = patientCount * visitFee;
    
   
    const doctorSharePercentage = 70;
    const organizationSharePercentage = 100 - doctorSharePercentage;
    
    const doctorPayment = (totalIncome * doctorSharePercentage) / 100;
    const organizationEarning = totalIncome - doctorPayment;
    
    const reportOutput = document.getElementById('doctor-report-output');
    
    
    reportOutput.innerHTML = `
        <div class="report-header">
            <h2>ডাক্তার ভিজিট ও পেমেন্ট রিপোর্ট</h2>
            <p>NIGHTINGALE Seba - স্বাস্থ্য সেবা লিমিটেড</p>
        </div>

        <div class="report-details">
            <div>ডাক্তারের নাম: <span>${doctorName}</span></div>
            <div>বিশেষত্ব/পদবি: <span>${specialty}</span></div>
        </div>
        <div class="report-details">
            <div>তারিখ: <span>${new Date(date).toLocaleDateString('bn-BD')}</span></div>
            <div>মোট রোগীর সংখ্যা: <span>${patientCount} জন</span></div>
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th>বিবরণ</th>
                    <th>পরিমাণ (সংখ্যা)</th>
                    <th>প্রতি ইউনিট খরচ (৳)</th>
                    <th>মোট টাকা (৳)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>রোগী ভিজিট ফি</td>
                    <td>${patientCount}</td>
                    <td>${visitFee.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}</td>
                    <td>${totalIncome.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="3">মোট আয় (৳)</td>
                    <td>${totalIncome.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <td colspan="3" style="font-weight: 700; color: green;">ডাক্তারের প্রাপ্য (${doctorSharePercentage}%)</td>
                    <td style="font-weight: 700; color: green;">${doctorPayment.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                    <td colspan="3" style="font-weight: 700; color: blue;">প্রতিষ্ঠানের আয় (${organizationSharePercentage}%)</td>
                    <td style="font-weight: 700; color: blue;">${organizationEarning.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="print-button-container print-hide">
            <button class="btn btn-print" onclick="window.print()"><i class="fas fa-print"></i> রিপোর্ট প্রিন্ট করুন</button>
        </div>
    `;
}