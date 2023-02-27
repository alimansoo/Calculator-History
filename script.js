'use strict'

//inital localstorage
function getLocalStorage() {
    if (!localStorage.getItem('history'))
        localStorage.setItem('history',
            JSON.stringify([])
        );
    return JSON.parse(localStorage.getItem('history'));
}
function setLocalStorage(str) {
    localStorage.setItem('history',
        JSON.stringify([...getLocalStorage(),str])
    );
}
//swich Mode
let swichModeItems = document.querySelectorAll('.swich-mode_item');
swichModeItems.forEach(item => {
    item.addEventListener('click',function(){
        let Itmes = this.closest('.swich-mode')
            .querySelectorAll('.swich-mode_item');
        Itmes.forEach(item =>{
            item.classList.remove('active');
        });
        this.classList.add('active');
        document.querySelector('#CalcContainer')
            .setAttribute('theme',this.innerText);
    })
});

class Calculator{
    constructor(display,previous_display) {
        this.Display = display;
        this.DisplayText = display.innerText;
        this.PreviousDisplay = previous_display;
        this.PreviousDisplayText = previous_display.innerText;
    }
    clear(){
        this.DisplayText = '0';
        this.update();
    }
    clearAll(){
        this.DisplayText = '';
        this.PreviousDisplayText = '';
        this.Operation = '';
        this.update();
    }
    delete(){
        this.DisplayText = this.Display.innerText;
        if (this.DisplayText.length <= 0) return;
        this.DisplayText = this.Display.innerText.slice(0, -1);
        this.update();
    }
    addNumber(number){
        this.DisplayText = this.Display.innerText;
        if (number === '.' && this.DisplayText.includes('.')) return;
        if (this.DisplayText === '0') {
            this.DisplayText = '';
            this.update();
        }
        this.DisplayText += number;
        this.update();
    }
    appendOperation(operation){
        if (this.Display.innerText === '0') return;
        if (this.Operation && this.Operation !== '') {
            console.log('omadi')
            let compiotion = this.compute(this.Display.innerText);
            console.log(compiotion);
            this.PreviousNumber = compiotion;
            this.DisplayText = compiotion.toString();
        }else {
            this.PreviousNumber = this.Display.innerText;
            this.PreviousDisplayText = this.DisplayText + operation;
            this.DisplayText = '0';
        }
        this.Operation = operation;

        this.update();
    }
    update(){
        this.Display.innerText = this.DisplayText;
        this.PreviousDisplay.innerText = this.PreviousDisplayText;
    }
    compute(Number){
        let PrNumber = parseFloat(this.PreviousNumber);
        let CrNumber = parseFloat(Number);
        console.log(PrNumber,this.Operation,CrNumber);
        setLocalStorage(PrNumber + this.Operation + CrNumber);
        if (isNaN(PrNumber) || isNaN(CrNumber)) return ;
        switch (this.Operation) {
            case '+':
                return  PrNumber + CrNumber;
                break;
            case '-':
                return PrNumber - CrNumber;
                break;
            case '*':
                return PrNumber * CrNumber;
                break;
            case '÷':
                return PrNumber / CrNumber;
                break;
        
            default:
                return 'Errore!!!';
                break;
        }
        this.update();
    }
    equal(){
        let compiotion = this.compute(this.Display.innerText);
        this.DisplayText = compiotion.toString();
        this.PreviousDisplayText = '';
        this.Operation = '';
        this.update();
    }
}
let Disaplay = document.querySelector('#display');
let PreviousDisaplay = document.querySelector('#previous-display');
let BtnNumbers = document.querySelectorAll('[btn-number]');
let BtnOperation = document.querySelectorAll('[btn-opt]');
let BtnEqual = document.querySelector('[btn-equal]');
let BtnDel = document.querySelector('[btn-delete]');
let BtnClr = document.querySelector('[btn-clear]');
let BtnClrAll = document.querySelector('[btn-clearall]');
let BtnHistory = document.querySelector('#history');

let calculator = new Calculator(Disaplay,PreviousDisaplay);

BtnNumbers.forEach(button => {
    button.addEventListener('click',() =>{
        calculator.addNumber(button.innerText);
        calculator.update();
    });
});
BtnOperation.forEach(button => {
    button.addEventListener('click',() =>{
        calculator.appendOperation(button.innerText);
        calculator.update();
    })
});
BtnEqual.addEventListener('click', () => {
    calculator.equal();
    calculator.update();
});
BtnDel.addEventListener('click', () => {
    calculator.delete();
    calculator.update();
});
BtnClrAll.addEventListener('click', () => {
    calculator.clearAll();
    calculator.update();
});
window.addEventListener('keydown',(e)=>{
    const numbers = '1234567890';
    const operation = '+-÷*';
    if (numbers.includes(e.key))
        calculator.addNumber(e.key);
    else if(operation.includes(e.key))
        calculator.appendOperation(e.key);
    else
        switch (e.key) {
            case 'Enter':
                calculator.equal();
                break;
            case '=':
                calculator.equal();
                break;
            case 'Backspace':
                calculator.delete();
                break;
            case 'Delete':
                calculator.clear();
                break;
        }
    // calculator.update();
});
BtnHistory.addEventListener("click",() => {
    document.getElementById("myModal").style.display = "block";
    let History = getLocalStorage();
    let HistoryHtml = History.map(log =>
        `<div>${log}</div>`
    ).join('<br/>');

    document.querySelector('#myModal .modal-content p').innerHTML = HistoryHtml;

    document.getElementsByClassName("close")[0].onclick = function() {
        document.getElementById("myModal").style.display = "none";
    }
})