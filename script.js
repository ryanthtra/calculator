var my_calculator = new calculator(newFunc);

/**
 *
 * @param type - a string
 * @param value - a string or a number
 * @param item - an Object
 */
function newFunc(type, value, item)
{
    console.log("Type: " + type + ", Value: " + value + ", Item: " + item);

    //if (value.length > 20)

    $('#display-current').text(value);
}


/**
 *
 * @param the_button
 */
function onCalculatorButtonClicked(the_button)
{
    var val = $(the_button).text();

    switch (val)
    {
        case 'C':
            my_calculator.allClear();
            resetDisplay();
            break;
        case 'VICE':
            my_calculator.clear();
            resetCurrentInput();
            break;
        default:
            my_calculator.addItem(val);
            break;
    }
}

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

    $('#calculator-body').on('click', 'button', function()
    {
        console.log("Button Pressed Text: " + $(this).text());
        onCalculatorButtonClicked($(this));
    });
});




