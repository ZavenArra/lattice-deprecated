<div class="ui-FileElement <?=$class;?>" data-field="<?=$name;?>" data-extensions="<?=$extensions;?>" data-maxlength="<?=$maxlength;?>">
	<label><?=(isset($label))?$label:"Image File";?></label>
	<div class="wrapper">
		<input type="file" class="hidden" />

		<?if(isset($value['id'])):?>
			<p class="fileName <?=str_replace(',',' ',$extensions);?>"><?=$value['filename'];?></p>
		<?else:?>
			<p class="fileName <?=str_replace(',',' ',$extensions);?>">No image uploaded yet&hellip;</p>			
		<?endif;?>
		<div class="preview">
			<?if(isset($value['id'])):?>
				<img src="<?=url::site(Graph::mediapath().$value['thumbSrc'], null, false);?>" width="<?=$value['width'];?>" height="<?=$value['height'];?>" alt="<?=$value['filename'];?>"/>
			<?endif;?>
		</div>
		<div class="status hidden">
		<img src="<?=url::site('lattice/lattice/views/images/bar.gif', null, false);?>" class="progress" />
			<span class="message hidden"></span>
		</div>
		<div class="controls clearFix">
			<div class='uploadButton command'><a title="upload a file" class="uploadLink" href="#">&uarr;</a></div>
			<?if(isset($value['id'])):?>
				<a title="download <?=$value['filename'];?>" class="command downloadLink" href="<?=url::site("file/download/{$value['id']}");?>">&darr;</a>
				<a title="clear this file" class="command clearImageLink" href="#">&times;</a>
			<?else:?>
				<a title="download" class="command downloadLink hidden" target="_blank" href="#">&darr;</a>
				<a title="clear this file" class="command clearImageLink hidden" href="#">&times;</a>
			<?endif;?>
		</div>
	</div>
</div>
	
