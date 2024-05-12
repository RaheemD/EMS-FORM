import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const questionsText = {
    question1: "I feel encouraged to share my ideas on better ways of doing things.",
    question2: "My work gives me a feeling of personal accomplishment and satisfaction.",
    question3: "At my work, I have room to grow and new things to learn.",
    question4: "I am happy with the team's communication and company's culture.",
    question5: "I have great life/work balance without disruption of personal life."
};

document.getElementById('surveyForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    var allChecked = true;
    var questions = document.querySelectorAll('input[type="radio"], input[type="text"]');
    var radioGroups = {};

    questions.forEach(function(input) {
        if (input.type === "radio") {
            radioGroups[input.name] = radioGroups[input.name] || document.querySelector(`input[name="${input.name}"]:checked`) != null;
        } else if (input.type === "text" && !input.value.trim()) {
            allChecked = false;
        }
    });

    allChecked = allChecked && Object.keys(radioGroups).every(key => radioGroups[key]);

    if (allChecked) {
        const timestamp = new Date().toLocaleDateString('en-CA'); 

        const employeeId = document.getElementById('employeeId').value;
        const docId = `${employeeId}_${timestamp}`;

        try {
            await setDoc(doc(db, "responses", docId), {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                employeeId: employeeId,
                question1: `${questionsText.question1}: ${document.querySelector('input[name="question1"]:checked').value}`,
                question2: `${questionsText.question2}: ${document.querySelector('input[name="question2"]:checked').value}`,
                question3: `${questionsText.question3}: ${document.querySelector('input[name="question3"]:checked').value}`,
                question4: `${questionsText.question4}: ${document.querySelector('input[name="question4"]:checked').value}`,
                question5: `${questionsText.question5}: ${document.querySelector('input[name="question5"]:checked').value}`,
                rating: document.querySelector('input[name="rating"]:checked').value,
            });
            displaySuccessMessage();
            this.reset();
        } catch (err) {
            console.error("Error adding document: ", err);
            alert('Error submitting feedback');
        }
    } else {
        alert('Please fill out all fields and answer all questions.');
    }
});

function displaySuccessMessage() {
    var container = document.querySelector('.container');
    var successMessage = document.createElement('div');
    successMessage.textContent = 'Feedback Submitted Successfully';
    successMessage.style.color = 'green';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.marginTop = '20px';
    successMessage.style.textAlign = 'center';

    container.appendChild(successMessage);

    setTimeout(function() {
        container.removeChild(successMessage);
    }, 3000);
}