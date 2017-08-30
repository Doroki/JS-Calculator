var number1;
var number2;
var action;  // storage of sign ("+", "-", "÷", "×")

var upperInput = document.getElementById('upperInput'),
	lowerInput = document.getElementById("lowerInput"),
	calculator = document.getElementById("calculator");

var numberButton = document.querySelectorAll(".calc__number"),
	signButton = document.getElementsByName("sign");

var changeValue = document.querySelector("#change-value"),
	clearButton = document.getElementsByName("clear"),
	summary = document.querySelector("#summary");


/*----------  Check screens value length than change font size  ----------*/

function checkScreenLength() {

	if (lowerInput.value.length >= 17) {
		lowerInput.style.fontSize = "1.2em";
	} else if(lowerInput.value.length >= 12) {
		lowerInput.style.fontSize = "1.5em";
	} else if (lowerInput.value.length <= 11) {
		lowerInput.style.fontSize = "";
	}

	if (upperInput.value.length >= 17) {
		upperInput.style.fontSize = "1.2em";
	} else if(upperInput.value.length >= 12) {
		upperInput.style.fontSize = "1.5em";
	} else if (upperInput.value.length <= 11) {
		upperInput.style.fontSize
	}
}

/*----------  Check Existed Value on screen  ----------*/

function checkExistedSign(screen1, screen2) {
		return {
			//upper input
			upScreen: screen1,
			lastUpIndex: screen1.length -1,
			signUpScreen: screen1.charAt(screen1.length -1),
			//lower input
			lowScreen: screen2,
			lastLowIndex: screen2.length -1,
			signLowScreen: screen2.charAt(screen2.length -1),
		}
}

/*----------  Check Basic Operations (for signs "+, -, ×, ÷")  ----------*/

function checkBasicOperation(sign) {

	var existedSign = checkExistedSign(upperInput.value, lowerInput.value);

	var check = new RegExp("[\\+-×÷$]", "g"),
		checkLastSign = check.test(existedSign.upScreen);

	if(checkLastSign && lowerInput.value===""){
		upperInput.value = existedSign.upScreen.replace(existedSign.signUpScreen, action);
		return null;
	} 
	else if(checkLastSign && existedSign.signUpScreen !== "=") {
		action = existedSign.upScreen.charAt(existedSign.lastUpIndex);
		calculate ();
		action = sign.target.value;
		return false;
	} 
	else if (existedSign.signUpScreen==="=") {
		return false;
	} 
	else if ((lowerInput.value==="") && (upperInput.value==="") || (existedSign.signLowScreen===".")) { 
		return null;
	}
	else { 
		return true;
	}
}

/*----------  Check Element Operations (for sign "√")  ----------*/

function checkElementOperations(sign) {
	
	var existedSign = checkExistedSign(upperInput.value, lowerInput.value);

	var check = new RegExp("[\\D$]", "g"),
		checkLastSign = check.test(existedSign.upScreen);

	if(checkLastSign && lowerInput.value ==="") {
		return 1;
	} else if (existedSign.signUpScreen ==="=") {
		number1 = parseFloat(lowerInput.value);
		return 3;
	} else if (checkLastSign && upperInput.value !=="" && existedSign.signUpScreen!=="=") {
		action = existedSign.signUpScreen;
		calculate ();
		action = sign.target.value;
		number1 = parseFloat(lowerInput.value);
		return 2;
	} else if ((lowerInput.value ==="") && (upperInput.value ==="") || (existedSign.signLowScreen===".")) {
		return null;
	} else {
		return 3;
	}			
}

/*----------  Check Percent Operations (for sign "%")  ----------*/

function checkPercentOperations(sign) {

	var existedSign = checkExistedSign(upperInput.value, lowerInput.value);

		if (existedSign.signUpScreen === "×"){ 
			return true;
		} else if(existedSign.signUpScreen === "+" || existedSign.signUpScreen === "-") {
			calculate(action);
			number1 = parseFloat(lowerInput.value);
			upperInput.value += action;
			action = existedSign.signUpScreen;
			return false;
		} else if(existedSign.signUpScreen === "÷") {
			return null;
		} else {
			return false;
		}		
} 


/*----------  Keyboard Events  ----------*/

function simulateEvent(element, action) {
	var event = new Event('click');
	element.addEventListener("click", action);
	element.dispatchEvent(event);
}

function keyboardEvents(e) {
	var usedSign = e.key,
		testNumber = /\d/g,
		testSign = /\D/g;
	
	if(usedSign === "=" || usedSign === "Enter"){
		simulateEvent(summary, calculate);
	} 
	else if(usedSign === "Delete"){ // "C"
		simulateEvent(clearButton[0], clear);
	}
	else if(usedSign === "Backspace"){ // "CE"
		simulateEvent(clearButton[1], clear);
	} 
	else if	(testNumber.test(usedSign)) {
		for(var i = 0; i<numberButton.length; i++){
			if(usedSign === numberButton[i].value){
				simulateEvent(numberButton[i], writeNumber);
			}
		} 
	}
	else if	(testSign.test(usedSign)) {
		for(var i = 0; i<signButton.length; i++){
			if(usedSign === ",") {
				usedSign = ".";
			}
			if(usedSign === signButton[i].value){
				simulateEvent(signButton[i], writeSign);
			}
		}
	}
	
}

/*====================================================================
=                            MAIN FUNCTIONS                          =
====================================================================*/


/*----------  WRITE NUMBERS  ----------*/

function writeNumber(number) {
	var existedSign = checkExistedSign(upperInput.value, lowerInput.value);	
	
	if(lowerInput.value.length >= 17) {
		alert("nie można podać większej ilości liczb");
	} else if (existedSign.signUpScreen === "=") { // PREVIOUS OPERATION WAS FINISHED - CLEAR SCREEN THAN ADD NUMBER
		upperInput.value = "";
		number1 = parseFloat(lowerInput.value = number.target.value);
		number2 = parseFloat(upperInput.value);
	} else if (lowerInput.value === "0") { // PREVIOUS OPERATION WAS FINISHED - CLEAR SCREEN THAN ADD NUMBER
		number1 = parseFloat(lowerInput.value = number.target.value);
	} else { // ADD NUMBER TO SCREEN
		number1 = parseFloat(lowerInput.value += number.target.value);
		number2 = parseFloat(upperInput.value);
	}
	
	return number1, number2, false; 	
}


/*----------  WRITE SIGNS  ----------*/

function writeSign(sign) { 
	
	if (sign.target.value !== "."){
		action = sign.target.value;
	}	
	
	switch (sign.target.value) {
		
		case ".":
			if ((lowerInput.value.indexOf(".")===-1) && !(lowerInput.value==="")) {
				lowerInput.value += sign.target.value;}
			break;
		
		case "+": case "-": case "×": case "÷":
			var operation = checkBasicOperation(sign);
			if (operation === true) {
				upperInput.value += lowerInput.value + sign.target.value;
				lowerInput.value = "";
			} else if (operation === false){
				upperInput.value = lowerInput.value + sign.target.value;
				lowerInput.value = "";
			}
			break;
				
		case "%":
			var operation = checkPercentOperations(sign);
			
			if(operation === true) {
				lowerInput.value += action;
				calculate(action);
			} if(operation === false) {
				calculate(action);
			} 
			break;
				
		case "√":
			var operation = checkElementOperations(sign);
			
			if(operation === 1) {
				upperInput.value = action + parseFloat(upperInput.value);
				calculate();
			} else if(operation === 2) {
				upperInput.value = action;
				calculate();
			} else if (operation === 3) { // STANDARD ELEMENT OPERATION
				lowerInput.value = action + lowerInput.value;
				calculate();
			} 
			break;	

		default:
			alert("Nieprawidłowa operacja");
			break;	
	}		
}


/*----------  CHANGE NUMBER TO NEGATIVE OR POSITIVE  ----------*/

function minus() {
	var existedSign = checkExistedSign(upperInput.value, lowerInput.value);

		if (existedSign.lowScreen.charAt(0) === "-"){ // CHANGE TO POSITIVE
			lowerInput.value = "";
			lowerInput.value = existedSign.lowScreen.slice(1);
			number1 = parseFloat(lowerInput.value);
		} else { // CHANGE TO NEGATIVE
			lowerInput.value = "";
			lowerInput.value += "-" + existedSign.lowScreen;
			number1 = parseFloat(lowerInput.value);
		}
}


/*----------  CLEAR SCREEN  ----------*/

function clear(sign) {
	if (sign.target.value === "C") {
		number1 = "";
		number2 = "";
		upperInput.value = "";
		lowerInput.value = "";
	} else if (sign.target.value === "CE") { 
		number1 = "";
		lowerInput.value = "";
	} 
}


/*----------  CALCULATE  ----------*/

function calculate () {
	var total; 

	switch (action) {
		case "-":
			total = number2 - number1;
			break;
		case "+":
			total = number2 + number1;
			break;
		case "÷":
			if (number1===0) total = "Nie dziel przez zero!!!";
			else total = number2 / number1;
			break;		
		case "×":
			total = number2 * number1;
			break;	
		case "%":
			total = number1 * (number2 / 100 );	
			break;	
		case "√":
			total = Math.sqrt(number1);
			break;											
		default:
			alert("Nieprawidłowa operacja");
			break;	
	}	

	result(total);		
}


/*----------  SHOW RESULT  ----------*/

function result(total) {
	var existedSign = checkExistedSign(upperInput.value, lowerInput.value);

	if (existedSign.signUpScreen === "=") {  // USEING EQUAL SIGN AGAIN, AFTER PREVIOUS OPERATION WAS CALCULATED
		number2 = total;
		upperInput.value = "";
		calculate ();
	} else if (existedSign.signUpScreen === "%") { // WRONG OPERATIONS
		upperInput.value = upperInput.value.slice(0,-2);
		upperInput.value += "%=";
		lowerInput.value = total;
	} else if (total === "" || isNaN(total) === true) { // WRONG OPERATIONS
		alert("Nieprawidłowa operacja");
		lowerInput.value = "";
	} else if (existedSign.lowScreen.charAt(0) ==="-") { // WRONG OPERATIONS
		upperInput.value += "("+lowerInput.value+")" + "=";
		lowerInput.value = total;
	} else { // STANDARD RESULT SHOW
		upperInput.value += lowerInput.value + "=";
		lowerInput.value = total;
	}
}

/*=========================  End of MAIN FUNCTIONS  ==========================*/


/*=============================================
=                   EVENTS                    =
=============================================*/

for(var i = 0; i<numberButton.length; i++){
	numberButton[i].addEventListener("click", writeNumber);
}

for(var i = 0; i<signButton.length; i++){
	signButton[i].addEventListener("click", writeSign);
}	

for(var i = 0; i<clearButton.length; i++){
	clearButton[i].addEventListener("click", clear);
}

changeValue.addEventListener("click", minus);

summary.addEventListener("click", calculate);

calculator.addEventListener("click", checkScreenLength);

document.addEventListener("keydown", keyboardEvents);

/*============  End of EVENTS  =============*/
