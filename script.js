/**
 *
 * @param the_button
 */

function resetDisplay()
{
    $('#display-record').text('');
    resetCurrentInput();
}

function resetCurrentInput()
{
    $('#display-current').text('0');
}

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
});




