//the users input
let infix = [];

//get elements
const displayElement = document.querySelector(".calculator > .display");
const pastDisplayElement = document.querySelector(".calculator > .pastdisplay");
const keyList = document.querySelectorAll(".key");

//assign listener to every buttons
const keyClick = () => {
  for (let i = 0; i < keyList.length; i++) {
    let keySingle = keyList[i];
    switch (keySingle.textContent) {
      case "=":
        keySingle.addEventListener("click", () => {
          infixAdd(displayElement.textContent);
          pastDisplayUpdate(displayElement.textContent);
          displayClear();
          displayUpdate(evaluateAndDisplay());
        });
        break;
      case "*":
      case "+":
      case "-":
      case "/":
      case "^":
      case "(":
      case ")":
        keySingle.addEventListener("click", () => {
          infixAdd(displayElement.textContent);
          infixAdd(keySingle.textContent);
          pastDisplayUpdate(displayElement.textContent + keySingle.textContent);
          displayClear();
        });
        break;

      case "C":
        keySingle.addEventListener("click", () => {
          infix = [];
          displayClear();
          pastDisplayClear();
          infixAdd("Enter Numbers");
        });
        break;

      default:
        if (isDigit(keySingle.textContent)) {
          keySingle.addEventListener("click", () => {
            displayUpdate(keySingle.textContent);
          });
        } else {
          console.log(
            "Something went wrong.",
            "display: ",
            infix,
            "keySingle: ",
            keySingle
          );
        }
    }
  }
};

/**
 *
 * @param {String} key
 * @returns {Boolean}
 */
const isDigit = (key) => !isNaN(Number.parseInt(key));

//operations
const adder = (aNumber, bNumber) => aNumber + bNumber;
const subtraction = (aNumber, bNumber) => aNumber - bNumber;
const multiply = (aNumber, bNumber) => aNumber * bNumber;
const division = (aNumber, bNumber) => aNumber / bNumber;

//infix functionality
const infixAdd = (num) => infix.push(num);

//display functionality
const displayClear = () => (displayElement.textContent = "");
const displayUpdate = (num) => (displayElement.textContent += num);

//pastdisplay functionality
const pastDisplayClear = () => (pastDisplayElement.textContent = "");
const pastDisplayUpdate = (num) => (pastDisplayElement.textContent += num);

//stack class
function Stack() {
  //stack is private
  let stack = [];
  this.getTop = () => stack[stack.length - 1];
  this.addTop = (val) => stack.push(val);
  this.getAndRemoveTop = () => stack.pop();
  this.getLength = () => stack.length;
}

/**
 *
 * @param {Array} postfix
 * @returns {Number}
 */
//evaluate and display postfix
const evaluateAndDisplay = () => {
  /**
   * ->when encountered operator take the top as y then the next top as x
   */
  let x = 0;
  let y = 0;
  let operator = "";
  let stack = [];
  let postfix = infix_to_postfix(infix);

  for (let i = 0; i < postfix.length; i++) {
    if (isDigit(postfix[i])) {
      stack.push(postfix[i]);
    } else {
      operator = postfix[i];
      y = Number.parseInt(stack.pop());
      x = Number.parseInt(stack.pop());
      let solution = 0;

      switch (operator) {
        case "+":
          solution = x + y;
          break;
        case "-":
          solution = x - y;
          break;
        case "*":
          solution = x * y;
          break;
        case "/":
          solution = x / y;
          break;
        case "^":
          solution = x ** y;
        default:
          console.log("Error", "x: ", x, "y: ", y, "Operator: ", operator);
      }
      stack.push(solution);
    }
  }
  console.log(stack);
  return stack[stack.length - 1];
};

/**
 *
 * @returns {Array}
 */
const infix_to_postfix = () => {
  let postfix = [];
  let stack = new Stack();
  for (let i = 0; i < infix.length; i++) {
    let input = infix[i];
    //check if character is number
    if (isDigit(input)) {
      postfix.push(input);
    } else {
      //if input special charater
      if (input == "(" || input == "^") {
        //checks if input is '(' or '^' then push to stack
        //stack.push(input);
        stack.addTop(input);
      } else if (input == "/" || input == "*") {
        //checks if input is '/' or '*' then if the top stack is '+' or '-' then push
        //if (stack[stack.length - 1] == "+" || stack[stack.length - 1] == "-") {
        if (stack.getTop() == "+" || stack.getTop() == "-") {
          //stack.push(input);
          stack.addTop(input);
        } else {
          while (
            //if it is "*" or "/" or "^" then pop until no higher precedence then add to stack
            // stack[stack.length - 1] == "^" ||
            // stack[stack.length - 1] == "*" ||
            // stack[stack.length - 1] == "/"
            stack.getTop() == "^" ||
            stack.getTop() == "*" ||
            stack.getTop() == "/"
          ) {
            //postfix.push(stack.pop());
            postfix.push(stack.getAndRemoveTop());
          }
          //stack.push(input);
          stack.addTop(input);
        }
      } else if (input == "+" || input == "-") {
        //if input is '+' or '-' then must check all higher and equal precedence then push
        while (
          // stack[stack.length - 1] == "^" ||
          // stack[stack.length - 1] == "*" ||
          // stack[stack.length - 1] == "/" ||
          // stack[stack.length - 1] == "+" ||
          // stack[stack.length - 1] == "-"
          stack.getTop() == "^" ||
          stack.getTop() == "*" ||
          stack.getTop() == "/" ||
          stack.getTop() == "+" ||
          stack.getTop() == "-"
        ) {
          //postfix.push(stack.pop());
          postfix.push(stack.getAndRemoveTop());
        }
        //stack.push(input);
        stack.addTop(input);
      } else if (input == ")") {
        //while (stack[stack.length - 1] != "(") {
        while (stack.getTop() != "(") {
          //postfix.push(stack.pop());
          postfix.push(stack.getAndRemoveTop());
        }
        //stack.pop();
        stack.getAndRemoveTop();
      }
    }
  }

  //empty the stack
  //while (stack.length != 0) {
  while (stack.getLength() != 0) {
    // postfix.push(stack.pop());
    postfix.push(stack.getAndRemoveTop());
  }

  return postfix;
};

//setup
keyClick();
