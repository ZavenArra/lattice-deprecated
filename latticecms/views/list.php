<div id="list_<?=$listObjectId;?>" class="module <?=$class;?> classPath-lattice_modules_List">
   <!-- changed id to list, since this is what controls submission
   but of course this can't be the id, since there can be multiple lists in the object
   instance idea needs to be changes -->
	
	<?if(isset($label) && $label):?>
	<label class='listLabel'><?=$label;?></label>
	<?endif;?>

	<div class="controls clearFix"><a href="#" class="addItem button">Add an Item</a></div>
	
	<ul class="listing">
		<?=$items;?>
	</ul>


	

</div>

