// Define all the constants and variables
// Select the input HTML element that contains all the button
const input_button_elem = document.querySelector(".input")
// Select the display HTML element to alter the innerHTML 
const output_display_elem = document.querySelector(".display")
// Select the value HTML element to alter the innerHTML 
const output_ans_elem  = document.querySelector(".value")
// To store the previously calculated value
var ans = 0;
// To store Memory value
var M = 0;
// 
memory ={
    operation: [],
    formula: [],
}

modes = [];

input_button_elem.addEventListener("click", event =>{
    const target = event.target;
    const symbol = target.getAttribute('symbol')
    const formula = target.getAttribute('formula');
    const type = target.getAttribute('type')

    if (target.hasAttribute('type')){
        /*
        When the user press an operator immediately after calculating a value (eg. after performing 9+9 and click the = button to get a result of 18,
        the calculator allow the user to continue the calculation by performing the operation on the Ans (previously calculated value) )
        If press + right after pressing = button, the display will become Ans + 
        */
        if(getOutput_ans() != "" && type == "operator"){
            clearAll()
            updateDisplay('Ans','ans')
            updateDisplay(symbol,formula)
        }else{
            /*
            This condition allow the user to enter new operation right after a calculation wihtou clicking on the AC button
            (eg. after performing 9+9 and click the = button to get a result of 18, user can press on a function like sin(
            or a number like 9 and the calculator will clear automatically without pressing the AC button 
            */
            if(getOutput_ans() != "" && (type == "num" || type == "func" || type == "trigo") ) clearAll()
            // This condition allow all the button with a symbol attribute to be added on the display
            // The only button with symbols are numbers, functions, operators and trigofunction
            if(target.hasAttribute("symbol")) updateDisplay(symbol,formula)
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
        try {
            result =  eval(str);
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Handle syntax error
                alert('Syntax Error')
                console.error('Syntax Error:', error.message);
            } else {
                // Handle other types of errors
                console.error('An error occurred:', error);
            }
        }
        setAns(result);
        updateResult(result);
    }else (console.log("Nothing to calculate"))
}

// Define a regular expression pattern to match function/operator strings
// / /g sin\( represent sin( separated by |
var pattern = /(ln\(|log\(|sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|sqrt\(|log\(|exp\(|\^|\+|\-|\*|\/|\(|\)|\√\(|[1-9])/g;

function del(){
    var currentValue = getOutput_display();

    // Use a regular expression to find matches in the currentValue
    var matches = currentValue.match(pattern);

    if (matches && matches.length > 0) {
        // If there are matches, remove the last match from the currentValue
        var new_str = currentValue.slice(0, currentValue.lastIndexOf(matches[matches.length - 1]));
        setOutput_display(new_str);
        popMem();
    } else {
        console.log("Nothing to remove");
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
            calculate();
            setM(getM() + parseInt(getOutput_ans()))
            break;
        case "minus":
            calculate();
            setM(getM() - getOutput_ans())
            break;
        case "clear":
            setM(0)
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

function getM(){
    return M;
}

function setM(value){
    M = value;
}

// from https://stackoverflow.com/questions/6399777/looking-for-derivative-script

function derivation (f, x, dx) {
    dx = dx || .00000009;
    return (f(x+dx) - f(x)) / dx;
}


function numberSystem(type){
    const noCalculatedValue = getOutput_ans() == ""
    if(noCalculatedValue){
        console.log("nothing to change")
    }else{

    }
}

function power(){
    return '**';
}

function dec2bin(value){

}

function dec2hex(value){
    // Define all the possible char for hexadecimal 
    const hexChars = "0123456789ABCDEF";
      
    // Define variables for the result
    var result = "";
    
    // Convert decimal into hexadecimal
    while (parseInt(value) > 0) {
        var remainder = num % 16;
        result = hexChars[remainder] + result;
        num = Math.floor(num / 16);
    }
}

function dec2oct(value){

}

function bin2dec(value){

}

function hex2dec(value){

}

function oct2dec(value){

}