// Save Box Buttons variables
const openNewBtn = document.querySelector("#openNewBtn");
const saveBtn = document.querySelector("#saveBtn");
const openBtn = document.querySelector("#openBtn");

//Add Remove Button
const plansAddBtn = document.querySelector("#plansAddBtn");
const plansRemoveBtn = document.querySelector("#plansRemoveBtn");
const passesAddBtn = document.querySelector("#passesAddBtn");
const passesRemoveBtn = document.querySelector("#passesRemoveBtn");
const taskAddBtn = document.querySelector("#taskAddBtn");
const taskRemoveBtn = document.querySelector("#taskRemoveBtn");
const slavesAddBtn = document.querySelector("#slavesAddBtn");
const slavesRemoveBtn = document.querySelector("#slavesRemoveBtn");

//Render Button
const renderBtn = document.querySelector("#renderBtn");
const renderAllBtn = document.querySelector("#renderAllBtn");

// All table variables
const plansTable = document.querySelector("#plansTable");
const passesTable = document.querySelector("#passesTable");
const taskTable = document.querySelector("#taskTable");
const slavesTable = document.querySelector("#slavesTable");

//Kick location
const kickLocation = "C:/Program Files/Autodesk/Arnold/maya2023/bin"

// ----------- CREATE TABLES ----------- //
function addRow(rowObj){

    let row = document.createElement("tr");
    
    for (let [key, value] of rowObj){
        
        let cell = document.createElement("td");
        cell.innerText = value;
        row.appendChild(cell);
        row.appendChild(document.createElement("td")); //Cellule vide
        
    }
    
    return row;

}

function addAllRows(tableObj){

    if (tableObj.rows.length === 0){ //Check if table is empty
        return;
    }

    for (let rowObj of tableObj.rows){

        let row = addRow(rowObj);
        tableObj.table.appendChild(row);

    }

    selectRowListener(tableObj);
    doubleClickRowListener(tableObj);

}

function createAllTablesRows(tableObjList){

    for (let tableObj of tableObjList){

        addAllRows(tableObj);

    }

}

// ----------- COLOR ----------- //
function colorAllRowTexts(nodes, color){

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].nodeName.toLowerCase() === "td"){

            nodes[j].style.color = color; 

        } 

    }

}

function colorRowsByStatus(tableObj){

    let status;
    let nodes;

    for (let i = 0; i < tableObj.rows.length; i++){
            
        status = tableObj.rows[i].get("Status");
        nodes = tableObj.table.rows[i+2].childNodes;
        
        if (status === "Queued" || status === "Pending"){
            
            colorAllRowTexts(nodes, "#939393"); //Grey
            
        } else if (status === "Rendering"){
            
            colorAllRowTexts(nodes, "#EE9616"); //Orange         
            
        } else if (status === "Completed"){
            
        colorAllRowTexts(nodes, "#95ff8f"); //Green
        
        } else {
            
            colorAllRowTexts(nodes, "#E74D31") //Red
            
        }            
    
    }

}

function colorAllTablesRowsByStatus(tablesObjList){

    

    for (let tableObj of tablesObjList){
        
        if (tableObj.rows.length == 0){ //No Row in table
            continue;
        }

        if (!tableObj.rows[0].has("Status")){ // Table doesn't have Status
            continue;
        }


        colorRowsByStatus(tableObj);
            
        
    }

}

// ----------- CLEAR TABLES & ROWS ----------- //
function clearTable(tableObj){
    
    let nbRows = tableObj.table.rows.length;

    for (let i = 2; i < nbRows; i++){ //REMOVE ALL ROWS
        tableObj.table.deleteRow(-1);
    }
    
}

function clearAllTables(tablesObjList){

    for(let tableObj of tablesObjList){
        clearTable(tableObj);
    }

}

function clearAllTablesRows(tablesObjList){

    for(let tableObj of tablesObjList){

        tableObj.rows = [];

    }


}

// ----------- SAVE AND OPEN ----------- //
function createTablesData(tablesObjList){ //Create Datas to save

    let datas = "";

    for (let tableObj of tablesObjList){

        for(let row of tableObj.rows){

            datas += JSON.stringify(Array.from(row.entries())) + "*";

        }

        datas = datas.slice(0, -1);

        datas += "|";

    }
    
    return datas.slice(0, -1); //remove last "*|"

}

function getDataFromSave(saveText){

    const allLists = saveText.split("|");
    let AllDatas = [];

    for (let list of allLists){
        
        let row = list.split("*");
        let mapList = [];

        for (let element of row){

            let map = new Map(JSON.parse(element));
            mapList.push(map);

        }

        AllDatas.push(mapList);

    }
    

    return AllDatas;

}

function loadData(tableObjList, data){

    for(let i = 0; i < tableObjList.length; i++){

        tableObjList[i].rows = data[i];

    }

}

// ------------- ROW SELECTION ------------ //
function doubleClickRowListener(tableObj){

    if (tableObj.name != "Passes"){
        return;
    }

    let rows = tableObj.table.getElementsByTagName("tr");

    Array.from(rows).forEach((row, index) => {
        row.addEventListener("dblclick", () => {
             
            if (index >= 2){

                let sceneObjects = JSON.stringify(passesTableObj.visibilityLists[plansTableObj.rowSelected][index-2]);
                console.log(passesTableObj.visibilityLists[plansTableObj.rowSelected][index-2]);
                localStorage.setItem("sceneObjects", sceneObjects);
                let passesWindow = popupwindow("popups/passesPropertiesPopup.html", "Properties", 400, 800);
                
                passesWindow.addEventListener("load", () => {

                    
                    passesWindow.document.querySelector("#acceptBtn").addEventListener("click", () => {
                        
                        let returnSceneObjects = JSON.parse(localStorage.getItem("returnSceneObjects"));
                        passesTableObj.visibilityLists[plansTableObj.rowSelected][index-2] = returnSceneObjects;
                        
                        passesWindow.close();
                        
                        console.log(returnSceneObjects);
                        
                    });
                    
                });
            }
    
    
        });
    });


}

function selectRowListener(tableObj){

    let rows = tableObj.table.getElementsByTagName("tr");

    Array.from(rows).forEach((row, index) => {
        row.addEventListener("click", () => {
    
            let nodes;            
            let table = row.parentNode;

            for (let i = 0; i<table.rows.length; i++){ //Remove Selection of all rows
    
                nodes = table.rows[i].childNodes;
    
                for(let j = 0; j < nodes.length; j++){
                    
                    if (nodes[j].nodeName.toLowerCase() === "td"){
                        
                        nodes[j].classList.remove("selectRow");
            
                    }
            
                }
    
            }
    
    
            if (index >= 2){

                tableObj.rowSelected = index-2;

                if (tableObj.name === "Plans"){
                    console.log(tableObj.rows[index-2].get("Path"));

                    clearTable(passesTableObj); //Show passes for selected shot
                    passesTableObj.rows = passesTableObj.passesLists[index - 2];
                    addAllRows(passesTableObj);


                } else if (tableObj.name === "Slaves"){
                    console.log(tableObj.rows[index-2].get("Machine"));
                }
    
                nodes = row.childNodes;
    
                for(let j = 0; j < nodes.length; j++){ //Add Selection to the row
                    
                    if (nodes[j].nodeName.toLowerCase() === "td"){
                        
                        nodes[j].classList.add("selectRow");
            
                    }
            
                }
                
            }
    
    
        });
    });

}

// ------------- REMOVE ROW ------------ //
function removeSelectedRow(tableObj){

    if (tableObj.rowSelected === undefined || tableObj.rows.length === 0){ //No row Selected
        console.log("Noting selected");
        return;
    }

    console.log("Row Selected: " + tableObj.rowSelected.toString());
    tableObj.rows.splice(tableObj.rowSelected, 1);

    if (tableObj.name === "Plans"){
        plansTableObj.sceneObjects.splice(tableObj.rowSelected, 1);
        passesTableObj.passesLists.splice(tableObj.rowSelected, 1);
        clearTable(passesTableObj);


    }

    clearTable(tableObj);
    addAllRows(tableObj);
    if (tableObj.rows.length != 0){
        if (tableObj.rows[0].has("Status")){
            colorRowsByStatus(tableObj);
        }
    }

    tableObj.rowSelected = undefined;

}

// ------------- ADD NEW ROW ------------ //
function popupwindow(url, title, w, h) { // Open a new centered window
    let left = (screen.width/2)-(w/2);
    let top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
  } 

  function checkInput(input){
    if (!input.value){
        input.style.border = "1px solid #A6250D";
        return 1;
    }

    input.style.border = "2px solid #3a3a3a";
    return 0;
    
}

function checkAllInputs(inputs){

    let i =0;
    for (let input of inputs){

        i += checkInput(input);

    }

    return i;

}

// ----------- UTILITY ------------- //
function getAllObjects(text){

    let objects = [];

    let polyText = text;

    while (polyText.indexOf("polymesh") != -1){

        polyText = polyText.slice(polyText.indexOf("polymesh") + 18); //cut to Object Name 

        
        let objIndex = polyText.indexOf("/");
        let obj = {
                    type : "polymesh",
                    name: polyText.slice(0, objIndex), 
                    visibility : 0
                  };
        objects.push(obj);

    }

    let cameraText = text;

    let camNb = 0;

    while (cameraText.indexOf("persp_camera") != -1){

        cameraText = cameraText.slice(cameraText.indexOf("persp_camera") + 22); //cut to Object Name 

        
        let objIndex = cameraText.indexOf("\n");
        let obj = {
                    type : "camera",
                    name: cameraText.slice(0, objIndex), 
                    selected : 0
                  };

        if (camNb === 0){
            obj.selected = 1;
        }

        objects.push(obj);

        camNb += 1;

    }

    return objects;

}








// ----------- INIT TABLES ----------- //

let plansRow1Values = [
    ["Software", "Maya"],
    ["Path", "maya2325.ass"]
];

let plansTableObj = {
    name : "Plans",
    table : plansTable,
    rows : [],
    sceneObjects : [],
    rowSelected : undefined
};

// ----------- //
let passesTableObj = {
    name : "Passes",
    table : passesTable,
    passesLists : [],
    visibilityLists : [],
    rows : [],
    rowSelected : undefined
};

// ----------- //

let tasksRow1Values = [
    ["Name", "BattleOfMonCul.chaipa"],
    ["Frames", "1-100"],
    ["Status", "Queued"]
];

let tasksRow2Values = [
    ["Name", "adipa"],
    ["Frames", "1-100"],
    ["Status", "Completed"]
];

let tasksRow3Values = [
    ["Name", "Mashala"],
    ["Frames", "1-100"],
    ["Status", "Suspended"]
];

let tasksRow4Values = [
    ["Name", "Grof"],
    ["Frames", "1-100"],
    ["Status", "Queued"]
];

let tasksRow1Obj = new Map(tasksRow1Values);
let tasksRow2Obj = new Map(tasksRow2Values);
let tasksRow3Obj = new Map(tasksRow3Values);
let tasksRow4Obj = new Map(tasksRow4Values);


let taskTableObj = {
    name : "Task",
    table : taskTable,
    rows : [tasksRow1Obj, tasksRow2Obj, tasksRow3Obj, tasksRow4Obj],
    rowSelected : undefined
};

// ----------- //

let slavesRow1Values = [
    ["Machine", "Machine 1"],
    ["Frames", "None"],
    ["Status", "Offline"]
];

let slavesRow1Obj = new Map(slavesRow1Values);


let slavesTableObj = {
    name : "Slaves",
    table : slavesTable,
    rows : [slavesRow1Obj],
    rowSelected : undefined
};

// ----------- //

let tablesObjList = [plansTableObj, passesTableObj, taskTableObj, slavesTableObj];

clearAllTables(tablesObjList);
createAllTablesRows(tablesObjList);

colorAllTablesRowsByStatus(tablesObjList);




popupwindow("popups/passesPropertiesPopup.html", "Properties", 700, 800);




// ------------------ BUTTONS ------------------ //

// ------------------- SAVE OPEN BUTTONS -------------------------- //
const spawn = require("child_process").spawn; //Create spawn for python script


openNewBtn.addEventListener("click", () => { //Open New Button Popup

    clearAllTablesRows(tablesObjList);
    clearAllTables(tablesObjList)
    
});

saveBtn.addEventListener("click", () => { //Save Button

    const data_to_pass = createTablesData(tablesObjList);
    const saveProcess = spawn('python',["scripts/save.py", data_to_pass]);
    saveProcess.stdout.on('data', (data) => {
        console.log(data.toString('utf8'));
    });
   
    
});

openBtn.addEventListener("click", () => { //Open Button

    const openProcess = spawn('python',["scripts/open.py"]);
    openProcess.stdout.on('data', (data) => {
        let datas = getDataFromSave(data.toString('utf8'));

        loadData(tablesObjList, datas),
        clearAllTables(tablesObjList);
        createAllTablesRows(tablesObjList);

        colorAllTablesRowsByStatus(tablesObjList);

    });
    

});




// ------------------- REMOVE BUTTON -------------------------- //
plansRemoveBtn.addEventListener("click", () => { //REMOVE PLANS ROW


    removeSelectedRow(plansTableObj);

});

slavesRemoveBtn.addEventListener("click", () => { //REMOVE SLAVES ROW

    removeSelectedRow(slavesTableObj);

});

passesRemoveBtn.addEventListener("click", () => { //REMOVE PASSES ROW

    removeSelectedRow(passesTableObj);

});

taskRemoveBtn.addEventListener("click", () => { //REMOVE PASSES ROW

    removeSelectedRow(taskTableObj);

});



// ------------------- ADD BUTTON -------------------------- //
plansAddBtn.addEventListener("click", () => { //Add plans row Button

    let addWindow = popupwindow("popups/plansPropertiesPopup.html", "Properties", 400, 200); //400*200

    addWindow.addEventListener("load", () => { //Wait for the Add window to load 

        let fileInput = addWindow.document.querySelector("#fileInput");
        let addAcceptBtn = addWindow.document.querySelector("#acceptBtn");

        addAcceptBtn.addEventListener("click", () => { //Accept

            let allInputs = [fileInput];

            if(!checkAllInputs(allInputs)){ //Check if all inputs are filled

                addWindow.close();

                let path = fileInput.value.replaceAll("\\", "/");

                let row = [
                    ["Software", "Maya"],
                    ["Path", path]
                ];

                let newRow = new Map(row);
                plansTableObj.rows.push(newRow);
                clearTable(plansTableObj);
                addAllRows(plansTableObj);

                plansTableObj.rowSelected = undefined;

                if (passesTableObj.passesLists.length < plansTableObj.rows.length){
                    passesTableObj.passesLists.push([]); //Add empty list for new passes
                }

                if (passesTableObj.visibilityLists.length < plansTableObj.rows.length){
                    passesTableObj.visibilityLists.push([]); //Add empty list for new passes visibility
                }



                

            }

        });

    }, true);

    
});

slavesAddBtn.addEventListener("click", () => { //Add Slave machine

    let addWindow = popupwindow("popups/slavesPropertiesPopup.html", "Properties", 400, 200); //400*200

    addWindow.addEventListener("load", () => { //Wait for the Add window to load 

        let slaveInput = addWindow.document.querySelector("#slaveInput");
        let addAcceptBtn = addWindow.document.querySelector("#acceptBtn");

        addAcceptBtn.addEventListener("click", () => { //Accept

            let allInputs = [slaveInput];

            if(!checkAllInputs(allInputs)){ //Check if all inputs are filled

                addWindow.close();
                
                let name = slaveInput.value;

                let row = [
                    ["Machine", name],
                    ["Frame", "None"],
                    ["Status", "Offline"]
                ];

                let newRow = new Map(row);
                slavesTableObj.rows.push(newRow);
                clearTable(slavesTableObj);
                addAllRows(slavesTableObj);
                colorRowsByStatus(slavesTableObj);

                slavesTableObj.rowSelected = undefined;

            }

        });

    }, true);

});

passesAddBtn.addEventListener("click", () => { //Add Slave machine

    if (plansTableObj.rowSelected === undefined){
        console.log("No plans Selected");
        return;
    }

    let addWindow = popupwindow("popups/addPassesPopup.html", "Properties", 400, 200); //400*200

    addWindow.addEventListener("load", () => { //Wait for the Add window to load 

        let passesInput = addWindow.document.querySelector("#passesInput");
        let addAcceptBtn = addWindow.document.querySelector("#acceptBtn");

        addAcceptBtn.addEventListener("click", () => { //Accept

            let allInputs = [passesInput];

            if(!checkAllInputs(allInputs)){ //Check if all inputs are filled

                addWindow.close();
                
                let name = passesInput.value;

                let row = [
                    ["Name", name],
                    ["Status", "Pending"],
                    ["Progress", "0% (0/100)"],
                    ["Frames", "1-100"]
                ];

                let newRow = new Map(row);
                passesTableObj.passesLists[plansTableObj.rowSelected].push(newRow);
                clearTable(passesTableObj);
                addAllRows(passesTableObj);
                colorRowsByStatus(passesTableObj);
                passesTableObj.rowSelected = undefined;

                let path = plansTableObj.rows[plansTableObj.rowSelected].get("Path");

                fetch(path)
                    .then((res) => res.text())
                    .then((text) => {

                        let sceneObjects = getAllObjects(text);
                        passesTableObj.visibilityLists[plansTableObj.rowSelected].push(sceneObjects);


                    });

            }

        });

    }, true);

});


renderBtn.addEventListener("click", () => {

    if (passesTableObj.rowSelected === undefined){ //Check if nothing is selected
        console.log("Nothing Selected")
        return;
    }

    let sceneSettings = passesTableObj.visibilityLists[plansTableObj.rowSelected][passesTableObj.rowSelected];

    let command = JSON.stringify({kick : kickLocation, path: plansTableObj.rows[plansTableObj.rowSelected].get("Path"), settings: sceneSettings});

    // console.log(command);

    const renderProcess = spawn('python',["scripts/render.py", command]);
    renderProcess.stdout.on('data', (data) => {
        console.log(data.toString('utf8'));
    });

});