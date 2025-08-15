const totalQuestions = 17;
let questionsState = JSON.parse(localStorage.getItem("questionsState")) || Array(totalQuestions).fill(false);

function saveQuestionsState() {
    localStorage.setItem("questionsState", JSON.stringify(questionsState));
}

function renderQuestions() {
    const container = document.getElementById("questions-container");
    container.innerHTML = "";
    for (let i = 0; i < totalQuestions; i++) {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `
            <h2>Otázka ${i + 1}</h2>
            <p>${questionsState[i] ? "✅ Zobrazeno" : "❓ Nezobrazeno"}</p>
            <a href="otazka_${i + 1}.html">Otevřít</a>
        `;
        container.appendChild(div);
    }
}

renderQuestions();



// Ulož celkový počet otázek pro galerii
try {
    localStorage.setItem("questionsTotal", String(totalQuestions));
} catch(e) {}
