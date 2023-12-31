// Select the input HTML element that contains all the button
const input_button_elem = document.querySelector(".input")

// Select the display HTML element to alter the innerHTML 
const output_display_elem = document.querySelector(".display")

// Select the value HTML element to alter the innerHTML 
const output_ans_elem  = document.querySelector(".value")

// Select all the buttons with type trigo 
const all_trigo_button = document.querySelectorAll("button[type='trigo']")
const all_num_button = document.querySelectorAll("button[type='num']")

// Select all the elements under number system mode which are dec oct hex and bin
const num_sys_mode_elem = document.querySelector(".num_sys_mode")

const deri_mode_elem = document.getElementById("deri_mode");
const hyp_elem = document.getElementById('hyp');

// To store the previously calculated value
var ans = 0;
// To store Memory value
var M = 0;
// Store the state of hyper
var hyp = false;
// Store the state of derivation, the calculator calculate value a bit differently under the deri mode on, see calculate() 
var deri = false;

// To store the input from user for calculation and display purposes
// because the display and the actual formula itself might differ, thus it is necessary to seperate the operation and formula
memory ={
    operation: [],
    formula: [],
}

// Event listener to update the display and memory of operation and formula
// Event listener listen to clicks that occur in the input <div> which consist of all the buttons and the container containing the buttons.
input_button_elem.addEventListener("click", event =>{
    const target = event.target;
    // Since the target is actually the parent of these button which is div with class=input, we need to check if the user is clicking a button. All button will have attribute type
    // If this condition is not included, the rest of the function will be executed even when user is clicking in between the buttons
    if (target.hasAttribute('type')){
        
        const symbol = target.getAttribute('symbol')
        const formula = target.getAttribute('formula');
        const type = target.getAttribute('type')
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
            console.log("getOUtput" + getOutput_ans())
            console.log(`type ${getOutput_ans() !== "" && (type == "num" || type == "func" || type == "trigo")}` )
            if (getOutput_ans() !== "" && (type == "num" || type == "func" || type == "trigo")) {
                clearAll();
            }

            // due to the way how parenthesis can be used as multiplication tools in most scientific calculators, 
            // we have to define conditions to allow parenthesis multiplication to happen
            // First step is to get the previously inserted formula
            const previous_formula = memory.formula[memory.formula.length -1];
            // Check if the previous_formula has attribute type='num'
            const previous_isNum = isNum(previous_formula);
            const current_isNum = Number.isInteger(parseInt(formula));
            // Multiplication can happen in 3 differetn conditions, x(x), (x)(x), and (x)x
            const multiply_before_parenthesis = previous_isNum && formula=="(";
            const multiply_after_parenthesis = previous_formula == ")" && current_isNum
            const multiply_between_parenthesis = previous_formula == ")" && formula=="(";
            // Normal scientific calculator also allow something like xsin(x)
            const multiply_before_trigo = previous_isNum && type=="trigo";
            // 2X
            const multiply_before_x = previous_isNum && formula=="x";
            // 2e
            const multiply_before_e = previous_isNum && formula=="Math.E";
            // e2
            const multiply_after_e = previous_formula == "Math.E" && current_isNum;
            // 2log(2)
            const multiply_before_func = previous_isNum && type=="func";
            // Combine all the condition for ease of use
            const multiplication_conditions = 
                (
                multiply_before_trigo || multiply_before_parenthesis || multiply_after_parenthesis || multiply_between_parenthesis || multiply_before_x || 
                multiply_before_func || multiply_before_e || multiply_after_e
                );

            // Only for buttons with attribute symbol="something"
            if(target.hasAttribute("symbol")){
                // If any of the multiplication conditions is met, add * to the front of the formula
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
        console.log("not a button")
    }
})

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
    // Set the result display with value
    setOutput_ans(value)
    console.log("updateResult:", output_ans_elem.innerHTML)
    // Update var ANS
    setAns(value);
}

// Performing calculations by evaluating the formula inputed by the user in the memory
function calculate() {
    if (memory.formula.length !== 0) {
        // Combine the formula
        const str = memory.formula.join("");
        console.log(`expression = ${str}`)
        try {
            // Evaluate the expression
            let result = Function("return " + str)();

            // If in derivation mode, calculate the derivation instead.
            if (deri) {
                result = calcDeri(deriExpression, result);
            }

            // Update display and ANS
            updateResult(result);
         
        // Alert user when error occur
        } catch (error) {
            alert(error);   
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
const pattern = /(Ans|true|false|M|e|E|x|OR|AND|NOT\(|ln\(|log\(|sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|sinh\(|cosh\(|tanh\(|asinh\(|acosh\(|atanh\(|sqrt\(|log\(|exp\(|²|÷|×|\.|\^|\+|\-|\*|\/|\(|\)|\√\(|[0-9])/g;

// This function Remove a pre-defined pattern from the display and memory of the calculator 
function del(){
    var currentValue = getOutput_display();

    // Use a regular expression to find matches in the currentValue
    var matches = currentValue.match(pattern);

    // Allow user to correct thier expression after the calculation, prevent the auto clear all by removing the output_display
    if(getOutput_ans() != ""){
        // Reset display at the to[]
        setOutput_display("")
        // Reset result display at the bottom
        setOutput_ans("")
    }

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

function clearAll(){

    // Reset display at the top
    setOutput_display("")
    // Reset result display at the bottom
    setOutput_ans("")
    // Reset display and formula
    memory.operation = []
    memory.formula = []
    console.log(memory.operation)
    console.log(memory.formula)
    // Reset number system to decimal
    setNum_sys_mode("dec")

    // Reset mode if necessary
    if(hyp){
        setHyp(false)
    }
    if(deri){
        setDeri(false)
    }
}

// Calculate derivation by using mathjs import
function calcDeri(f, xValue) {
    if(checkValidExpr(f)){
    // replace every occurance of ** into ^
    f = f.replace(/\*\*/g, '^');
    // calculate the derivation function of f with constant x
    var derivative = math.derivative(f, 'x').toString();
    // Evaluate the derivation function with the xValue from parameter
    const result = math.evaluate(derivative, { x: xValue });
    return result;
    }
}

// store to expression to use it after user input x=
var deriExpression = "";

function derivation(){
    if(memory.formula != []){
        expression = memory.formula.join("");
        if (checkValidExpr(expression)) {
        // store to expression to use it after user input x=
        setDeriExpression(expression)

        // Set the derivation mode to true
        setDeri(true)
        // Prompt user to enter value of x
        setOutput_display("x=")
        // Reset the answer, and displays and formula for the new input
        setOutput_ans("")
        memory.operation = []
        memory.formula = []
        }
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

function setHyp(value) {
    hyp = value;
    const length = all_trigo_button.length;
    // Iterate through every single trigonometry button
    for (let index = 0; index < length; index++) {
        const trigoButton = all_trigo_button[index];
        let formula = trigoButton.getAttribute("formula");
        let symbol = trigoButton.getAttribute("symbol");
        let inner = trigoButton.innerHTML;

        if (hyp) {
            // . match a char, $ is end of string, .$ is the last char
            // Replace the last char into h(
            formula = formula.replace(/.$/, "h(");
            symbol = symbol.replace(/.$/, "h(");
            // Add h into the button text sin to sinh
            inner += "h";
            hyp_elem.style.display = 'block';
        } else {
            // .. match 2 char, $ is end of string, ..$ is the last 2 char
            // Replace the last 2 char into (
            formula = formula.replace(/..$/, "(");
            symbol = symbol.replace(/..$/, "(");
            // Remove the last char, sinh to sin
            inner = inner.slice(0, -1);
            hyp_elem.style.display = 'none';
        }
        // Set the new formula and symbol to the button
        trigoButton.setAttribute("formula", formula);
        trigoButton.setAttribute("symbol", symbol);
        trigoButton.innerHTML = inner;
    }
}

// Convert number system of result into another number system
function numberSystem(type){
    // if no result to be convert, nothing happen
    if(getOutput_ans() == ""){
        console.log("nothing to change")
    }else{
        console.log(getOutput_ans())
        const value = getOutput_ans();
        console.log(typeof getOutput_ans())
        // Convert any number system back to decimal
        const dec_num = convertToDecimal(value);
    
        console.log("dec_num" ,dec_num)

        // convert to different number systems
        switch (type) {
            case "hex":
                // Convert to Hex
                hex_num = dec2(dec_num,16);
                setOutputAndMode(hex_num,"hex");
                break;
            case "oct":
                // Convert to Oct
                oct_num = dec2(dec_num,8);
                setOutputAndMode(oct_num,"oct");
                break;
            case "bin":
                // Convert to Bin
                bin_num = dec2(dec_num,2)
                setOutputAndMode(bin_num,"bin");
                break;
            case "dec":
                // No extra convertion needed
                setOutputAndMode(dec_num,"dec");
                break;
        }
    }
}

// Convert any number system back to decimal
function convertToDecimal(value) {
    switch (getNum_sys_mode()) {
        case "hex":
            // Convert hexadecimal value back to decimal
            return parseInt(value,16);
        case "oct":
            // Convert octodecimal value back to decimal
            return parseInt(value,8);
        case "bin":
            // Convert binary value back to decimal
            return parseInt(value,2);
        case "dec":
            return parseFloat(value);
    }
}

// Convert from decimal to given number system
function dec2(value,num){
    var possibleChars = ""
    // Get the possible char based on number system required
    switch (num) {
        case 2:
            possibleChars = "01";
            break;
        case 8:
            possibleChars = "01234567";
            break;
        case 16:
            possibleChars = "0123456789ABCDEF";
            break;
        default:
            console.log("Invalid number system mode");
            return 0;
    }

    // Define variables for the result
    var result = "";

    // Convert decimal into given number system
    while (parseInt(value) > 0) {
        
        // The first remainder is the index of the rightmost char in the result.
        var remainder = value % num;

        // Add the char to the result  e.g. 1 + 010 == 1010
        result = possibleChars[remainder] + result;
        
        // Divide the value and loop
        value = Math.floor(value / num);
    }
    return result;
}

// Set Current Number system mode, and the output
function setOutputAndMode(output, mode) {
    setNum_sys_mode(mode);
    setOutput_ans(output);
    console.log(output);
}

// Set the derivation mode to true / false
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

function memoryOperation(value) {
    // Combine formula
    const str = memory.formula.join("");

    if(checkValidExpr(str)){
        let result = Function("return " + str)() || 0;

        switch (value) {    
            // If the operation is plus
            case "plus":
                // Add result to memory
                setM(getM() + result);
                // Update result
                updateResult("M → " + getM());
                console.log(typeof value)
                console.log(typeof getM())
                console.log(typeof result)
                break;
            case "minus":
                // Subtract result from memory
                setM(getM() - result);
                // Update result
                updateResult("M → " + getM());
                break;
            case "clear":
                // Reset Memory to 0
                setM(0);
                clearAll();
                break;
            default:
                break;
        }
    }
}

// Check if the parameter string is a valid expression
function checkValidExpr(str) {
    var valid = true;
    try {
        // Use Function constructor to create a function with 'x' as an argument
        const check = new Function('x', 'return ' + str);

    } catch (error) {
        valid = false;
        alert(error);   
    }
    return valid;
}

// Return true if the parameter is a button with type num
function isNum(previous_formula){
    for (let i = 0; i < all_num_button.length; i++) {
        const button = all_num_button[i];
        // Checking if the button with previous formula is a button with type="num"
        if(button.getAttribute('formula') === previous_formula && button.getAttribute('type') === 'num'){
            return true;
        }
    }
    return false
}

// Getters and Setters

function getNum_sys_mode(){
    return num_sys_mode_elem.innerHTML;
}

function setNum_sys_mode(value){
    num_sys_mode_elem.innerHTML = value;
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