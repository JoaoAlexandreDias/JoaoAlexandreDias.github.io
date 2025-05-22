function setup() {
    noCanvas();
    var email = select("#email");
    var email_parent = email.parent();
    
    const email_input = createInput();
    email_input.value(email.elt.innerText);
    email_input.hide();

    const email_button = createButton('Copy');
    email_button.style('margin-top', '5px');
    email_button.style('padding', '7px');
    email_button.style('backgroundColor', 'rgb(54 54 85)');
    email_button.style('color', 'white');
    email_button.style('border', 'none');
    email_button.style('borderRadius', '5px');
    email_button.style('cursor', 'pointer');
    email_button.style('fontSize', '16px');
    email_button.style('fontWeight', 'bold');
    email_button.style('textAlign', 'center');
    email_button.style('display', 'inline-block');
    email_button.style('textDecoration', 'none');
    email_button.style('zIndex', '1000');
    email_button.style('position', 'absolute');
    email_button.style('width', '70px');
    email_button.hide();
    email_button.parent(email_parent);








    email_button.mousePressed(function() {
        //email_input.show();
        navigator.clipboard.writeText(email_input.elt.value)
            .then(() => {
                console.log("Email copied to clipboard");
            })
            .catch(err => {
                console.error("Failed to copy email: ", err);
            });
        console.log(email_input.elt.value);
        // email_input.hide();
    });

    email.mouseOver(function() {
        email_button.show();
    });
    email.mouseOut(function() {
        // Hide the button after 5 seconds to give the user time to click it
        setTimeout(() => {
            email_button.hide();
        }, 2000);
    });

    console.log(email.parent());

  noLoop();
}
function draw() {

}
function windowResized() {
    
}
