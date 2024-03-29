<li data-objectid="<?=$data['id'];?>" id="item_<?=$data['id'];?>" class="listItem">

	<div div class="clearFix">
	<?if(!$data['superuser'] || latticeutil::checkRoleAccess('superuser')):?>
		<?=latticeui::Text( 'username', "rows-1 validation-nonEmpty grid_2 alpha", "p", $data['username'], 'Username' );?>
		<?=latticeui::Text( 'firstname', "rows-1 validation-nonEmpty grid_2 alpha", "p", $data['firstname'], 'First Name' );?>
		<?=latticeui::Text( 'lastname', "rows-1 validation-nonEmpty grid_2 alpha", "p", $data['lastname'], 'Last Name' );?>
		<?=latticeui::Text( 'email', "rows-1 validation-email grid_3 omega", "p", $data['email'], 'Email' );?>
		<?=latticeui::Password( 'password', "rows-1 validation-nonEmpty type-password grid_3 omega", "p", '', 'Reset and Mail Password' );?>
	<?else:?>
		<?=$data['username'];?>	
	<?endif;?>
	</div>

	<?if(!$data['superuser'] || latticeutil::checkRoleAccess('superuser')):?>
		<?=latticeui::radioGroup( 'role', '', $managedRoles, $data['role'], 'User Role');?>
	<?else:?>
		Superuser
	<?endif;?>
	
	<div class="itemControls clearFix">
		<a href="#" title="delete this list item" class="icon delete">delete</a>
		<a href="#" title="submit" class="button submit hidden">submit</a>
		<a href="#" title="cancel" class="button cancel hidden">cancel</a>
	</div>

</li>
