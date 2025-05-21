import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getDatabase,ref,push,onValue,remove,set } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-database.js";

const appSetting = {
    databaseURL:"https://js-curd-8bebe-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const userListInDB = ref(database, "Users");

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#name");
const ageEl = document.querySelector("#age");
const cityEl = document.querySelector("#city");
const frmEl = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

frm.addEventListener("submit",function (e){
    e.preventDefault();

    if (!nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim()){
        alert("Please fill all details...");
        return;
    }

    if (idEl.value){
        // Update Record
        set(ref(database, "Users/" + idEl.value),{
            name: nameEl.value.trim(),
            age:ageEl.value.trim(),
            city:cityEl.value.trim(),
        });
        clearElement();
        return;
    }

    // Insert Record
    const newUser = {
        name:nameEl.value.trim(),
        age:ageEl.value.trim(),
        city:cityEl.value.trim(),
    };
    push(userListInDB, newUser);
    clearElement();
});

function clearElement(){
    nameEl.value = "";
    ageEl.value = "";
    cityEl.value = "";
    idEl.value = "";
}

onValue(userListInDB,function(snapshot){
    if (snapshot.exists()){
        let userArray = Object.entries(snapshot.val());
        // console.log(userArray);
        tblBodyEl.innerHTML = "";
        for (let i = 0; i < userArray.length; i++) {
            let currentUser = userArray [i];
            // console.log(currentUser);
            let currentUserID = currentUser[0];
            let currentUserValue = currentUser[1];

            tblBodyEl.innerHTML +=`
            <tr>    
                    <td>${i+1}</td>
                    <td>${currentUserValue.name}</td>
                    <td>${currentUserValue.age}</td>
                    <td>${currentUserValue.city}</td>
                    <td>
                        <button class = "btn-edit" data-id="${currentUserID}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"/></svg>
                        </button>
                    </td>
                    <td>
                        <button class = "btn-delete" data-id="${currentUserID}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                        </button>
                    </td>
            </tr>`
        }
    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='6'>No Record Found </td></tr>";
    }
});

document.addEventListener("click",function (e){
    if (e.target.classList.contains("btn-edit")) {
        const id = e.target.dataset.id;
        const tdElements = e.target.closest("tr").children;
         idEl.value = id;
         nameEl.value = tdElements[1].textContent;
         ageEl.value = tdElements[2].textContent;
         cityEl.value = tdElements[3].textContent;
        // console.log("Edit", id);
    }else if (e.target.classList.contains("btn-delete")){
        if (confirm("Are you sure to delete?")){
            const id = e.target.dataset.id;
            let data = ref(database, `Users/${id}`);
            remove(data);
        }
    }
});

