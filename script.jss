function minutes(timeString){

    const [h,m] = timeString.split(":").map(Number);

    return h*60+m;
}

const periods = [

    ["08:45","09:35","Period 1"],
    ["09:35","10:25","Period 2"],
    ["10:25","10:40","Break"],
    ["10:40","11:30","Period 3"],
    ["11:30","12:20","Period 4"],
    ["12:20","13:10","Period 5"],
    ["13:10","13:50","Lunch"],
    ["13:50","14:40","Period 6"]

];

function getCurrentPeriod(){

    const now = new Date();

    const day = now.getDay();

    const currentMinutes =
        now.getHours()*60 + now.getMinutes();

    for(let p of periods){

        if(
            currentMinutes >= minutes(p[0]) &&
            currentMinutes < minutes(p[1])
        ){
            return {
                name:p[2],
                end:p[1]
            };
        }
    }

    if(day===1 || day===3){

        if(
            currentMinutes >= minutes("14:40") &&
            currentMinutes < minutes("15:05")
        ){
            return {
                name:"Tutor Time",
                end:"15:05"
            };
        }
    }

    if(day===2 || day===4){

        if(
            currentMinutes >= minutes("14:40") &&
            currentMinutes < minutes("15:30")
        ){
            return {
                name:"Period 7",
                end:"15:30"
            };
        }
    }

    if(day===5){

        if(currentMinutes >= minutes("14:40")){
            return {
                name:"School Finished",
                end:""
            };
        }
    }

    return {
        name:"Outside School Hours",
        end:""
    };
}

function updateClock(){

    const now = new Date();

    document.getElementById("time").textContent =
        now.toLocaleTimeString('en-GB');

    document.getElementById("date").textContent =
        now.toLocaleDateString('en-GB',{
            weekday:'long',
            day:'numeric',
            month:'long',
            year:'numeric'
        });

    const period = getCurrentPeriod();

    document.getElementById("periodName")
        .textContent = period.name;

    document.getElementById("periodEnd")
        .textContent =
        period.end
        ? `Finishes at ${period.end}`
        : "";
}

async function loadNotices(){

    try{

        const response =
            await fetch(
                "notices.json?t=" + Date.now()
            );

        const data =
            await response.json();

        const list =
            document.getElementById("noticeList");

        list.innerHTML="";

        data.notices.forEach(notice=>{

            const li =
                document.createElement("li");

            li.textContent = notice;

            list.appendChild(li);
        });

    }catch(e){}
}

async function loadAssembly(){

    try{

        const response =
            await fetch(
                "assembly.json?t="+Date.now()
            );

        const data =
            await response.json();

        const day =
            new Date().getDay();

        const period =
            getCurrentPeriod();

        if(
            (day===1 || day===3)
            &&
            period.name==="Tutor Time"
        ){

            document
                .getElementById("assemblyContainer")
                .classList
                .remove("hidden");

            document
                .getElementById("assemblyYear")
                .textContent =
                data.yearGroup;

        }else{

            document
                .getElementById("assemblyContainer")
                .classList
                .add("hidden");
        }

    }catch(e){}
}

async function loadEvent(){

    try{

        const response =
            await fetch(
                "event.json?t="+Date.now()
            );

        const data =
            await response.json();

        if(data.enabled){

            document
                .getElementById("eventScreen")
                .classList
                .remove("hidden");

            document
                .getElementById("mainScreen")
                .style.display="none";

            document
                .getElementById("eventTitle")
                .textContent=data.title;

            document
                .getElementById("eventSubtitle")
                .textContent=data.subtitle;

            document
                .getElementById("eventMessage")
                .textContent=data.message;

        }else{

            document
                .getElementById("eventScreen")
                .classList
                .add("hidden");

            document
                .getElementById("mainScreen")
                .style.display="block";
        }

    }catch(e){}
}

updateClock();
loadNotices();
loadAssembly();
loadEvent();

setInterval(updateClock,1000);
setInterval(loadNotices,60000);
setInterval(loadAssembly,60000);
setInterval(loadEvent,60000);