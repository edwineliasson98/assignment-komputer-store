//Bank elements
const bankElement = document.getElementById("bank");
const bankBalanceElement = document.getElementById("bankBalance");
const loanElements = document.getElementsByClassName("loaning");
const loanAmountElement = document.getElementById("loanAmount");
const loanButtonElement = document.getElementById("loan");

//Work elements
const workBalanceElement = document.getElementById("workBalance");
const repayButtonElement = document.getElementById("repayButton");
const bankButtonElement = document.getElementById("bankButton");
const workButtonElement = document.getElementById("workButton");

//Laptop elements
const laptopsElement = document.getElementById("laptops");
const featuresElement = document.getElementById("features");

let laptops = [];
/**
 * Prompts the user for a loan size. If larger than twice the balance, reject it.
 * 
 * @returns Nothing, there to stop the function to continue (consider break instead)
 */
const handleGetLoan = () => {
    //check if balance is zero
    const balance = parseInt(bankBalanceElement.innerText);
    if(balance == 0) {
        alert("Balance is 0, get some money bum!");
        return;
    }

    //prompt user and check loan size
    const loan = prompt("Please enter the size of the loan: ")
    if (loan/2 > balance || loan == "" || loan == null) {
        alert("Loan cannot be larger than twice the balance!")
        return;
    }

    if(loanElements[0].style.visibility == "visible") {
        alert("Can only have one loan at a time!")
        return;
    }

    loanAmountElement.innerText = loan + " Kr";
    setLoanVisibility("visible");

}

/**
 * Increases the work balance
 */
const handleWorking = () => {
    //Add 100 to work balance
    let balance = parseInt(workBalanceElement.innerText);
    balance += 100;
    workBalanceElement.innerText = balance + " Kr";
}

/**
 * Puts the money from work balance into bank balance.
 * Some of the balance is used to pay any existing loans.
 * Resets work balance to 0
 */
const handlePutIntoBank = () => {

    //Put money from balance into bank
    let balance = parseInt(workBalanceElement.innerText);

    //Put 10% of balance towards loan if loan exist, 
    if(loanElements[0].style.visibility == "visible"){
        const loanTransfer = balance / 10; //10%
        balance -= loanTransfer;
        balance += transferToLoan(loanTransfer);
    }
    
    // put rest into bank balance
    let bankBalance = parseInt(bankBalanceElement.innerText);
    bankBalance += balance;
    bankBalanceElement.innerText = bankBalance + " Kr";
    

    // Reset balance to 0
    workBalanceElement.innerText = "0 Kr";

}

/**
 * Uses all of work balance to pay the existing loan
 * If work balance is larger than the loan, the rest goes
 * into bank balance (could go back into work balance but isn't specified)
 */
const handleRepayLoan = () => {
    //Take all work balance and put into loan
    let balance = parseInt(workBalanceElement.innerText);
    let loan = parseInt(loanAmountElement.innerText);
    let bankBalance = parseInt(bankBalanceElement.innerText);
    //set work balance to 0
    workBalanceElement.innerText = "0 Kr";
    //if loan is smaller than balance, put rest into bank
    if(loan <= balance) {
        balance -= loan;
        bankBalance += balance;
        bankBalanceElement.innerText = bankBalance + " Kr";
        loanAmountElement.innerText = "0 Kr";
        setLoanVisibility("hidden");
    } else { //else put full balance into loan
        loan -= balance;
        loanAmountElement.innerText = loan + " Kr";
    }
}

/**
 * Calls addLaptopToSelect on every element of laptops
 * 
 * @param {*} laptops Array of laptop objects
 */
const addLaptopsToSelect = (laptops) => {
    laptops.forEach(laptop => addLaptopToSelect(laptop));
}

/**
 * Adds an option element to laptopsElement with
 * laptop id and title
 * 
 * @param {*} laptop Laptop object
 */
const addLaptopToSelect = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.innerText = laptop.title;
    laptopsElement.appendChild(laptopElement);
}

//Listener setup
loanButtonElement.addEventListener("click", handleGetLoan);
workButtonElement.addEventListener("click", handleWorking);
bankButtonElement.addEventListener("click", handlePutIntoBank);
repayButtonElement.addEventListener("click", handleRepayLoan);

//Fetch laptop data, parse it, store it in array and pass it on to function
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToSelect(laptops));



//General functions for reuse
/**
 * Removes the amount from loan.
 * If amount is larger than loan, the rest gets returned to the
 * function calling it to do with it as it pleases
 * 
 * @param {*} amount Amount to remove from the loan
 * @returns Rest of the amount
 */
function transferToLoan(amount) {
    let loan = parseInt(loanAmountElement.innerText);
    //Check if amount is larger than loan
    if(loan <= amount) {
        amount -= loan;
        loanAmountElement.innerText = "0 Kr";
        setLoanVisibility("hidden");
        return amount;
    } else {
        loan -= amount;
        loanAmountElement.innerText = loan + " Kr";
        return 0;
    }
}

/**
 * Changes the visibility of elements of class "loaning"
 * 
 * @param {*} visibility string that is applied to elements visibility
 */
function setLoanVisibility(visibility) {
    for(let i = 0; i < loanElements.length; i++) {
        loanElements[i].style.visibility = visibility;
    }
}