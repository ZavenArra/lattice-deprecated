<?

class Controller_CMS extends Lattice_CMS {

	public function getRootObject(){
		$rootObjectType = ORM::factory('objectType')->where('objectTypeName', '=', Kohana::config('cms.graphRootNode'))->find();
		$rootObject = Graph::object()->objectTypeFilter($rootObjectType->id)->find();
		return $rootObject;

	}
  
   public function cms_addObject($parentId, $objectTypeId, $data) {
         
		 $newId = Graph::object($parentId)->addObject($objectTypeId, $data);
		 return $newId;

   }
   
   public function cms_getNodeInfo($id){
      
		 //Dial up associated navi and ask for details
		 return Navigation::getNodeInfoById($id);

   }
   
	 public function cms_getNodeHtml($id){

		 //Dial up associated navi and ask for details
		 $item = Navigation::getNodeInfoById($id);
		 $nodeView = new View('navigationNode');
		 $nodeView->content = $item;
		 return $nodeView->render();

	 }

}
