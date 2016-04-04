# Calculator
Code for the demo version is <a href="https://github.com/ryanthtra/calculator/tree/gh-pages">here.</a>

## Description
This project required the development of a fully-functioning arithmetic calculator.  A spreadsheet was also provided, which basically consisted of steps taken to test the proper functionality of the project to make sure it behaved like most calculators do.

### Additional Notes:
>
- While it was never required, I implemented an object-oriented state machine that controlled which buttons were allowed to be pressed.  For example, the number 0 was disabled immediately after pressing the division button (in order to avoid division by zero).
- Floating point precision issues have not yet been accounted for; therefore the "0.2 + 0.1" calculation error is still present in this version.  
- The ability to used the keyboard to operate the calculator has not yet been implemented.
