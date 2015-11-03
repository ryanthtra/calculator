function CalculatorController()
{
    this.calc_stack = [];
    this.result = 0;        // The resulting value of the last calculator after closing the parentheses
    this.curr_cal = null;
    this.master_formula = [];
    this.init();
}

CalculatorController.prototype.init = function()
{
    this.pushCalculator();
};

CalculatorController.prototype.reset = function()
{
    this.calc_stack = [];
    this.result = 0;        // The resulting value of the last calculator after closing the parentheses
    this.curr_cal = null;
    this.master_formula = [];
    this.init();
}

CalculatorController.prototype.pushCalculator = function()
{
    this.calc_stack.push(null);
    this.calc_stack[this.calc_stack.length-1] = new Calculator(this);
    this.curr_cal = this.calc_stack[this.calc_stack.length-1];
};

CalculatorController.prototype.popCalculator = function(result)
{
    this.result = result;

    if (!this.isFirstCalculator())
    {
        this.calc_stack.pop();
        this.curr_cal = this.calc_stack[this.calc_stack.length-1]
        this.curr_cal.formula[this.curr_cal.formula.length-1] = result;
        this.curr_cal.changeState(this.curr_cal.current_state);
    }
};

CalculatorController.prototype.isFirstCalculator = function()
{
    return (this.calc_stack.length <= 1);
};

CalculatorController.prototype.getValFromNewCalculator = function()
{
    this.pushCalculator();

    return this.result;
};
