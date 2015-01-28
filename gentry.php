<?php
$page_security = 'SA_GENTRYEDIT';
$path_to_root="../..";

include($path_to_root . "/includes/session.inc");
add_access_extensions();
add_js_ufile($path_to_root . "/modules/sgw_gentry/vendor_bower/angular/angular.js");
add_js_ufile($path_to_root . "/modules/sgw_gentry/vendor_bower/ui-router/release/angular-ui-router.js");
add_js_ufile($path_to_root . "/modules/sgw_gentry/vendor_bower/angular-ui-grid/ui-grid.js");
add_js_ufile($path_to_root . "/modules/sgw_gentry/assets/gentry-min.js");

include_once($path_to_root . "/includes/ui.inc");
// include_once($path_to_root . "/modules/import_paypal/includes/import_paypal_db.inc");
// include_once($path_to_root . "/includes/db/crm_contacts_db.inc");
// include_once($path_to_root . "/sales/includes/db/customers_db.inc");

function log_message($msg) {
    global $path_to_root;
    $fp = fopen($path_to_root."/tmp/gentry.log", "a+");
    fwrite($fp, "[".date("d-M-Y H:i:s")."] ".$msg."\r\n");
    fclose($fp);
}

// TODO Pretty sure the API exposes this. CP 2015-01
function write_customer($email, $name, $company, $address, $phone, $fax, $currency) {

    global $paypal_sales_type_id, $paypal_tax_group_id, $paypal_salesman, $paypal_area,
        $paypal_location, $paypal_credit_status, $paypal_shipper;
    global $SysPrefs;

    log_message("Memory, write_customer start:".memory_get_usage());
    $customer_id = find_customer_by_email($email);
    if (empty($customer_id)) {
    	$customer_id = find_customer_by_name($company);
    }
    if (empty($customer_id)) {
        //it is a new customer
        begin_transaction();
        add_customer($company, substr($company,0,30), $address,
            '', $currency, 0, 0,
            $paypal_credit_status, -1,
            0, 0,
            $SysPrefs->default_credit_limit(),
            $paypal_sales_type_id, 'PayPal');

        $customer_id = db_insert_id();

        add_branch($customer_id, $company, substr($company,0,30),
            $address, $paypal_salesman, $paypal_area, $paypal_tax_group_id, '',
            get_company_pref('default_sales_discount_act'), get_company_pref('debtors_act'),
            get_company_pref('default_prompt_payment_act'),
            $paypal_location, $address, 0, 0,
            $paypal_shipper, 'PayPal');

        $selected_branch = db_insert_id();

        $nameparts = explode(" ", $name);
        $firstname = "";
        for ($i=0; $i<(count($nameparts) - 1); $i++) {
            if (!empty($firstname)) {
                $firstname .= " ";
            }
            $firstname .= $nameparts[$i];
        }
        $lastname = $nameparts[count($nameparts)-1];
        add_crm_person('paypal', $firstname, $lastname, $address,
            $phone, '', $fax, $email, '', '');

        add_crm_contact('customer', 'general', $selected_branch, db_insert_id());

        commit_transaction();
    }
    else {
    	$selected_branch = 0;
    }
    log_message("Memory, write_customer end:".memory_get_usage());
    return array($customer_id, $selected_branch);
}

page(_("GENTRY Edit"), false, false, '', '', false, $path_to_root . '/modules/sgw_gentry/vendor_bower/angular-ui-grid/ui-grid.css');
$user_id = $_SESSION["wa_current_user"]->username;
$saveFilename = '';
include_once('gentry.html');
end_page();
?>
