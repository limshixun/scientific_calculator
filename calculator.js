// Define all the constants and variables
// Select the input HTML element that contains all the button
const input_button_elem = document.querySelector(".input")
// Select the display HTML element to alter the innerHTML 
const output_display_elem = document.querySelector(".display")
// Select the value HTML element to alter the innerHTML 
const output_ans_elem  = document.querySelector(".value")
//
const all_trigo_button = document.querySelectorAll("button[type='trigo']")
//
const num_sys_mode_elem = document.querySelector(".num_sys_mode")


// To store the previously calculated value
var ans = 0;
// To store Memory value
var M = 0;
// 
memory ={
    operation: [],
    formula: [],
}

var hyp = false;

modes = [];

input_button_elem.addEventListener("click", event =>{
    const target = event.target;
    const symbol = target.getAttribute('symbol')
    const formula = target.getAttribute('formula');
    const type = target.getAttribute('type')

    // conditions for paranthess multiplication
    // First get the previous inserted formula 
    const previous_formula = memory.formula[memory.formula.length -1];
    const multiply_before_parenthesis = Number.isInteger(parseInt(previous_formula)) && formula=="(";
    const multiply_after_parenthesis = previous_formula == ")" && Number.isInteger(parseInt(formula));
    const multiply_between_parenthesis = previous_formula == ")" && formula=="(";
    const multiply_before_trigo = Number.isInteger(parseInt(previous_formula)) && type=="trigo";
    const multiplication_conditions = multiply_before_trigo || multiply_before_parenthesis || multiply_after_parenthesis || multiply_between_parenthesis

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
        }else if (multiplication_conditions){
            new_symbol = symbol;
            new_formula = "*" + formula
            updateDisplay(new_symbol,new_formula)
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
        //var result = ""
        const str = memory.formula.join("")
        console.log("formula: ", str)
        try {
            //result =  eval(str);
            result = Function("return " + str)();
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Handle syntax error
                alert('Syntax Error:' + error.message)
                console.error('Syntax Error: ', error.message);
            } else {
                // Handle other types of errors
                console.error('An error occurred: '+ error);
            }
        }
        setAns(result);
        updateResult(result);
    }else (console.log("Nothing to calculate"))
}

// Define a regular expression pattern to match function/operator strings
// / /g sin\( represent sin( separated by |
var pattern = /(OR|AND|NOT\(|ln\(|log\(|sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|sinh\(|cosh\(|tanh\(|asinh\(|acosh\(|atanh\(|sqrt\(|log\(|exp\(|x|\^|\+|\-|\*|\/|\(|\)|\√\(|[1-9])/g;

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
        setNum_sys_mode("dec")
        setHyp(false)
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
            setM(0);
            clearAll();
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


function hyperbolic() {
    setHyp(!getHyp());
    const new_hyp = getHyp();
    const length = all_trigo_button.length;
    if(new_hyp == true){
        console.log(true)
        for (let index = 0; index < length; index++) {
            const element = all_trigo_button[index];
            formula = element.getAttribute("formula");
            symbol = element.getAttribute("symbol");
            
            inner = element.innerHTML;
            console.log(typeof formula)
            
            formula_length = formula.length 
            symbol_length = symbol.length
            new_formula = formula.slice(0,formula_length-1) + "h("
            new_symbol = symbol.slice(0,symbol_length-1) + "h("
            new_inner = inner + "h"

            element.setAttribute("formula", new_formula)
            element.setAttribute("symbol",new_symbol)
            element.innerHTML = new_inner
        }
    }else if(new_hyp == false){
        console.log(false)
        for (let index = 0; index < length; index++) {
            const element = all_trigo_button[index];
            formula = element.getAttribute("formula");
            symbol = element.getAttribute("symbol");
            
            inner = element.innerHTML;
            console.log(typeof formula)
            
            formula_length = formula.length 
            symbol_length = symbol.length

            new_formula = formula.slice(0,formula_length-2) + "("
            new_symbol = symbol.slice(0,symbol_length-2) + "("
            new_inner = inner.slice(0,inner.length-1)

            element.setAttribute("formula", new_formula)
            element.setAttribute("symbol",new_symbol)
            element.innerHTML = new_inner
        }
    }
}

function numberSystem(type){
    const noCalculatedValue = getOutput_ans() == ""
    if(noCalculatedValue){
        console.log("nothing to change")
    }else{
        currentNumber_System = getNum_sys_mode();
        const value = getOutput_ans();
        console.log("value" , value)
        var dec_num = 0;

        /*Convert everything to decimal first*/
        switch (currentNumber_System) {
            case "hex":
                dec_num = hex2dec(value)
                break;
            case "oct":
                dec_num = oct2dec(value)
                break;
            case "bin":
                dec_num = bin2dec(value)
                break;
            case "dec":
                dec_num = value;
                break;
        }
        console.log("dec_num" ,dec_num)
        switch (type) {
            case "hex":
                hex_num = dec2hex(dec_num)
                console.log(hex_num)
                setNum_sys_mode("hex")
                setOutput_ans(hex_num)
                console.log(typeof hex_num)
                break;
            case "oct":
                oct_num = dec2oct(dec_num)
                setNum_sys_mode("oct")
                setOutput_ans(oct_num)
                console.log(oct_num)
                console.log(typeof oct_num)
                break;
            case "bin":
                bin_num = dec2bin(dec_num)
                setNum_sys_mode("bin")
                setOutput_ans(bin_num)
                console.log(bin_num)
                break;
            case "dec":
                setNum_sys_mode("dec")
                setOutput_ans(dec_num)
                console.log(dec_num)
                break;
        }
    }
}


function dec2bin(value){
    // Define all the possible char for binary 
    const binChars = "01";
      
    // Define variables for the result
    var result = "";
    
    // Convert decimal into binary
    while (parseInt(value) > 0) {
        var remainder = value % 2;
        result = binChars[remainder] + result;
        value = Math.floor(value / 2);
    }
    return result;
}

function dec2hex(value){
    // Define all the possible char for hexadecimal 
    const hexChars = "0123456789ABCDEF";
      
    // Define variables for the result
    var result = "";
    
    // Convert decimal into hexadecimal
    while (parseInt(value) > 0) {
        var remainder = value % 16;
        result = hexChars[remainder] + result;
        value = Math.floor(value / 16);
    }
    return result;
}

function dec2oct(value){
    // Define all the possible char for octal
    const octChars = "01234567";
      
    // Define variables for the result
    var result = "";
    
    // Convert decimal into octal
    while (parseInt(value) > 0) {
        var remainder = value % 8;
        result = octChars[remainder] + result;
        value = Math.floor(value / 8);
    }
    return result;
}

function bin2dec(value){
    return parseInt(value,2)
}

function hex2dec(value){
    return parseInt(value,16)
}

function oct2dec(value){
    return parseInt(value,8)
}

function getNum_sys_mode(){
    return num_sys_mode_elem.innerHTML;
}

function setNum_sys_mode(value){
    num_sys_mode_elem.innerHTML = value;
}

function getHyp(){
    return hyp;
}

function setHyp(value){
    hyp = value;
}