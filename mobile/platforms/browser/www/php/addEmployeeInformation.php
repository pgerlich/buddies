
<?php

if ( isset($_GET["ACCID"]) ) { //Check for inputs
	require_once("stripe/stripe.php");

	\Stripe\Stripe::setApiKey("sk_test_ShQv6vg74LT9CpEa6kXg8dwU");

	$account = \Stripe\Account::retrieve($_GET["ACCID"]);
	$account->legal_entity->dob->month = 4; //DOB Month
	$account->legal_entity->dob->day = 26; //DOB Day
	$account->legal_entity->dob->year = 1994; //DOB Year
	$account->legal_entity->first_name = "Paul"; //Firstname
	$account->legal_entity->last_name = "Gerlich"; //Last name
	$account->legal_entity->type = "individual"; //Individual or company
	$account->transfer_schedule->delay_days = 14; //How often to pay
	$account->transfer_schedule->interval = "daily"; //How often to process payments to their account
	$account->save();

	echo $account;
} else {
	echo "Failed";
}

?>