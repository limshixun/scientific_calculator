const input_button_elem = document.querySelector(".input")
const output_display_elem =document.querySelector(".display")
const output_ans_elem  =document.querySelector(".value")
const ans = 0;

memory ={
    operation: [],
    formula: []
}

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
    const currentValue = output_display_elem.value || '';
    setOutput_display_elem(currentValue + symbol);

    // allow the display to follow the content
    output_display_elem.scrollLeft = output_display_elem.scrollWidth;
    pushMem(symbol, formula)
}

function updateResult(value){
    setOutput_ans_elem(value)
    console.log("updateResult:", output_ans_elem.innerHTML)
    ans = value
}

function calculate(){
    if(memory.formula == []){
        const str = memory.formula.join("")
        console.log("formula: ", str)
        result =  eval(str);
        ans = result;
        updateResult(result);
    }else (console.log("Nothing to calculate"))
}

function del(){
    //var output_display_elem = document.querySelector('.display');
    var currentValue = output_display_elem.value;

    console.log(currentValue)
    if (currentValue.length > 0) {
        new_str = currentValue.slice(0, -1);
        setOutput_display_elem(new_str)
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
    var currentValue = output_display_elem.value;

    if (currentValue.length > 0) {
        setOutput_display_elem("")
        setOutput_ans_elem("")
        memory.operation = []
        memory.formula = []
        console.log(memory.operation)
        console.log(memory.formula)
    }else{
        console.log("Nothing to remove")
    }
}

function setOutput_display_elem(value){
    output_display_elem.value = value;
}

function setOutput_ans_elem(value){
    output_ans_elem.innerHTML = value;
}

function setAns(value){
    ans = value;
}