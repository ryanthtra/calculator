function State(calculator)
{
}
State.prototype.init = function(calculator) {};
State.prototype.disableButton = function(button)
{
    $(button).prop('disabled', true);
};
State.prototype.execute = function(calculator, button) {};


/**---------------------------------------------------------------------*/
/**
 * StateInitial Class
 */
function StateInitial(calculator)
{
    State.call(this, calculator);
}
StateInitial.prototype = new State();
StateInitial.prototype.constructor = StateInitial;
StateInitial.prototype.init = function(calculator)
{
    this.setButtons(calculator.buttons_obj);
};
StateInitial.prototype.setButtons = function(buttons)
{
    this.disableButton(buttons[BUTTON_CLEAR]);
    this.disableButton(buttons[BUTTON_CLEAR_E]);
    this.disableButton(buttons[BUTTON_ADD]);
    this.disableButton(buttons[BUTTON_SUBTRACT]);
    this.disableButton(buttons[BUTTON_MULTIPLY]);
    this.disableButton(buttons[BUTTON_DIVIDE]);
    this.disableButton(buttons[BUTTON_EQUALS]);
};
StateInitial.prototype.execute = function(calculator, button)
{
    if (calculator.formula.length == 0)
        calculator.formula[0] = '';

    switch (button.textContent)
    {
        case BUTTON_0:
        case BUTTON_1:
        case BUTTON_2:
        case BUTTON_3:
        case BUTTON_4:
        case BUTTON_5:
        case BUTTON_6:
        case BUTTON_7:
        case BUTTON_8:
        case BUTTON_9:
            calculator.formula[0] = '' + button.textContent;
            calculator.changeState(new StateCreateNumber(calculator));
            break;

        case BUTTON_DECIMAL:
            calculator.formula[0] = '0' + button.textContent;
            calculator.changeState(new StateCreateNumberDecimal(calculator));
            break;
    }
};

/**---------------------------------------------------------------------*/
/**
 * StateCreateNumberBlank Class
 */
function StateCreateNumberBlank(calculator)
{
    State.call(this, calculator);
}
StateCreateNumberBlank.prototype = new State();
StateCreateNumberBlank.prototype.constructor = StateCreateNumberBlank;
StateCreateNumberBlank.prototype.init = function(calculator)
{
    this.setButtons(calculator.buttons_obj, calculator.formula);
};
StateCreateNumberBlank.prototype.setButtons = function(buttons, formula)
{
    this.disableButton(buttons[BUTTON_CLEAR_E]);
    this.disableButton(buttons[BUTTON_ADD]);
    this.disableButton(buttons[BUTTON_SUBTRACT]);
    this.disableButton(buttons[BUTTON_MULTIPLY]);
    this.disableButton(buttons[BUTTON_DIVIDE]);
    this.disableButton(buttons[BUTTON_EQUALS]);


    //this.disableButton(buttons[BUTTON_0]);
};
StateCreateNumberBlank.prototype.execute = function(calculator, button)
{
    var length = calculator.formula.length;

    switch (button.textContent)
    {
        case BUTTON_0:
        case BUTTON_1:
        case BUTTON_2:
        case BUTTON_3:
        case BUTTON_4:
        case BUTTON_5:
        case BUTTON_6:
        case BUTTON_7:
        case BUTTON_8:
        case BUTTON_9:
            calculator.formula[length - 1] = button.textContent;
            calculator.changeState(new StateCreateNumber(calculator));
            break;

        case BUTTON_DECIMAL:
            calculator.formula[length - 1] = '0' + button.textContent;
            calculator.changeState(new StateCreateNumberDecimal(calculator));
            break;

        case BUTTON_CLEAR:
            calculator.formula = [];
            calculator.changeState(new StateInitial(calculator));
            break;
    }
};

/**---------------------------------------------------------------------*/
/**
 * StateCreateNumber Class
 */
function StateCreateNumber(calculator)
{
    State.call(this, calculator);
}
StateCreateNumber.prototype = new State();
StateCreateNumber.prototype.constructor = StateCreateNumber;
StateCreateNumber.prototype.init = function(calculator)
{
    this.setButtons(calculator.buttons_obj, calculator.formula);
};
StateCreateNumber.prototype.setButtons = function(buttons, formula)
{
    if (formula.length <= 1)
    {
        this.disableButton(buttons[BUTTON_EQUALS]);
    }
    else
    {
        var last_item = formula[formula.length - 1];

        // If the current number entered is "0." or any "0.0..."
        if ((parseFloat(last_item) == 0) &&
            (formula[formula.length - 2]) == '/')
        {
            this.disableButton(buttons[BUTTON_ADD]);
            this.disableButton(buttons[BUTTON_SUBTRACT]);
            this.disableButton(buttons[BUTTON_MULTIPLY]);
            this.disableButton(buttons[BUTTON_DIVIDE]);
            this.disableButton(buttons[BUTTON_EQUALS]);
        }
    }

    // If number is only one char long, and it's zero
    // disable all the numbers
    if (formula[formula.length-1].length == 1 && parseInt(formula[formula.length-1]) == '0')
    {
        this.disableButton(buttons[BUTTON_0]);
        this.disableButton(buttons[BUTTON_1]);
        this.disableButton(buttons[BUTTON_2]);
        this.disableButton(buttons[BUTTON_3]);
        this.disableButton(buttons[BUTTON_4]);
        this.disableButton(buttons[BUTTON_5]);
        this.disableButton(buttons[BUTTON_6]);
        this.disableButton(buttons[BUTTON_7]);
        this.disableButton(buttons[BUTTON_8]);
        this.disableButton(buttons[BUTTON_9]);
    }
};
StateCreateNumber.prototype.execute = function(calculator, button)
{
    var length = calculator.formula.length;

    switch (button.textContent)
    {
        case BUTTON_0:
        case BUTTON_1:
        case BUTTON_2:
        case BUTTON_3:
        case BUTTON_4:
        case BUTTON_5:
        case BUTTON_6:
        case BUTTON_7:
        case BUTTON_8:
        case BUTTON_9:
            if (calculator.formula[length - 1] == STR_BLANK)
                calculator.formula[length - 1] = '';
            calculator.formula[length - 1] += button.textContent;
            break;

        case BUTTON_ADD:
        case BUTTON_SUBTRACT:
        case BUTTON_MULTIPLY:
        case BUTTON_DIVIDE:
            if (length > 1)
            {
                // Evaluate the previous operation
                var eval_arr = calculator.formula.splice(length - 3, 3);
                calculator.formula.unshift(calculator.doMath(eval_arr[0], eval_arr[2], eval_arr[1]));
            }

            // Add the operator and a new blank number to the formula
            calculator.formula.push(button.textContent);
            calculator.formula.push(STR_BLANK);
            calculator.changeState(new StateOperator(calculator));

            break;


        case BUTTON_DECIMAL:
            calculator.formula[length - 1] += button.textContent;
            calculator.changeState(new StateCreateNumberDecimal(calculator));
            break;

        // Only will happen if formula length > 1
        case BUTTON_EQUALS:
            // Evaluate the previous operation
            var eval_arr = calculator.formula.splice(length - 3, 3);
            calculator.formula.unshift(eval_arr[2]);
            calculator.formula.unshift(eval_arr[1]);
            calculator.formula.unshift(eval_arr[0]);
            calculator.formula.push('=');
            calculator.formula.push(calculator.doMath(eval_arr[0], eval_arr[2], eval_arr[1]));
            calculator.changeState(new StateEvaluateEquals(calculator));
            break;

        case BUTTON_CLEAR:
            calculator.formula = [];
            calculator.changeState(new StateInitial(calculator));
            break;

        case BUTTON_CLEAR_E:
            calculator.formula[length - 1] = STR_BLANK;
            calculator.changeState(new StateCreateNumberBlank(calculator));
            break;
    }
};

/**---------------------------------------------------------------------*/
/**
 * StateCreateNumberDecimal Class
 */
function StateCreateNumberDecimal(calculator)
{
    State.call(this, calculator);
}
StateCreateNumberDecimal.prototype = new State();
StateCreateNumberDecimal.prototype.constructor = StateCreateNumberDecimal;
StateCreateNumberDecimal.prototype.init = function(calculator)
{
    this.setButtons(calculator.buttons_obj, calculator.formula);
};
StateCreateNumberDecimal.prototype.setButtons = function(buttons, formula)
{
    this.disableButton(buttons[BUTTON_DECIMAL]);

    if (formula.length <= 1)
    {
        this.disableButton(buttons[BUTTON_EQUALS]);
    }
    else
    {
        var last_item = parseFloat(formula[formula.length - 1]);

        // If the current number entered is "0." or any "0.0..."
        if ((last_item == 0) &&
            (formula[formula.length - 2]) == '/')
        {
            this.disableButton(buttons[BUTTON_ADD]);
            this.disableButton(buttons[BUTTON_SUBTRACT]);
            this.disableButton(buttons[BUTTON_MULTIPLY]);
            this.disableButton(buttons[BUTTON_DIVIDE]);
            this.disableButton(buttons[BUTTON_EQUALS]);
        }
    }
};
StateCreateNumberDecimal.prototype.execute = function(calculator, button)
{
    var length = calculator.formula.length;

    switch (button.textContent)
    {
        case BUTTON_0:
        case BUTTON_1:
        case BUTTON_2:
        case BUTTON_3:
        case BUTTON_4:
        case BUTTON_5:
        case BUTTON_6:
        case BUTTON_7:
        case BUTTON_8:
        case BUTTON_9:
            calculator.formula[length - 1] += button.textContent;

            if (parseFloat(calculator.formula[length - 1]) != 0)
                calculator.changeState(new StateCreateNumberDecimal(calculator));
                //this.setButtons(calculator.buttons_obj, calculator.formula);

            break;

        case BUTTON_ADD:
        case BUTTON_SUBTRACT:
        case BUTTON_MULTIPLY:
        case BUTTON_DIVIDE:
            if (length > 1)
            {
                // Evaluate the previous operation
                var eval_arr = calculator.formula.splice(length - 3, 3);
                calculator.formula.unshift(calculator.doMath(eval_arr[0], eval_arr[2], eval_arr[1]));
            }

            calculator.formula.push(button.textContent);
            calculator.formula.push(STR_BLANK);
            calculator.changeState(new StateOperator(calculator));
            break;

        // Only will happen if formula length > 1
        case BUTTON_EQUALS:
            // Evaluate the previous operation
            var eval_arr = calculator.formula.splice(length - 3, 3);
            calculator.formula.unshift(eval_arr[2]);
            calculator.formula.unshift(eval_arr[1]);
            calculator.formula.unshift(eval_arr[0]);
            calculator.formula.push('=');
            calculator.formula.push(calculator.doMath(eval_arr[0], eval_arr[2], eval_arr[1]));
            break;

        case BUTTON_CLEAR:
            calculator.formula = [];
            calculator.changeState(new StateInitial(calculator));
            break;

        case BUTTON_CLEAR_E:
            calculator.formula[length - 1] = STR_BLANK;
            calculator.changeState(new StateCreateNumberBlank(calculator));
            break;
    }
};


/**---------------------------------------------------------------------*/
/**
 * StateOperator Class
 */
function StateOperator(calculator)
{
    State.call(this, calculator);
}
StateOperator.prototype = new State();
StateOperator.prototype.constructor = StateOperator;
StateOperator.prototype.init = function(calculator)
{
    this.setButtons(calculator.buttons_obj, calculator.formula);
};
StateOperator.prototype.setButtons = function(buttons, formula)
{
    // Prevent divide by 0
    if (formula[formula.length - 2] == '/')
        this.disableButton(buttons[BUTTON_0]);

    this.disableButton(buttons[BUTTON_CLEAR_E]);
};
StateOperator.prototype.execute = function(calculator, button)
{
    var length = calculator.formula.length;

    switch (button.textContent)
    {
        case BUTTON_0:  // Only 0 if we're not dividing
        case BUTTON_1:
        case BUTTON_2:
        case BUTTON_3:
        case BUTTON_4:
        case BUTTON_5:
        case BUTTON_6:
        case BUTTON_7:
        case BUTTON_8:
        case BUTTON_9:
            calculator.formula[length - 1] = button.textContent;
            calculator.changeState(new StateCreateNumber(calculator));
            break;

        case BUTTON_DECIMAL:
            calculator.formula[length - 1] = '0' + button.textContent;
            calculator.changeState(new StateCreateNumberDecimal(calculator));
            break;

        case BUTTON_ADD:
        case BUTTON_SUBTRACT:
        case BUTTON_MULTIPLY:
        case BUTTON_DIVIDE:
            calculator.formula[length - 2] = button.textContent;
            calculator.changeState(new StateOperator(calculator));
            //this.setButtons(calculator.buttons_obj, calculator.formula);
            break;

        case BUTTON_CLEAR:
            calculator.formula = [];
            calculator.changeState(new StateInitial(calculator));
            break;

        case BUTTON_EQUALS:
            // Do the operator with the number before that operator
            calculator.formula[calculator.formula.length-1] = calculator.formula[calculator.formula.length-3];
            var eval_arr = calculator.formula.splice(calculator.formula.length - 3, 3);
            calculator.formula = [];
            calculator.formula.unshift(eval_arr[2]);
            calculator.formula.unshift(eval_arr[1]);
            calculator.formula.unshift(eval_arr[0]);
            calculator.formula.push('=');
            calculator.formula.push(calculator.doMath(eval_arr[0], eval_arr[2], eval_arr[1]));
            calculator.changeState(new StateEvaluateEquals(calculator));
            break;
    }
};

/**---------------------------------------------------------------------*/
/**
 * StateEvaluateEquals Class
 */
function StateEvaluateEquals(calculator)
{
    State.call(this, calculator);
}
StateEvaluateEquals.prototype = new State();
StateEvaluateEquals.prototype.constructor = StateEvaluateEquals;
StateEvaluateEquals.prototype.init = function(calculator)
{
    this.setButtons(calculator.buttons_obj);
};
StateEvaluateEquals.prototype.setButtons = function(buttons)
{
    this.disableButton(buttons[BUTTON_CLEAR_E]);
};
StateEvaluateEquals.prototype.execute = function(calculator, button)
{
    if (calculator.formula.length == 0)
        calculator.formula[0] = '';

    switch (button.textContent)
    {
        case BUTTON_0:
        case BUTTON_1:
        case BUTTON_2:
        case BUTTON_3:
        case BUTTON_4:
        case BUTTON_5:
        case BUTTON_6:
        case BUTTON_7:
        case BUTTON_8:
        case BUTTON_9:
            // We're basically starting over.
            calculator.formula = [];
            calculator.formula[0] = '' + button.textContent;
            calculator.changeState(new StateCreateNumber(calculator));
            break;

        case BUTTON_DECIMAL:
            // We're basically starting over.
            calculator.formula = [];
            calculator.formula[0] = '0' + button.textContent;
            calculator.changeState(new StateCreateNumberDecimal(calculator));
            break;

        case BUTTON_ADD:
        case BUTTON_SUBTRACT:
        case BUTTON_MULTIPLY:
        case BUTTON_DIVIDE:
            calculator.formula = calculator.formula.splice(calculator.formula.length - 1, 1);
            calculator.formula.push(button.textContent);
            calculator.formula.push(STR_BLANK);
            calculator.changeState(new StateOperator(calculator));
            break;

        case BUTTON_CLEAR:
            calculator.formula = [];
            calculator.changeState(new StateInitial(calculator));
            break;

        case BUTTON_EQUALS:
            // Take the result and repeat the last operator and "second" number
            var eval_arr = calculator.formula.splice(calculator.formula.length - 4, 2);
            eval_arr.unshift(calculator.formula[calculator.formula.length - 1]);
            calculator.formula = [];
            calculator.formula.unshift(eval_arr[2]);
            calculator.formula.unshift(eval_arr[1]);
            calculator.formula.unshift(eval_arr[0]);
            calculator.formula.push('=');
            calculator.formula.push(calculator.doMath(eval_arr[0], eval_arr[2], eval_arr[1]));
            break;
    }
};
