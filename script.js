document.addEventListener("DOMContentLoaded", function(event)
{
    console.log("HELLO WORLD!!!");

    calculator = new Calculator();

    $('#calculator-body').on('click', 'button', function()
    {
        console.log("Button Pressed Text: " + $(this).text());
        //onCalculatorButtonClicked($(this));
        calculator.onButtonPressed(this);
    });

    $('body').keydown(function(event)
    {
        calculator.onKeyPressed(event.which);
    });
});




