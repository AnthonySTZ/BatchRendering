const { stringify } = require("querystring");

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

//Output File
const outputFileBtn = document.querySelector("#outputFileBtn");
const outputFileInput = document.querySelector("#outputFileInput");

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

let rendersQueue = [];
let isRendering = false;

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
        
        if (status === "Queued"){

            colorAllRowTexts(nodes, "#DFDF33"); //Yellow

        }else if (status === "Pending"){
            
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

function createSaveData(){

    let data = [];

    let plansDataList = [];

    for (let row of plansTableObj.rows){ // PLAN rows data 

        plansDataList.push(Array.from(row.entries()));

    }
    

    data.push(plansDataList);

    // ^^ Ca a l'air bon en haut ^^

    let passesData = []; //[Settings, Names]

    let sceneSettingsDataList = [];

    for (let i=0; i<passesTableObj.sceneSettingsLists.length; i++){ // Passes sceneSettingsLists data

        sceneSettingsDataList.push([]);

        for (let j=0; j<passesTableObj.sceneSettingsLists[i].length; j++){

            sceneSettingsDataList[i].push([]);

            for (let settings of passesTableObj.sceneSettingsLists[i][j]){

                sceneSettingsDataList[i][j].push(Array.from(Object.entries(settings).entries()));

            }

        }

    }

    passesData.push(sceneSettingsDataList);
    
    let passesNameDataList = [];

    for (let i=0; i<passesTableObj.passesLists.length; i++){ // Passes Name data

        passesNameDataList.push([]);

        for (let j=0; j<passesTableObj.passesLists[i].length; j++){

            passesNameDataList[i].push(passesTableObj.passesLists[i][j].get("Name"));
           

        }

    }

    passesData.push(passesNameDataList);
    
    data.push(passesData);

    
    let dataStringify = JSON.stringify(data);
    console.log(data)
    console.log(dataStringify);

    return dataStringify;

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

                let sceneObjects = JSON.stringify(passesTableObj.sceneSettingsLists[plansTableObj.rowSelected][index-2]);
                console.log(passesTableObj.sceneSettingsLists[plansTableObj.rowSelected][index-2]);
                localStorage.setItem("sceneObjects", sceneObjects);
                let passesWindow = popupwindow("popups/passesPropertiesPopup.html", "Properties", 700, 800);
                
                passesWindow.addEventListener("load", () => {

                    
                    passesWindow.document.querySelector("#acceptBtn").addEventListener("click", () => {
                        
                        let returnSceneObjects = JSON.parse(localStorage.getItem("returnSceneObjects"));
                        passesTableObj.sceneSettingsLists[plansTableObj.rowSelected][index-2] = returnSceneObjects;

                        let frameStart = returnSceneObjects[0].frameStart
                        let frameEnd = returnSceneObjects[0].frameEnd
                        let frameRange = frameStart.toString() + "-" + frameEnd.toString();
                        let framePercent = "0%(" + frameRange + ")"; 

                        passesTableObj.passesLists[plansTableObj.rowSelected][passesTableObj.rowSelected].set("Frames", frameRange);
                        passesTableObj.table.rows[passesTableObj.rowSelected+2].getElementsByTagName("td")[6].innerText = frameRange;
                        passesTableObj.table.rows[passesTableObj.rowSelected+2].getElementsByTagName("td")[4].innerText = framePercent;
                        
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
                    colorRowsByStatus(passesTableObj);

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

    if (tableObj.name === "Passes"){

        if(passesTableObj.passesLists[plansTableObj.rowSelected][passesTableObj.rowSelected].get("Status") === "Rendering"){

            passesTableObj.passesLists[plansTableObj.rowSelected][passesTableObj.rowSelected].set("Status", "Suspended");
            rendersQueue[0].status = "Suspended";

            clearTable(tableObj);
            addAllRows(tableObj);
            colorRowsByStatus(tableObj);
            setTasksList();
            return;

        }

        if(passesTableObj.passesLists[plansTableObj.rowSelected][passesTableObj.rowSelected].get("Status") === "Queued"){

            for(let i = 0; i<rendersQueue.length; i++){

                if (rendersQueue[i].passesSelected === passesTableObj.rowSelected){

                    if (rendersQueue[i].planSelected === plansTableObj.rowSelected){

                        passesTableObj.passesLists[plansTableObj.rowSelected][passesTableObj.rowSelected].set("Status", "Suspended");
                        rendersQueue.splice(i, 1);
                        clearTable(tableObj);
                        addAllRows(tableObj);
                        colorRowsByStatus(tableObj);
                        setTasksList();
                        return;

                    }

                }

            }

        }

        if (passesTableObj.passesLists[plansTableObj.rowSelected][passesTableObj.rowSelected].get("Status") === "Pending" && !isRendering){
            passesTableObj.passesLists[plansTableObj.rowSelected].splice(tableObj.rowSelected, 1);
            passesTableObj.sceneSettingsLists[plansTableObj.rowSelected].splice(tableObj.rowSelected, 1);
        }


    }

    if(isRendering){

        console.log("Wait for all renders to finish before removing rows");
        return;

    }

    console.log("Row Selected: " + tableObj.rowSelected.toString());
    tableObj.rows.splice(tableObj.rowSelected, 1);

    if (tableObj.name === "Plans"){
        // plansTableObj.sceneObjects.splice(tableObj.rowSelected, 1);
        passesTableObj.passesLists.splice(tableObj.rowSelected, 1);
        passesTableObj.sceneSettingsLists.splice(tableObj.rowSelected, 1);
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

    let options = {
        type: "options",
        frameStart: 1,
        frameEnd: 5
    }

    objects.push(options);

    let polyText = text;

    let nameObjList = [];

    while (polyText.indexOf("polymesh") != -1){

        polyText = polyText.slice(polyText.indexOf("polymesh") + 18); //cut to Object Name 

        let objPathIndex = polyText.indexOf("\n")
        let objIndex = polyText.indexOf("/");
        let obj = {
                    type : "polymesh",
                    name: polyText.slice(0, objIndex), 
                    path: [polyText.slice(0, objPathIndex)], 
                    visibility : 0
                  };

        if (!nameObjList.includes(obj.name)){

            nameObjList.push(obj.name);
            console.log(obj.name);
            console.log(obj.name);
            objects.push(obj);
        } else {

            let index = nameObjList.indexOf(obj.name);
            objects[index].path.push(polyText.slice(0, objPathIndex));

        }


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

    


    let resolution = {
        type: "resolution",
        x: 1920,
        y: 1080
    };

    let renderSamples = {
        type: "renderSamples",
        camera: 3,
        diffuse: 2,
        specular: 2,
        transmission: 2,
        sss: 2,
        volume: 2
    };

    let renderDepth = {
        type: "renderDepth",
        total: 10,
        diffuse: 1,
        specular: 1,
        transmission: 8,
        volume: 0,
        transparency: 10
    };

    
    objects.push(resolution);
    objects.push(renderSamples);
    objects.push(renderDepth);

    return objects;

}



// RENDER //
function setTasksList(){

    taskTableObj.rows = []; //Reset Tasks
 
    let name;
    let framesText;
    let status;
    for (let render of rendersQueue){


        let currentFrame = render.currentFrame;
        let endFrame = render.endFrame;
        let nbFrames = render.nbFrames;
        let currentFrameNb = currentFrame - (endFrame - nbFrames) - 1;
        let percentFrame = parseInt(currentFrameNb * 100 / nbFrames);
        framesText = percentFrame.toString() + "%(" + currentFrameNb.toString() + "-" + nbFrames.toString() + ")";



        name = passesTableObj.passesLists[render.planSelected][render.passesSelected].get("Name");
        status = render.status;

        let taskRow = [
            ["Name", name],
            ["Frames", framesText],
            ["Status", status]
        ];

        let taskMap = new Map(taskRow);
        taskTableObj.rows.push(taskMap);

    } 

    clearTable(taskTableObj);
    addAllRows(taskTableObj);
    colorRowsByStatus(taskTableObj);

}

function setPassesStatus(plansRowSelected, passesRowSelected, status){

    passesTableObj.passesLists[plansRowSelected][passesRowSelected].set("Status", status);
    clearTable(passesTableObj);
    addAllRows(passesTableObj);

    colorRowsByStatus(passesTableObj);

}

function setPassesProgress(plansRowSelected, passesRowSelected, currentFrame, endFrame, nbFrames){

    let currentFrameNb = currentFrame - (endFrame - nbFrames);
    let percentFrame = parseInt(currentFrameNb * 100 / nbFrames);
    let progressText = percentFrame.toString() + "%(" + currentFrameNb.toString() + "-" + nbFrames.toString() + ")";


    passesTableObj.passesLists[plansRowSelected][passesRowSelected].set("Progress", progressText);
    clearTable(passesTableObj);
    addAllRows(passesTableObj);
    colorRowsByStatus(passesTableObj);

}

function renderCurrent(planSelected, passesSelected, currentFrame, endFrame, nbFrames){

    if(rendersQueue[0].status === "Suspended"){
        rendersQueue.shift();
        initCurrentRender();
        return;
    }

    let sceneSettings = passesTableObj.sceneSettingsLists[planSelected][passesSelected];
    let fileOutputPath = outputFileInput.value;
    let fileOutputName = passesTableObj.passesLists[planSelected][passesSelected].get("Name");

    let command = JSON.stringify({
        kick : kickLocation,
        path: plansTableObj.rows[planSelected].get("Path"),
        frame: currentFrame,
        planName: plansTableObj.rows[planSelected].get("Path"),
        fileOutputPath: fileOutputPath,
        fileOutputName: fileOutputName,
        settings: sceneSettings
    });

    const renderProcess = spawn('python',["scripts/render.py", command]);
    renderProcess.stdout.pipe(process.stdout);

    renderProcess.on('exit', function() {

        rendersQueue[0].currentFrame += 1;
        setPassesProgress(planSelected, passesSelected, currentFrame, endFrame, nbFrames);        
        setTasksList();


        if(currentFrame<endFrame){ 
            renderCurrent(planSelected, passesSelected, currentFrame+1, endFrame, nbFrames);
            return;
        }

        // If passes Finished
        setPassesStatus(planSelected, passesSelected, "Completed");

        rendersQueue.shift();
        initCurrentRender();

    });


}


function initCurrentRender(){

    if (rendersQueue.length === 0){
        console.log("nothing to render");
        isRendering = false;
        setTasksList();
        return;
    }

    // example of renderObj
    // {
    //     planSelected: plansTableObj.rowSelected,
    //     passesSelected: passesTableObj.rowSelected,
    //     currentFrame: startFrame,
    //     startFrame: startFrame,
    //     endFrame: endFrame,
    //     nbFrames: nbFrames,
    //     status: "Queued"
    // }

    let planSelected = rendersQueue[0].planSelected;
    let passesSelected = rendersQueue[0].passesSelected;

    let startFrame = rendersQueue[0].startFrame;
    let endFrame = rendersQueue[0].endFrame;
    let nbFrames = rendersQueue[0].nbFrames;

    setPassesStatus(planSelected, passesSelected, "Rendering");
    setPassesProgress(planSelected, passesSelected, startFrame-1, endFrame, nbFrames)


    isRendering = true;


    rendersQueue[0].status = "Rendering";
    setTasksList();

    renderCurrent(planSelected, passesSelected, startFrame, endFrame, nbFrames);


    
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
    rowSelected : undefined
};

// ----------- //
let passesTableObj = {
    name : "Passes",
    table : passesTable,
    passesLists : [],
    sceneSettingsLists : [],
    rows : [],
    rowSelected : undefined
};

// ----------- //

let tasksRow1Values = [
    ["Name", "BattleOfMonCul.chaipa"],
    ["Frames", "1-100"],
    ["Status", "Queued"]
];

let tasksRow1Obj = new Map(tasksRow1Values);

let taskTableObj = {
    name : "Task",
    table : taskTable,
    rows : [],
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
    rows : [],
    rowSelected : undefined
};

// ----------- //

let tablesObjList = [plansTableObj, passesTableObj, taskTableObj, slavesTableObj];

clearAllTables(tablesObjList);
createAllTablesRows(tablesObjList);

colorAllTablesRowsByStatus(tablesObjList);




// popupwindow("popups/passesPropertiesPopup.html", "Properties", 700, 800); // PASSES POPUP




// ------------------ BUTTONS ------------------ //

// ------------------- SAVE OPEN BUTTONS -------------------------- //
const spawn = require("child_process").spawn; //Create spawn for python script


openNewBtn.addEventListener("click", () => { //Open New Button Popup

    clearAllTablesRows(tablesObjList);
    clearAllTables(tablesObjList)
    
});

saveBtn.addEventListener("click", () => { //Save Button

    // const data_to_pass = createTablesData(tablesObjList);
    let dataToPass = createSaveData();

    // const saveProcess = spawn('python',["scripts/save.py", data_to_pass]);
    // saveProcess.stdout.on('data', (data) => {
    //     console.log(data.toString('utf8'));
    // });
   
    
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

                if (passesTableObj.sceneSettingsLists.length < plansTableObj.rows.length){
                    passesTableObj.sceneSettingsLists.push([]); //Add empty list for new passes visibility
                }

                // if (plansTableObj.sceneObjects.length < plansTableObj.rows.length){
                //     plansTableObj.sceneObjects.push([]);
                // }



                

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
                    ["Progress", "0% (0/5)"],
                    ["Frames", "1-5"]
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
                        passesTableObj.sceneSettingsLists[plansTableObj.rowSelected].push(sceneObjects);


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
    

    setPassesStatus(plansTableObj.rowSelected, passesTableObj.rowSelected, "Queued");

    let frames = passesTableObj.passesLists[plansTableObj.rowSelected][passesTableObj.rowSelected].get("Frames");
    let startFrame = parseInt(frames.slice(0, frames.indexOf("-")));
    let endFrame = parseInt(frames.slice(frames.indexOf("-")+1));
    let nbFrames = endFrame - startFrame + 1;

    let renderObj = {

        planSelected: plansTableObj.rowSelected,
        passesSelected: passesTableObj.rowSelected,
        currentFrame: startFrame,
        startFrame: startFrame,
        endFrame: endFrame,
        nbFrames: nbFrames,
        status: "Queued"

    };

    rendersQueue.push(renderObj);

    setTasksList();

    if (!isRendering){
        initCurrentRender();
    }

});



renderAllBtn.addEventListener("click", () => {

    if (passesTableObj.sceneSettingsLists[plansTableObj.rowSelected].length === 0){ //Check if nothing to render
        console.log("Nothing to render")
        return;
    }

    for (let i=0; i<passesTableObj.passesLists[plansTableObj.rowSelected].length; i++){

        let frames = passesTableObj.passesLists[plansTableObj.rowSelected][i].get("Frames");
        let startFrame = parseInt(frames.slice(0, frames.indexOf("-")));
        let endFrame = parseInt(frames.slice(frames.indexOf("-")+1));
        let nbFrames = endFrame - startFrame + 1;

        let renderObj = {

            planSelected: plansTableObj.rowSelected,
            passesSelected: i,
            currentFrame: startFrame,
            startFrame: startFrame,
            endFrame: endFrame,
            nbFrames: nbFrames,
            status: "Queued"

        };

        setPassesStatus(plansTableObj.rowSelected, i, "Queued");
        rendersQueue.push(renderObj);

    }

    setTasksList();

    if (!isRendering){
        initCurrentRender();
    }

});


// ------------------- OUTPUT FILE -------------------------- //
outputFileBtn.addEventListener("click", () => {

    const saveProcess = spawn('python',["scripts/select_folder.py"]);
    saveProcess.stdout.on('data', (data) => {

        data = data.toString('utf8');
        console.log(data);

        outputFileInput.value = data;


    });
   

});
