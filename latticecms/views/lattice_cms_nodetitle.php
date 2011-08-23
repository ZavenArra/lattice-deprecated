<div class="objectTitle">	
	<div class="<?if($allowTitleEdit):?>ui-Text<?endif;?> grid_7" data-isMultiline='false' data-field='title'>
		<input type='text' class='og title<?=$translationModifier;?> h2' value="<?=$title;?>" />
	</div>
	<?if(Kohana::config('cms.enableSlugEditing')):?>
	<?/*<?=$translationModifier;?> //may not actually need this, since modules only look within themselves... still its good to have*/?>
	<div class="ui-Text discrete grid_2" data-field='slug'>
				<input type="text" class="og p" value="<?=$slug;?>" />
	</div>
 	<?endif;?>

  <?foreach($languages as $language):?>
		<a href="<?=latticeurl::site('cms/getTranslatedPage/'.$id.'/'.$language->code);?>"><?=$language->fullname;?></a>
  <?endforeach;?>

	<div class="clear"></div>

</div>
