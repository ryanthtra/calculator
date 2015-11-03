document.addEventListener("DOMContentLoaded", function(event)
{
    console.log("HELLO WORLD!!!");

    calculator_controller =  new CalculatorController();

    $('#calculator-body').on('click', 'button', function()
    {
        console.log("Button Pressed Text: " + $(this).text());
        //onCalculatorButtonClicked($(this));
        calculator_controller.calc_stack[calculator_controller.calc_stack.length-1].onButtonPressed(this);
    });

    $('body').keydown(function(event)
    {
        calculator.onKeyPressed(event.which);
    });
});




