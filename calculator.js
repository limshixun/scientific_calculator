let data = {
    operation: [],
    formula: []
}

const input_button_elem = document.querySelector(".input")
const output_display_elem =document.querySelector(".operation .display")
const output_ans_elem  =document.querySelector(".result .value")

input_button_elem.addEventListener("click", event =>{
    const targeted_btn = event.target;

    const symbol = targeted_btn.getAttribute('symbol')
    const formula = targeted_btn.getAttribute('formula');

    //console.log('Formula:', formula);
    updateDisplay(symbol)
})

function updateDisplay(value){
    const currentValue = output_display_elem.value || '';
    output_display_elem.value = currentValue + value;

    output_display_elem.scrollLeft = output_display_elem.scrollWidth;
}

function updateResult(value){
    output_display_elem.innerHTML += value
}

