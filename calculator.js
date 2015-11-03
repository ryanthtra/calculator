function Calculator(calculator_controller)
{
    this.formula = [];
    this.current_state = null;
    this.buttons_obj = {};
    this.$display_queue = null;
    this.$display_current = null;
    this.controller = calculator_controller;
    if (IS_DEBUG)
        this.keycode = null;

    this.init();
}

/**
 * init - function that initializes all the things we
 *  want the calculator to be immediately after construction.
 */
Calculator.prototype.init = function()
{
    // Get the display elements
    this.$display_queue = $('#display-record');
    this.$display_current = $('#display-current');

    this.collectButtons();

    // Always start the page in the initial state.
    this.changeState(new StateInitial(this));

    // This will make the main display show "START" at launch.
    this.updateDisplay();
};

/**
 * collectButtons - gets all the buttons in the calculator and
 *  hold their references in a dictionary (key/value array)
 */
Calculator.prototype.collectButtons = function()
{
    // jQuery all the buttons on the page
    var buttons = $('button');

    // Uses the text in each button as the 'key' for each
    // entry in the dictionary, and the value is the button itself.
    for (var i = 0; i < buttons.length; i++)
    {
        this.buttons_obj[buttons[i].textContent] = (buttons[i]);
    }
};

/**
 * onButtonPressed - the primary button click-handler, i.e.,
 *  this is called whenever a button is clicked (if not disabled)
 * @param button - the button that was clicked
 */
Calculator.prototype.onButtonPressed = function(button)
{
    this.current_state.execute(this, button);
    this.updateDisplay();
};

Calculator.prototype.onKeyPressed = function(key)
{
    this.keycode = key;
    this.updateDisplay();
    //var key_found = this.buttons_obj[key];
    //if (key_found != undefined)
    //    if ($(key_found).prop('disabled') == false)
    //        this.onButtonPressed(key_found);
};

/**
 * changeState - changes the state of the calculator
 * @param new_state - the state we are transitioning to
 */
Calculator.prototype.changeState = function(new_state)
{
    this.current_state = null;
    // The new state will pick which buttons will be disabled when
    // calling the state's init method.
    this.enableButtons();
    this.current_state = new_state;
    this.current_state.init(this);
};

/**
 * enableButtons - resets (enables) all the buttons
 */
Calculator.prototype.enableButtons = function()
{
    $('button').prop('disabled', false);
};

/**
 * updateDisplay - changes the textContent of the
 *  #display-xxxx elements
 */
Calculator.prototype.updateDisplay = function()
{
    var formula = this.formula;
    var length = formula.length;
    if (length <= 1)
        this.$display_queue.text('');
    else if (length == 3)
        this.$display_queue.text(this.formula[length-3] + ' ' + this.formula[length-2]);
    else    // length > 3
        this.$display_queue.text(this.formula[length-5] + ' ' + this.formula[length-4] + ' ' + this.formula[length-3] + ' ' + this.formula[length-2]);

    if (length == 0)
        this.$display_current.text(STR_START);
    else
        this.$display_current.text(this.formula[length - 1]);

    if (IS_DEBUG)
    {
        $('#keycode').text('' + this.keycode);
        $('#formula').text(this.formula);
    }
};

/**
 *
 * @param num1
 * @param num2
 * @param op
 * @returns {number}
 */
Calculator.prototype.doMath = function(num1, num2, op)
{
    var x = parseFloat(num1);
    var y = parseFloat(num2);

    var result = 0;

    switch (op)
    {
        case '+':
            result = x + y;
            break;

        case '-':
            result = x - y;
            break;

        case 'x':
            result = x * y;
            break;

        case '/':
            result = x / y;
            break;
    }
    return result;
};


Calculator.prototype.resetAll = function()
{
    this.controller.reset();
};