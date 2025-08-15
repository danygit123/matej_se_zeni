function checkPassword() {
    const pwd = document.getElementById("password").value;
    if (pwd === "matej") {
        document.getElementById("password-container").style.display = "none";
        document.getElementById("settings-container").style.display = "block";
    } else {
        alert("Špatné heslo!");
    }
}

function resetTasks() {
    localStorage.removeItem("tasksState");
    alert("Úkoly byly resetovány");
}

function resetQuestions() {
    localStorage.removeItem("questionsState");
    alert("Otázky byly resetovány");
}


// ===== Ruční odemykání fotek =====
function wireManualGalleryUnlocks() {
    const addBtn = document.getElementById("gallery-add");
    const subBtn = document.getElementById("gallery-sub");
    function getVal(){ return parseInt(localStorage.getItem("manualGalleryUnlocks")||"0",10)||0; }
    if (addBtn) addBtn.addEventListener("click", () => {
        localStorage.setItem("manualGalleryUnlocks", String(getVal()+1));
        alert("Přidána 1 odemčená fotografie navíc.");
    });
    if (subBtn) addBtn && subBtn.addEventListener("click", () => {
        const v = Math.max(0, getVal()-1);
        localStorage.setItem("manualGalleryUnlocks", String(v));
        alert("Odebrána 1 odemčená fotografie navíc.");
    });
}

// Připojit po načtení
document.addEventListener("DOMContentLoaded", () => {
    wireGalleryButtons && wireGalleryButtons();
    wireManualGalleryUnlocks();
});
