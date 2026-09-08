import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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

const loginPage =
    document.getElementById("loginPage");

const dashboard =
    document.getElementById("dashboard");

const status =
    document.getElementById("status");

/* --------------------
   Login
--------------------- */

document
.getElementById("loginBtn")
.addEventListener("click", async ()=>{

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    }catch(error){

        alert(
            "Login failed:\n" +
            error.message
        );
    }
});

/* --------------------
   Logout
--------------------- */

document
.getElementById("logoutBtn")
.addEventListener("click", async ()=>{

    await signOut(auth);
});

/* --------------------
   Auth State
--------------------- */

onAuthStateChanged(auth, async (user)=>{

    if(user){

        loginPage.classList.add("hidden");
        dashboard.classList.remove("hidden");

        loadData();

    }else{

        dashboard.classList.add("hidden");
        loginPage.classList.remove("hidden");
    }
});

/* --------------------
   Load Data
--------------------- */

async function loadData(){

    try{

        const settingsRef =
            doc(db,"display","settings");

        const noticesRef =
            doc(db,"display","notices");

        const settingsSnap =
            await getDoc(settingsRef);

        const noticesSnap =
            await getDoc(noticesRef);

        if(settingsSnap.exists()){

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

        if(noticesSnap.exists()){

            const notices =
                noticesSnap.data().items || [];

            for(let i=0;i<5;i++){

                const field =
                    document.getElementById(
                        `notice${i+1}`
                    );

                field.value =
                    notices[i] || "";
            }
        }

    }catch(error){

        console.error(error);
    }
}

/* --------------------
   Save
--------------------- */

document
.getElementById("saveBtn")
.addEventListener("click", saveData);

async function saveData(){
    console.log("Save button clicked");
    
    

    try{

        const notices = [];

        for(let i=1;i<=5;i++){

            const value =
                document
                .getElementById(
                    `notice${i}`
                )
                .value
                .trim();

            if(value !== ""){

                notices.push(value);
            }
        }

        console.log("Writing settings...");

        await setDoc(

            doc(db,"display","settings"),

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

        console.log("Writing notices...");

        await setDoc(

            doc(db,"display","notices"),

            {
                items:notices
            }

        );

        status.textContent =
            "Changes saved successfully";

        status.className =
            "status success";

        setTimeout(()=>{

            status.textContent="";

        },3000);

    }catch(error){

        console.error(error);

        status.textContent =
            "Error saving changes";

        status.className =
            "status error";
    }
}
