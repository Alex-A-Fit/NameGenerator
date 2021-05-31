let nameEntered = document.getElementById("nameEntered");
let addButton = document.getElementById("addButton");
let nameList = document.getElementById("nameList");
let generateSize = document.getElementById("generateSize");
let generateGroups = document.getElementById("generateGroups");
let validity = document.getElementById("validity");
let validity2 = document.getElementById("validity2");
let validity3 = document.getElementById("validity3");
let modalTitle = document.getElementById("modalTitle");
let customRange = document.getElementById("customRange");
let confirm = document.getElementById("confirm");
let chosenRange = document.getElementById("chosenRange");
let modalClose = document.getElementById("modalClose");
let randomNameGen = document.getElementById("randomNameGen");
let gotGroups = false;
let gotGroupSize = false;
let groupCounter = 1;
let groupSize;
let groups;
let sameName = false;
let nameListArray = [];
const randomListArray = ["Adrian", "Arthur", "Alex", "Ann", "Bryan", "Carlos", "Christy", "Demitrius", "Dylan", "Hugo", "John", "Jorge", "Joseph", "Juan", "Ken", "Leo", "Matthew", "Tyler", "Sean", "Trevor", "Victor"];
randomNameGen.addEventListener('click', function () {
    if (randomListArray.length == 0) {
        alert("Out of random names :(")
    } else {
        let randomName = randomListArray[Math.floor(Math.random() * randomListArray.length)]
        randomListArray.splice(randomListArray.indexOf(randomName), 1)
        if (nameListArray.includes(randomName)) {
            alert("Random name has already been entered")
        } else {
            creatingNames(randomName);
            saveToLS(randomName);
        }
    }
});
generateSize.addEventListener('click', function () {
    customRange.max = Math.round(nameListArray.length / 2)
    modalTitle.innerText = "Group by number of people"
    gotGroupSize = true;
});
generateGroups.addEventListener('click', function () {
    customRange.max = Math.round(nameListArray.length / 2)
    modalTitle.innerText = "Group by number of groups allowed"
    gotGroups = true
});
modalClose.addEventListener('click', function () {
    gotGroups = false;
    gotGroupSize = false;
});
confirm.addEventListener('click', function () {
    if (gotGroups === true) {
        groups = chosenRange.value
        groupSize = Math.round(nameListArray.length / groups)
        makeGroups("../pages/groups.html");
    } else if (gotGroupSize === true) {
        groupSize = chosenRange.value;
        groups = Math.round(nameListArray.length / groupSize)
        makeGroups("../pages/groups.html");
    }
});
addButton.addEventListener('click', function () {
    if (nameListArray.length === 0) {
        saveToLS(nameEntered.value);
        creatingNames(nameEntered.value);
    } else {
        let checkName = nameListArray.slice(0);
        let checkName2 = [];
        checkName.forEach(names => checkName2.push(names.toLowerCase()));   
        sameName = checkName2.includes(nameEntered.value.toLowerCase()) ? true : false;
        if ((/^[A-Za-z ]+$/).test(nameEntered.value) && sameName != true) {
            saveToLS(nameEntered.value);
            creatingNames(nameEntered.value);
        } else {
            validity.classList.remove("d-none");
            validity2.classList.remove("d-none");
            validity3.classList.remove("d-none");
            setTimeout(function () {
                validity.classList.add("d-none");
                validity2.classList.add("d-none");
                validity3.classList.add("d-none");
            }, 3000);
        }
    }
    nameEntered.value = "";
    sameName = false;
});
const creatingNames = (text) => {
    let row = document.createElement("div");
    row.classList = "row";
    const col9 = document.createElement("div");
    col9.classList = "col-9 d-flex justify-content-start";
    const h2 = document.createElement("h2");
    h2.innerText = text;
    const col3 = document.createElement("div");
    col3.classList = "col-3 d-flex justify-content-center";
    const i = document.createElement('i');
    i.classList = "fas fa-trash-alt black"
    i.addEventListener('click', function () {
        for (let d = 0; d < nameListArray.length; d++) {
            if (h2.innerText === nameListArray[d]) {
                nameListArray.splice(d, 1);
                localStorage.setItem("NameList", JSON.stringify(nameListArray));
                nameList.removeChild(row);

            }
        }
        nameListArray = (JSON.parse(localStorage.getItem("NameList")));
    });
    col3.appendChild(i);
    col9.appendChild(h2);
    row.appendChild(col9);
    row.appendChild(col3);
    nameList.appendChild(row);
}
function saveToLS(string) {
    nameListArray.push(string);
    localStorage.setItem("NameList", JSON.stringify(nameListArray));
}
function grabFromLS() {
    nameListArray = (JSON.parse(localStorage.getItem("NameList")));
    if (nameListArray === null) {
        nameListArray = [];
    }
    if (nameListArray.length > 0) {
        for (let i = 0; i < nameListArray.length; i++) {
            creatingNames(nameListArray[i]);
        }
    }
}
grabFromLS();
function makeGroups(url) {
    let createGroups = new XMLHttpRequest();
    createGroups.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.getElementById("groupMaker").innerHTML = createGroups.responseText;
            const creatingGroups = () => {
                let placeGroups = document.getElementById("placeGroups");
                const col12 = document.createElement("div");
                col12.classList = "col-12 d-flex justify-content-center"
                const card = document.createElement("div");
                card.classList = "card cardSize mb-3";
                const cardHeader = document.createElement("div");
                cardHeader.classList = "card-header";
                cardHeader.innerText = "Group " + (groupCounter + 1);
                const ul = document.createElement("ul");
                ul.classList = "list-group list-group-flush";
                for (let i = 0; i < groupSize; i++) {
                    const li = document.createElement("li");
                    li.classList = "list-group-item";
                    li.innerText = nameListArray[Math.floor(Math.random() * nameListArray.length)];
                    if (li.innerText == "undefined") {break;}
                    if (nameListArray.includes(li.innerText)) {
                        nameListArray.splice(nameListArray.indexOf(li.innerText), 1);
                    }
                    ul.appendChild(li);
                }
                card.appendChild(cardHeader);
                card.appendChild(ul);
                col12.appendChild(card);
                placeGroups.appendChild(col12);
            }
            for (groupCounter = 0; groupCounter < groups; groupCounter++) {
                creatingGroups();
            }
        }
    };
    createGroups.open("GET", url, true);
    createGroups.send();
}