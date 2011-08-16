<?

Class Controller_PublicMenu extends Controller_MOP {


	public function action_index(){
		$this->view = new View('publicnav');

		$parentId = Graph::getRootNode('cmsRootNode')->id;
		$topLevel = ORM::Factory('object')
			->where('parentId', '=', $parentId)
			->publishedFilter()
			->noContainerObjects()
			->find_all();
		//need ignores

		$navi = array();
		foreach($topLevel as $object){
			$entry = array();
			$entry['title'] = $object->contenttable->title;
			$entry['slug'] = $object->slug;
			$entry['path'] = $object->slug;

			$navi[$object->slug] = $entry;
		}

		//check for children
		foreach($navi as $slug => $entry){

			$object = ORM::Factory('object')->where('slug', '=', $slug)->find();
			$children = ORM::Factory('object')
				->where('parentId', '=', $object->id)
				->publishedFilter()
				->noContainerObjects()
				->find_all();
			if(count($children)){
				$entry['children'] = array();
				foreach($children as $child){
					$childEntry = array();
					$childEntry['title'] = $child->contenttable->title;
					$childEntry['slug'] = $child->slug;
					$childEntry['path'] = $object->slug.'/'.$child->slug;

					$children2 = ORM::Factory('object')
						->where('parentId', '=', $child->id)
						->publishedFilter()
						->noContainerObjects()
						->find_all();
					foreach($children2 as $child2){
						$childEntry2 = array();
						$childEntry2['title'] = $child2->contenttable->title;
						$childEntry2['slug'] = $child2->slug;
						$childEntry2['path'] = $object->slug.'/'.$child->slug.'/'.$child2->slug;
						$childEntry['children'][] = $childEntry2;
					}




					$navi[$slug]['children'][] = $childEntry;
				}
			}
		}


		$this->view->navi = $navi;
		$this->response->body($this->view->render());

	}

}
