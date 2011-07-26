<div class="ui-FileElement field-<?=$field;?> extensions-<?=str_replace(',','_',$extensions);?> maxlength-<?=$maxlength;?> <?=$class;?> ">
	<label><?=isset($label)?$label:'File';?></label>
	<div class="wrapper">
		<input type="file" class="hidden" />
		<p class="<?=str_replace(',',' ',$extensions);?> filename"><?if($value):?><?=$value['filename'];?><?else:?>No file uploaded yet.<?endif;?></p>
		<div class="status hidden">
		<img src="<?=url::site('lattice/mopcms/views/images/bar.gif', null, false);?>" class="progress" />
			<span class="message hidden"></span>
		</div>
		<div class="controls">
			<a class="command uploadLink" href="#">&uarr;</a>
			<?if($value):?>
				<a class="command clearImageLink" href="#">x</a>
				<a class="command downloadLink" href="<?=url::site("file/download/{$value['id']}");?>">download</a>
			<?else:?>
				<a class="command clearImageLink hidden" href="#">x</a>
				<a class="command downloadLink hidden" target="_blank" href="#">&darr;</a>
			<?endif;?>
		</div>
	</div>
</div>
