// Save Box Buttons variables
const openNewBtn = document.querySelector("#openNewBtn");
const saveBtn = document.querySelector("#saveBtn");
const openBtn = document.querySelector("#openBtn");

// Save Box Buttons Events
openNewBtn.addEventListener("click", () => {

    alert("OPEN NEW");
    
});

saveBtn.addEventListener("click", () => {

    alert("SAVE");
    
});

openBtn.addEventListener("click", () => {

    alert("OPEN");

});


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

// All table variables
const plansTable = document.querySelector("#plansTable");
const passesTable = document.querySelector("#passesTable");
const taskTable = document.querySelector("#taskTable");
const slavesTable = document.querySelector("#slavesTable");

// Color row on startup
colorEvenRow(plansTable);
colorEvenRow(passesTable);
colorEvenRow(taskTable);
colorEvenRow(slavesTable);

// Color by Status
function colorAllTexts(nodes, color){

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].nodeName.toLowerCase() === "td"){

            nodes[j].style.color = color; 

        } 

    }

}

function colorStatus(nodes){

    console.log(nodes);

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].className === "Status"){
            
            if (nodes[j].innerText === "Queued"){

                colorAllTexts(nodes, "#479449");//White
                return;

            } 

            if (nodes[j].innerText === "Rendering"){ //Rendering

                colorAllTexts(nodes, "#95ff8f"); //Light green
                return;

            }

            
            colorAllTexts(nodes, "#d9d9d9"); //Green
            return;

        }

    }


}

function colorByStatus(table){

    for (let i=2; i < table.rows.length; i++){

        let nodes = table.rows[i].childNodes;

        colorStatus(nodes);


    }


}

colorByStatus(passesTable);
colorByStatus(taskTable);
colorByStatus(slavesTable);