// Define all the constants and variables
// Select the input HTML element that contains all the button
const input_button_elem = document.querySelector(".input")
// Select the display HTML element to alter the innerHTML 
const output_display_elem = document.querySelector(".display")
// Select the value HTML element to alter the innerHTML 
const output_ans_elem  = document.querySelector(".value")
// Select all the buttons with type trigo 
const all_trigo_button = document.querySelectorAll("button[type='trigo']")
// Select all the elements under number system mode which are dec oct hex and bin
const num_sys_mode_elem = document.querySelector(".num_sys_mode")
const deri_mode_elem = document.getElementById("deri_mode");
const hyp_elem = document.getElementById('hyp');

// To store the previously calculated value
var ans = 0;
// To store Memory value
var M = 0;
// To store the input from user for calculation and display purposes
// because the display and the actual formula itself might differ, thus it is necessary to seperate the operation and formula
memory ={
    operation: [],
    formula: [],
}
// Store the state of hyper
var hyp = false;
// Store the state of derivation, the calculator calculate value a bit differently under the deri mode on, see calculate() 
var deri = false;

//an event listener to update the display and memory of operation and formula
input_button_elem.addEventListener("click", event =>{
    const target = event.target;
    const symbol = target.getAttribute('symbol')
    const formula = target.getAttribute('formula');
    const type = target.getAttribute('type')

    // Since the target is actually the parent of these button which is div with class=input, we need to check if the user is clicking a button. All button will have attribute type
    // If this condition is not included, the rest of the function will be executed even when user is clicking in between the buttons
    if (target.hasAttribute('type')){
        /*
        When the user press an operator immediately after calculating a value (eg. after performing 9+9 and click the = button to get a result of 18,
        the calculator allow the user to continue the calculation by performing the operation on the Ans (previously calculated value) )
        If press + right after pressing = button, the display will become Ans + 
        */
        if(getOutput_ans() != "" && type == "operator" ){
            clearAll()
            updateDisplay('Ans','ans')
            updateDisplay(symbol,formula)
        }else{
            console.log(type)
            /*
            This condition allow the user to enter new operation right after a calculation wihtou clicking on the AC button
            (eg. after performing 9+9 and click the = button to get a result of 18, user can press on a function like sin(
            or a number like 9 and the calculator will clear automatically without pressing the AC button 
            */
            if (getOutput_ans() !== "" && (type == "num" || type == "func" || type == "trigo")) {
                clearAll();
            }
            // This condition allow all the button with a symbol attribute to be added on the display
            // The only button with symbols are numbers, functions, operators and trigofunction
            // due to the way how parenthesis can be used as multiplication tools in most scientific calculators, 
            // we have to define conditions to allow parenthesis multiplication to happen
            // First step is to get the previously inserted formula
            const previous_formula = memory.formula[memory.formula.length -1];
            // Multiplication can happen in 3 differetn conditions, x(x), (x)(x), and (x)x
            const multiply_before_parenthesis = Number.isInteger(parseInt(previous_formula)) && formula=="(";
            const multiply_after_parenthesis = previous_formula == ")" && Number.isInteger(parseInt(formula));
            const multiply_between_parenthesis = previous_formula == ")" && formula=="(";
            // Normal scientific calculator also allow something like xsin(x)
            const multiply_before_trigo = Number.isInteger(parseInt(previous_formula)) && type=="trigo";
            const multiply_before_x = Number.isInteger(parseInt(previous_formula)) && formula=="x";
            // 10
            const multiply_before_func = Number.isInteger(parseInt(previous_formula)) && type=="func";
            // Combine all the condition for ease of use
            const multiplication_conditions = multiply_before_trigo || multiply_before_parenthesis || multiply_after_parenthesis || multiply_between_parenthesis || multiply_before_x || multiply_before_func
            if(target.hasAttribute("symbol")){
                if (multiplication_conditions){
                    new_symbol = symbol;
                    new_formula = "*" + formula
                    updateDisplay(new_symbol,new_formula)
                }else{
                    updateDisplay(symbol,formula)
                }
            } 
        }
    }else{
        console.log("not")
    }
})
/*
 * User Manual for updating display:
 * 1. Press any button that has a symbol and a formula
 * 2. View the result of multiplication being updated to the result column
*/

/*
 * User Manual for parenthesis multiplication:
 * 1. Input something like 1(2) or (2)(2) or (2)2
 * 2. Press "=" button
 * 3. View the result of multiplication being updated to the result column
*/


// Update the display and push them into the memory tie to it which includes both operation and formula
// Invoked every time when a valid button is pressed and updating the display is needed
function updateDisplay(symbol, formula){
    const currentValue = getOutput_display() || '';
    setOutput_display(currentValue + symbol);

    // allow the display to follow the content
    output_display_elem.scrollLeft = output_display_elem.scrollWidth;
    pushMem(symbol, formula)
}

// Update the result column with the result of calculation
// invoked only after calculation
function updateResult(value){
    setOutput_ans(value)
    console.log("updateResult:", output_ans_elem.innerHTML)
    setAns(value);
}
// memory.formula != []
// Performing calculations by evaluating the formula inputed by the user in the memory
function calculate() {
    if (memory.formula.length !== 0) {
        const str = memory.formula.join("");
        console.log("formula: ", str);

        try {
            let result = Function("return " + str)();
            console.log("BigInt : " + result);

            if (deri) {
                console.log(result);
                result = calcDeri(deriExpression, result);
            }

            setAns(result);
            updateResult(result);
        } catch (error) {
            if (error instanceof SyntaxError) {
                alert('Syntax Error: ' + error.message);
            } else {
                console.error('An error occurred: ' + error);
            }
            clearAll();
        }
    } else {
        console.log("Nothing to calculate");
    }
}
/*
 * User Manual:
 * 1. Enter a expressions using the provided buttons.
 * 2. Press the "=" button to calculate the result based on the inputed formula.
 * 3. If you are in derivation mode and have inserted a function for derivation, press the "=" button to calculate the derivative.
 * 4. View the result in the result display column.
 * 5. If there are syntax errors or other issues, error messages will be displayed.
 */


/*
Anything that wanted to be deleted needs to be added into the pattern
Define a regular expression pattern to match function/operator strings
/ /g sin\( represent sin( separated by |
*/
const pattern = /(Ans|true|false|M|e|E|x|OR|AND|NOT\(|ln\(|log\(|sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|sinh\(|cosh\(|tanh\(|asinh\(|acosh\(|atanh\(|sqrt\(|log\(|exp\(|÷|×|\.|\^|\+|\-|\*|\/|\(|\)|\√\(|[0-9])/g;

// This function Remove a pre-defined pattern from the display and memory of the calculator 
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
/*
 * User Manual:
 * 1. Press any button that might update the display like numbers or operators
 * 2. Press the "DEL" button
 * 3. View the pattern in the display column being deleted.
 */

// Calculate derivation by using mathjs import
function calcDeri(f, xValue) {
    checkValidExpr(f)
    f = f.replace(/\*\*/g, '^');
    var derivative = math.derivative(f, 'x').toString();
    const result = math.evaluate(derivative, { x: xValue });
    return result;
}

// store to expression to use it after user input x=
var deriExpression = "";

function derivation(){
    if(memory.formula != []){
        expression = memory.formula.join("");
        checkValidExpr(expression)
        // store to expression to use it after user input x=
        setDeriExpression(expression)
        console.log(deriExpression)
        setDeri(true)
        setOutput_display("x=")
        setOutput_ans("")
        memory.operation = []
        memory.formula = []
    }else{
        console.log("No expression to derive")
    }
}

function setDeriExpression(value){
    deriExpression = value;
}

function hyperbolic() {
    setHyp(!getHyp());
}

function getHyp(){
    return hyp;
}

function setHyp(value){
    hyp = value;
    const length = all_trigo_button.length;
    if(hyp == true){
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
            hyp_elem.style.display = 'block';
        }
    }else if(hyp == false){
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
            hyp_elem.style.display = 'none';
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

function setDeri(value){
    deri = value;
    if (deri) {
        deri_mode_elem.style.display = 'block';
    }else{
        deri_mode_elem.style.display = 'none';
    }
}

// Push the symbol and formula of a button into the memory
// Invoked when updating display
function pushMem(symbol, formula){
    memory.operation.push(symbol)
    memory.formula.push(formula)
    console.log(memory.operation)
    console.log(memory.formula)
}

// Pop the last symbol and formula in the memory
// Invoked when using del() function
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
    }else{
        console.log("Nothing to remove")
    }

    if(hyp){
        setHyp(false)
    }
    if(deri){
        setDeri(false)
    }
}

function memoryOperation(value){
    switch (value) {
        case "plus":
            calculate();
            setM(getM() + parseFloat(getOutput_ans().toString()))
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
    output_display_elem.innerHTML = value.toString();
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

function checkValidExpr(str) {
    var valid = true;
    try {
        // Use Function constructor to create a function with 'x' as an argument
        const check = new Function('x', 'return ' + str);

    } catch (error) {
        clearAll();
        valid = false;
        if (error instanceof SyntaxError) {
            alert('Syntax Error: ' + error.message);
            console.error('Syntax Error: ', error.message);
        } else {
            console.error('An error occurred: ' + error);
        }
    }
    return valid;
}