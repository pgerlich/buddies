<?php
    if (isset($_POST["submit"])) {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $city = $_POST['city'];
        $state = $_POST['state'];
        $zipcode = $_POST['zipcode'];
        $reference = $_POST['reference'];
        $comments = $_POST['comments'];
        $human = intval($_POST['human']);
        $from = 'Become a Buddy Form Results';
        $to = 'ogubin@iastate.edu';
        $subject = 'Become a Buddy Form Results';

        $body = "From: $name\n E-Mail: $email\n Location: $city\n State: $state\n Zipcode: $zipcode\n How they heard about us: $reference\n Additional Comments: &comments";


        //Check if simple anti-bot test is correct
        if ($human !== 5) {
            $errHuman = 'Your anti-spam is incorrect';
        }

// If there are no errors, send the email
if (!$errHuman) {
    if (mail ($to, $subject, $body, $from)) {
        $result='<div class="alert alert-success">Thank You! We will be in touch</div>';
    } else {
        $result='<div class="alert alert-danger">Sorry there was an error sending your message. Please try again later</div>';
    }
}
    }
    return true;
?>