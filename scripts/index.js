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

// All table variables
const plansTable = document.querySelector("#plansTable");
const passesTable = document.querySelector("#passesTable");
const taskTable = document.querySelector("#taskTable");
const slavesTable = document.querySelector("#slavesTable");

const allTables = [plansTable, passesTable, taskTable, slavesTable];



// Color Even Row 
function colorTd(nodes, color){

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].nodeName.toLowerCase() === "td"){

            nodes[j].style.background = color; 

        } 

    }

}


function colorEvenRow(table){

    for (let i=2; i < table.rows.length; i++){

        let nodes = table.rows[i].childNodes;

        if (i % 2 === 1){
            
            colorTd(nodes, "#292929");
            
        } else {

            colorTd(nodes, "#1a1a1a");

        }

    }

}

// Clear All Tables
function clearTable(table){
    
    const rowsNb = table.rows.length
    
    for (let i = 2; i < rowsNb; i++){ //REMOVE ALL ROWS
        table.deleteRow(-1);
    }
    
}

function clearAllTables(tables){

    for(let table of tables){
        clearTable(table);
    }

}


clearAllTables(allTables);

// Create rowsList for Passes Table
let baseColorValues = [
    ["Name", "BaseColor.bc"],
    ["Status", "Rendering"],
    ["Progress", "80% (80/100)"],
    ["Frames", "1-100"]
];

let depthValues = [
    ["Name", "depth.z"],
    ["Status", "Completed"],
    ["Progress", "100% (100/100)"],
    ["Frames", "1-100"]
];

let passesList = [
    new Map(baseColorValues),
    new Map(depthValues)
];

// Create rowsList for Plans Table
let plan1Values = [
    ["Software", "Maya"],
    ["Path", "Test_plan1"]
];

let plan2Values = [
    ["Software", "Maya"],
    ["Path", "Gros"]
];

let plan3Values = [
    ["Software", "Maya"],
    ["Path", "CavaOuQuoi"]
];

let plansList = [
    new Map(plan1Values),
    new Map(plan2Values),
    new Map(plan3Values)
];

// Create rowsList for Tasks Table
let task1Values = [
    ["Name", "BattleOfMonCul.baseColor"],
    ["Frames", "1-100"],
    ["Status", "Completed"]
];

let task2Values = [
    ["Name", "BattleOfMonCul.depth.z"],
    ["Frames", "1-100"],
    ["Status", "Rendering"]
];

let task3Values = [
    ["Name", "BattleOfMonCul.chaipa"],
    ["Frames", "1-100"],
    ["Status", "Queued"]
];


let tasksList = [
    new Map(task1Values),
    new Map(task2Values),
    new Map(task3Values)
];

// Create rowsList for Slaves Table
let slaves1Values = [
    ["Machine", "Machine 1"],
    ["Frames", "None"],
    ["Status", "Offline"]
];

let slaves2Values = [
    ["Machine", "Machine 2"],
    ["Frames", "None"],
    ["Status", "Offline"]
];

let slaves3Values = [
    ["Machine", "Machine 3"],
    ["Frames", "1-100 (50%)"],
    ["Status", "Rendering"]
];


let slavesList = [
    new Map(slaves1Values),
    new Map(slaves2Values),
    new Map(slaves3Values)
];

let allLists = [plansList, passesList, tasksList, slavesList];

// Create Rows
function createRow(propertiesMap){
    
    let row = document.createElement("tr");
    
    for (let [key, value] of propertiesMap){
        
        let cell = document.createElement("td");
        cell.innerText = value;
        row.appendChild(cell);
        row.appendChild(document.createElement("td")); //Cellule vide
        
    }
    
    return row;
    
}

function createRows(table, rowsList){

    if (rowsList.length > 0){ //Check if table is empty

        let row;

        for (let i of rowsList){

            row = createRow(i);
            table.appendChild(row);

        }

    }    

}

function createAllRows(tables, lists){

    for(let i = 0; i<tables.length; i++){

        createRows(tables[i], lists[i]);

    }


}


createAllRows(allTables, allLists);


// Color Row by Status
function colorAllTexts(nodes, color){

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].nodeName.toLowerCase() === "td"){

            nodes[j].style.color = color; 

        } 

    }

}

function colorByStatus(table, rowList){

    let status;
    let nodes;

    for (let i = 0; i < rowList.length; i++){

        status = rowList[i].get("Status");
        nodes = table.rows[i+2].childNodes;

        if (status === "Queued"){

            colorAllTexts(nodes, "#939393"); //Grey
            
        } else if (status === "Rendering"){

            colorAllTexts(nodes, "#EE9616"); //Orange         
            
        } else if (status === "Completed"){

            colorAllTexts(nodes, "#95ff8f"); //Green

        } else {

            colorAllTexts(nodes, "#E74D31") //Red

        }


    }


}

function colorAllTables(tables, lists){

    for (let i = 0; i<tables.length; i++){

        if (lists[i].length > 0){//Check if table is empty

            if (lists[i][0].get("Status") != undefined){
                colorByStatus(tables[i], lists[i]);
            }
            colorEvenRow(tables[i]);
            
        }

    }


}

colorAllTables(allTables, allLists)



function createTablesDatas(lists){ //Create Datas to save

    let datas = "";
    for (let list of lists){

        for(let map of list){

            datas += JSON.stringify(Array.from(map.entries())) + "*";

        }

        datas = datas.slice(0, -1);

        datas += "|";

    }

    return datas.slice(0, -1); //remove last "*|"

}

function getDatasFromSave(saveText){

    const allLists = saveText.split("|");
    let AllDatas = [];

    for (let list of allLists){
        
        const row = list.split("*");
        let mapList = [];

        for (let element of row){

            let map = new Map(JSON.parse(element));
            mapList.push(map);

        }

        AllDatas.push(mapList);

    }
    

    return AllDatas;

}



function clearAllLists(){

    plansList = [];
    passesList = [];
    tasksList = [];
    slavesList = [];

    allLists = [plansList, passesList, tasksList, slavesList]

}




// ------------------- SAVE OPEN BUTTONS -------------------------- //
const spawn = require("child_process").spawn; //Create spawn for python script


openNewBtn.addEventListener("click", () => { //Open New Button Popup


    clearAllLists();
    clearAllTables(allTables);

    
});

saveBtn.addEventListener("click", () => { //Save Button

    const data_to_pass = createTablesDatas(allLists);
    const saveProcess = spawn('python',["scripts/save.py", data_to_pass]);
    saveProcess.stdout.on('data', (data) => {
        console.log(data.toString('utf8'));
    });
   
    
});

openBtn.addEventListener("click", () => { //Open Button

    const openProcess = spawn('python',["scripts/open.py"]);
    openProcess.stdout.on('data', (data) => {
        let datas = getDatasFromSave(data.toString('utf8'));

        clearAllTables(allTables);
        createAllRows([plansTable, passesTable, taskTable, slavesTable], datas);
        colorAllTables(allTables, datas);

    });
    

});





// ------------------- REMOVE BUTTON -------------------------- //

// ------------------- SELECT ROW -------------------------- //
let plansRows = plansTable.getElementsByTagName("tr");
let plansRowSelected;

let slavesRows = slavesTable.getElementsByTagName("tr");
let slavesRowSelected;

function selectRowListener(rows, tableName){

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

                if (tableName === "plansTable"){                    
                    plansRowSelected = index-2;
                    console.log(plansList[index-2].get("Path"));
                } else if (tableName === "slavesTable"){
                    slavesRowSelected = index-2;
                    console.log(slavesList[index-2].get("Machine"));
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

selectRowListener(plansRows, "plansTable")
selectRowListener(slavesRows, "slavesTable")

plansRemoveBtn.addEventListener("click", () => { //REMOVE PLANS ROW


    if (plansRowSelected === undefined || plansList.length === 0){ //No row Selected
        console.log("Noting selected");
        return;
    }

    console.log("Row Selected: " + plansRowSelected.toString());
    console.log(plansList);
    plansList.splice(plansRowSelected, 1);

    clearTable(plansTable);
    createRows(plansTable, plansList);
    colorAllTables([plansTable], [plansList]);

    plansRows = plansTable.getElementsByTagName("tr");
    selectRowListener(plansRows, "plansTable")

    plansRowSelected = undefined;

});

slavesRemoveBtn.addEventListener("click", () => { //REMOVE SLAVES ROW


    if (slavesRowSelected === undefined || slavesList.length === 0){ //No row Selected
        console.log("Noting selected");
        return;
    }

    console.log("Row Selected: " + slavesRowSelected.toString());
    console.log(slavesList);
    slavesList.splice(slavesRowSelected, 1);

    clearTable(slavesTable);
    createRows(slavesTable, slavesList);
    colorAllTables([slavesTable], [slavesList]);

    slavesRows = slavesTable.getElementsByTagName("tr");
    selectRowListener(slavesRows, "slavesTable")

    slavesRowSelected = undefined;

});



//------------- ADD BUTTON ---------------- //

function popupwindow(url, title, w, h) { // Open a new centered window
    let left = (screen.width/2)-(w/2);
    let top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
  } 

function checkAllInputs(inputs){

    let i =0;
    for (let input of inputs){

        i += checkInput(input);

    }

    return i;

}

function checkInput(input){
    if (!input.value){
        input.style.border = "1px solid #A6250D";
        return 1;
    }

    input.style.border = "2px solid #3a3a3a";
    return 0;
    
}

plansAddBtn.addEventListener("click", () => { //Add plans row Button

    let addWindow = popupwindow("popups/plansPropertiesPopup.html", "Porperties", 400, 200); //400*200

    addWindow.addEventListener("load", () => { //Wait for the Add window to load 

        const fileInput = addWindow.document.querySelector("#fileInput");
        const addAcceptBtn = addWindow.document.querySelector("#acceptBtn");

        addAcceptBtn.addEventListener("click", () => { //Accept

            const allInputs = [fileInput];

            if(!checkAllInputs(allInputs)){ //Check if all inputs are filled

                addWindow.close();

                let path = fileInput.value;


                let row = [
                    ["Software", "Maya"],
                    ["Path", path]
                ];

                const newRow = new Map(row);
                plansList.push(newRow);
                clearTable(plansTable);
                createRows(plansTable, plansList);
                colorAllTables([plansTable], [plansList]);

                plansRows = plansTable.getElementsByTagName("tr");
                selectRowListener(plansRows, "plansTable")
                plansRowSelected = undefined;

            }

        });

    }, true);

    
});

slavesAddBtn.addEventListener("click", () => { //Add Slave machine

    let addWindow = popupwindow("popups/slavesPropertiesPopup.html", "Porperties", 400, 200); //400*200

    addWindow.addEventListener("load", () => { //Wait for the Add window to load 

        const slaveInput = addWindow.document.querySelector("#slaveInput");
        const addAcceptBtn = addWindow.document.querySelector("#acceptBtn");

        addAcceptBtn.addEventListener("click", () => { //Accept

            const allInputs = [slaveInput];

            if(!checkAllInputs(allInputs)){ //Check if all inputs are filled

                addWindow.close();
                
                let name = slaveInput.value;

                let row = [
                    ["Machine", name],
                    ["Frame", "None"],
                    ["Status", "Offline"]
                ];

                const newRow = new Map(row);
                slavesList.push(newRow);
                clearTable(slavesTable);
                createRows(slavesTable, slavesList);
                colorAllTables([slavesTable], [slavesList]);

                slavesRows = slavesTable.getElementsByTagName("tr");
                selectRowListener(slavesRows, "slavesTable")
                slavesRowSelected = undefined;

            }

        });

    }, true);

});
