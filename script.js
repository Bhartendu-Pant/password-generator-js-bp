const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthNumber = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const cpybtn = document.querySelector("[data-copy]");
const cpyMsg = document.querySelector("[data-copyMsg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const allCheckbox = document.querySelectorAll('input[type="checkbox"]');
const generateBtn = document.querySelector("[data-generatePass]");
const indicator =  document.querySelector("[data-indicator]");

const symbolString='~`!@#$%^&*()_-+={[}];:"<,.>?/';

// default values
let password ="";
let passwordLength =10;
let checkCount =0;
// Indicator color: gray
// let color= "gray";
setIndicator("#ccc");


handleSlider();
setIndicator();


//set paswordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthNumber.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min))+"% 100%";
}


function setIndicator(color){
    indicator.style.backgroundColor =color;
    indicator.style.boxShadow = `0px 0px 12px 3px ${color}`;
}

function getRndInt(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInt(0,9);
}

function generateLowerCase(){
   return String.fromCharCode(getRndInt(97,122));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInt(65,90));
}

function generateSymbol(){
    const rndNum = generateRandomNumber(0,symbolString.length);
    return symbolString.charAt(rndNum);
};


function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym =true;

    if(hasUpper && hasLower && hasNum && hasSym && passwordLength >=8)
    setIndicator("#0f0");
    else if((hasLower || hasUpper ) && (hasNum || hasSym) && passwordLength >= 6)
    setIndicator("#FFA500");
    else
    setIndicator("#f00");
};

async function copyContent(){
    try{  
        await navigator.clipboard.writeText(passwordDisplay.value);
        cpyMsg.innerText ="copied";
       
    }
    catch(e){
        cpyMsg.innerText="failed"
    }

    cpyMsg.classList.add("active");
    setTimeout(()=>{
        cpyMsg.classList.remove("active");
    },2000);
};

function shufflePassword(shufflePassword){
    // Fisher Yates Method
    for(let i=shufflePassword.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = shufflePassword[i];
        shufflePassword[i] = shufflePassword[j];
        shufflePassword[j] = temp;
    }
    let str = "";
    shufflePassword.forEach((el)=>(str += el));
    return str;


}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckBoxChange)
})

inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

cpybtn.addEventListener("click",(e)=>{
    if(passwordDisplay.value)
    copyContent();
});

generateBtn.addEventListener("click",()=>{
    if(checkCount <=0)
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }


    password="";
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let rndIndex = getRndInt(0,funcArr.length);
        password += funcArr[rndIndex]();
    }
    //Shuffle the password 
    password = shufflePassword(Array.from(password));
    passwordDisplay.value=password;

    calcStrength();
});