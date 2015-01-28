<?php
define('SS_GENTRY', 120 << 8);

class hooks_sgw_gentry extends hooks
{

	var $module_name = 'gentry';

	/*
	 * Install additional menu options provided by module
	 */
	function install_options($app)
	{
		global $path_to_root;

		switch ($app->id) {
			case 'GL':
				$app->add_lapp_function(
					0, _('Bulk Transactions'),
					$path_to_root . '/modules/sgw_gentry/gentry.php', 'SA_GENTRYEDIT', MENU_TRANSACTION
				);
				break;
			case 'system':
				$app->add_lapp_function(
					1, _('Bulk Transaction (GEntry) Setup'),
					$path_to_root . '/modules/sgw_gentry/setup.php', 'SA_GENTRYSETUP', MENU_MAINTENANCE
				);
				break;
		}
	}

	function install_access()
	{
		$security_sections[SS_GENTRY] = _("GEntry Items");

		$security_areas['SA_GENTRYSETUP'] = array(
			SS_GENTRY | 1,
			_("GEntry Setup")
		);
		$security_areas['SA_GENTRYEDIT'] = array(
		    SS_GENTRY | 2,
		    _("Bult Transaction Import/Edit")
		);

		return array(
			$security_areas,
			$security_sections
		);
	}

	/* This method is called on extension activation for company. */
	function activate_extension($company, $check_only = true)
	{
		global $db_connections;

		$updates = array(
			'update.sql' => array(
				'import_paypal'
			)
		);

		return $this->update_databases($company, $updates, $check_only);
	}
}
?>