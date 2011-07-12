<?
/**
* Class: Navigation_Controller 
*
*
*/

class Controller_Navigation extends Controller_MOP{

	private $objectModel = 'object';

	private $defaultAddCategoryText = '';
	private $defaultAddLeafText = '';

	public function __construct($request, $response){
		parent::__construct($request, $response);

		$this->defaultAddCategoryText = Kohana::config('navigation.addCategoryText');
		$this->defaultAddLeafText = Kohana::config('navigation.addLeafText');
	}


	public function action_index($deeplink=null){
		
		//$this->view = new View(strtolower($this->controllername));
		////this should check and extend
		$this->view = new View('navigation');
		$this->response->body($this->view->render());

	}

	
	public function action_getTier($parentId, $deeplink=NULL, &$follow=false){
      if($parentId != 0){
      	$parent = ORM::Factory($this->objectModel, $parentId); 
			}
		 /*	else {
         $parentId = Graph::getRootNode(Kohana::config('cms.graphRootNode'))->id;  //this is a codependency
         $parent = ORM::Factory($this->objectModel, $parentId);
		 }*/

		$items = ORM::factory($this->objectModel);
		$items->where('parentId', '=',  $parentId);
		$items->where('activity', 'IS', NULL);
		$items->order_by('sortorder');
		$iitems = $items->find_all();
		if($iitems){
			$sendItemContainers = array(); //these will go first
			$sendItemObjects = array();
			foreach($iitems as $child){
				if(strtolower($child->template->nodeType) == 'container'){
					//we might be skipping this node

					//echo sprintf('//template[@name="%s"]/elements/list[@family="%s"]', $parent->template->templatename, $child->template->templatename);
					$display = mop::config('objects', sprintf('//template[@name="%s"]/elements/list[@family="%s"]', 
						$parent->template->templatename,
						$child->template->templatename))
						->item(0)
						->getAttribute('display');
					if($display == 'inline'){
						continue;
					}
				}
				$sendItem = Navigation::getNodeInfo($child);

				//implementation of deeplinking
				$sendItem['follow'] = false;
				if($child->id == $deeplink){
					$sendItem['follow'] = true;
					$follow = true;
				}

				//and deeplinking for categories
				$follow_tier = false;
				// $children = $this->_getNavTree_recurse($child->id, $deeplink, $follow_tier);
				if($follow_tier==true){
					$sendItem['follow'] = true;
					$follow='true';
				}
				// $sendItem['children'] = $children;

				if(strtolower($child->template->nodeType)=='container'){
					$sendItemContainers[] = $sendItem;
				} else {
					$sendItemObjects[] = $sendItem;
				}
			}
			//this puts the folders first
			$sendItemObjects = array_merge($sendItemContainers, $sendItemObjects);
         

			//add in any modules
			//if(!$parent->loaded()){
			if($parent->id == Graph::getRootNode(Kohana::config('cms.graphRootNode'))->id ){
				$cmsModules = mop::config('cmsModules', '//module');
				foreach($cmsModules as $m){

					$entry = array();
					$entry['id'] = $m->getAttribute('controller');
					$entry['slug'] = $m->getAttribute('controller');
					$entry['nodeType'] = 'module';
					$entry['contentType'] = 'module';
					$entry['title'] = $m->getAttribute('label');
					$entry['children'] = array();
					$sendItemObjects[] = $entry;
				}
			}
		//	} else {
				//this is where we would handle the addition to modules on a template basis
		//	}

			$this->response->data(array('nodes'=>$sendItemObjects));

			$nodes = array();
			foreach($sendItemObjects as $item){

				$nodeView = new View('navigationNode');
				$nodeView->content = $item;
				$nodes[] = $nodeView->render();
			}

			$tierView = new View('navigationTier');
			$tierView->nodes = $nodes;

			$tierMethodsDrawer = new View('tierMethodsDrawer');
			$tierMethodsDrawer->addableObjects = $parent->template->addableObjects;

			$tierView->tierMethodsDrawer = $tierMethodsDrawer->render();
			$this->response->body($tierView->render());

		} 
	}

	public function getTemplates(){
		$templates = array();
		foreach(mop::config('objects', '//template') as $template){
			$entry = array();
			$entry['templateName'] = $template->getAttribute('name');	
			$entry['label'] = $template->getAttribute('name').' label';	
			$entry['nodeType'] = $template->getAttribute('nodeType');	
			$entry['contentType'] = $template->getAttribute('contentType');	
			$templates[] = $entry;
		}
		return $templates;
	}
		
}

?>