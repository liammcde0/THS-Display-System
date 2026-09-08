import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyBQRgTDe68NjbLraqQULTPuN59qCckYduY",
    authDomain: "trinity-display.firebaseapp.com",
    projectId: "trinity-display",
    storageBucket: "trinity-display.firebasestorage.app",
    messagingSenderId: "872319392533",
    appId: "1:872319392533:web:5b50ab8ad6de57471d671c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
   PAGE ELEMENTS
========================= */

const loginPage =
    document.getElementById("loginPage");

const dashboard =
    document.getElementById("dashboard");

const status =
    document.getElementById("status");

/* =========================
   LOGIN
========================= */

document
.getElementById("loginBtn")
.addEventListener("click", async () => {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch (error) {

        alert(
            "Login Failed\n\n" +
            error.message
        );
    }
});

/* =========================
   LOGOUT
========================= */

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    await signOut(auth);

});

/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(auth, async (user) => {

    if (user) {

        loginPage.classList.add("hidden");
        dashboard.classList.remove("hidden");

        console.log("Logged in:", user.email);

        await loadData();

    } else {

        dashboard.classList.add("hidden");
        loginPage.classList.remove("hidden");

    }
});

/* =========================
   LOAD DATA
========================= */

async function loadData() {

    console.log("Loading Firestore data...");

    /* SETTINGS */

    try {

        const settingsRef =
            doc(db, "display", "settings");

        const settingsSnap =
            await getDoc(settingsRef);

        if (settingsSnap.exists()) {

            const data =
                settingsSnap.data();

            document.getElementById(
                "assemblyYear"
            ).value =
                data.assemblyYear || "S1";

            document.getElementById(
                "eventEnabled"
            ).checked =
                data.eventEnabled || false;

            document.getElementById(
                "eventTitle"
            ).value =
                data.eventTitle || "";

            document.getElementById(
                "eventSubtitle"
            ).value =
                data.eventSubtitle || "";

            document.getElementById(
                "eventMessage"
            ).value =
                data.eventMessage || "";

            document.getElementById(
                "emergencyEnabled"
            ).checked =
                data.emergencyEnabled || false;

            document.getElementById(
                "emergencyTitle"
            ).value =
                data.emergencyTitle || "";

            document.getElementById(
                "emergencyMessage"
            ).value =
                data.emergencyMessage || "";
        }

    } catch (error) {

        console.error(
            "Settings load failed:",
            error
        );
    }

    /* NOTICES */

    try {

        const noticesRef =
            doc(db, "display", "notices");

        const noticesSnap =
            await getDoc(noticesRef);

        if (noticesSnap.exists()) {

            const data =
                noticesSnap.data();

            const notices =
                Array.isArray(data.items)
                ? data.items
                : [];

            for (let i = 0; i < 5; i++) {

                document.getElementById(
                    `notice${i + 1}`
                ).value =
                    notices[i] || "";
            }
        }

    } catch (error) {

        console.error(
            "Notices load failed:",
            error
        );
    }
}

/* =========================
   SAVE BUTTON
========================= */

document
.getElementById("saveBtn")
.addEventListener("click", saveData);

/* =========================
   SAVE DATA
========================= */

async function saveData() {

    console.log("Save button clicked");

    try {

        const notices = [];

        for (let i = 1; i <= 5; i++) {

            const value =
                document
                .getElementById(
                    `notice${i}`
                )
                .value
                .trim();

            if (value !== "") {

                notices.push(value);

            }
        }

        console.log("Writing settings...");

        await setDoc(

            doc(db, "display", "settings"),

            {
                assemblyYear:
                    document.getElementById(
                        "assemblyYear"
                    ).value,

                eventEnabled:
                    document.getElementById(
                        "eventEnabled"
                    ).checked,

                eventTitle:
                    document.getElementById(
                        "eventTitle"
                    ).value,

                eventSubtitle:
                    document.getElementById(
                        "eventSubtitle"
                    ).value,

                eventMessage:
                    document.getElementById(
                        "eventMessage"
                    ).value,

                emergencyEnabled:
                    document.getElementById(
                        "emergencyEnabled"
                    ).checked,

                emergencyTitle:
                    document.getElementById(
                        "emergencyTitle"
                    ).value,

                emergencyMessage:
                    document.getElementById(
                        "emergencyMessage"
                    ).value
            }

        );

        console.log("Settings saved");

        console.log("Writing notices...");

        await setDoc(

            doc(db, "display", "notices"),

            {
                items: notices
            }

        );

        console.log("Notices saved");

        status.textContent =
            "Changes saved successfully";

        status.className =
            "status success";

        setTimeout(() => {

            status.textContent = "";

        }, 3000);

    } catch (error) {

        console.error(
            "SAVE ERROR:",
            error
        );

        alert(
            "Save Failed\n\n" +
            error.message
        );

        status.textContent =
            "Error saving changes";

        status.className =
            "status error";
    }
}
