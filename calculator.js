const input_button_elem = document.querySelector(".input")
const output_display_elem =document.querySelector(".display")
const output_ans_elem  =document.querySelector(".value")
var ans = 0;

memory ={
    operation: [],
    formula: [],
    M: 0,
}

modes = [];

input_button_elem.addEventListener("click", event =>{
    const target = event.target;
    const symbol = target.getAttribute('symbol')
    const formula = target.getAttribute('formula');
    const type = target.getAttribute('type')

    if (target.hasAttribute('type')){
        if(type == "operator" || type == "num"){
            console.log("type: num || operator")
            updateDisplay(symbol,formula)
        }else if(type == "func"){
            console.log("type: func")
        }else if(type == 'trigo'){

        }
    }else{
        console.log("not")
    }
})

function updateDisplay(symbol, formula){
    const currentValue = getOutput_display() || '';
    setOutput_display(currentValue + symbol);

    // allow the display to follow the content
    output_display_elem.scrollLeft = output_display_elem.scrollWidth;
    pushMem(symbol, formula)
}

function updateResult(value){
    setOutput_ans(value)
    console.log("updateResult:", output_ans_elem.innerHTML)
    setAns(value);
}

function calculate(){
    if(memory.formula != []){
        const str = memory.formula.join("")
        console.log("formula: ", str)
        result =  eval(str);
        setAns(result);
        updateResult(result);
    }else (console.log("Nothing to calculate"))
}

function del(){
    //var output_display_elem = document.querySelector('.display');
    var currentValue = getOutput_display();

    console.log(currentValue)
    if (currentValue.length > 0) {
        new_str = currentValue.slice(0, -1);
        setOutput_display(new_str)
        popMem()
    }else{
        console.log("Nothing to remove")
    }
}

function pushMem(symbol, formula){
    memory.operation.push(symbol)
    memory.formula.push(formula)
    console.log(memory.operation)
    console.log(memory.formula)
}

function popMem(){
    memory.operation.pop()
    memory.formula.pop()
    console.log(memory.operation)
    console.log(memory.formula)
}

function clearAll(){
    var currentValue = getOutput_display();

    if (currentValue.length > 0) {
        setOutput_display("")
        setOutput_ans("")
        memory.operation = []
        memory.formula = []
        console.log(memory.operation)
        console.log(memory.formula)
    }else{
        console.log("Nothing to remove")
    }
}

function memoryOperation(value){
    switch (value) {
        case "plus":
            
            break;
        case "minus":
        
            break;
        case "store":
        
            break;
        case "recall":
        
            break;

        default:
            break;
    }
}

function setOutput_display(value){
    output_display_elem.innerHTML = value;
}

function getOutput_display(){
    return output_display_elem.innerHTML
}

function setOutput_ans(value){
    output_ans_elem.innerHTML = value;
}

function getOutput_ans(){
    return output_ans_elem.innerHTML
}

function setAns(value){
    ans = value;
}

function getAns(){
    return ans
}