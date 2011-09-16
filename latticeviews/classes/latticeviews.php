<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of latticeviews
 *
 * @author deepwinter1
 */
class latticeviews {

   public static function createView($objectidorslug){
      
      
      if(!is_object($objectidorslug)){
         $object = Graph::object($objectidorslug);
      } else {
         $object = $objectidorslug;
      }
		//some access control
		$viewName = null;
      $view = null;
		if ($object->loaded()) {
			if ($object->activity != null) {
				throw new Kohana_User_Exception('Page not availabled', 'The object with identifier ' . $id . ' is does not exist or is not available');
			}
			//look for the objectType, if it's not there just print out all the data raw
			$viewName = $object->objecttype->objecttypename;
			if (file_exists('application/views/frontend/' . $viewName . '.php')) {
				$viewPath = 'frontend/'.$viewName;
			} else if(file_exists('application/views/generated/' . $viewName . '.php')) {
				$viewPath = 'generated/'.$viewName;
			} else {
				$viewPath = 'default';
			}
			$view = new View($viewPath);
		} else {
			//check for a virtual object specified in frontend.xml
			//a virtual object will be one that does not match a objectType
			$viewName = $objectidorslug;
			$view = new View('frontend/'.$viewName);
		}

		//call this->view load data
		//get all the data for the object
		$viewContent = latticeviews::getViewContent($viewName, $object);
		foreach ($viewContent as $key => $value) {
			$view->$key = $value;
		}
      
      return $view;
   }
 
	public static function getViewContent($view, $slug=null) {

		$data = array();
      
      $object = null;
      if  ($slug) {

         if (!is_object($slug)) {
            $object = Graph::object($slug);
         } else {
            $object = $slug;
         }
      }

		if ($view == 'default') {
			if (!$object->loaded()) {
				throw new Koahan_Exception('latticeviews::getViewContent : Default view callled with no slug');
			}
			$data['content']['main'] = $object->getPageContent();
			return $data;
		}

		$viewConfig = lattice::config('frontend', "//view[@name=\"$view\"]")->item(0);
		if (!$viewConfig) {
        // throw new Kohana_Exception("No View setup in frontend.xml by that name: $view");
		}
		if (!$viewConfig || ($viewConfig && $viewConfig->getAttribute('loadPage'))) {
         if (!$object->loaded()) {
				throw new Kohana_Exception('latticeviews::getViewContent : View specifies loadPage but no object to load');
			}
			$data['content']['main'] = $object->getPageContent();
		}

		$includeContent = latticeviews::getIncludeContent($viewConfig, $object->id);
		foreach ($includeContent as $key => $values) {
			$data['content'][$key] = $values;
		}

		if ($subViews = lattice::config('frontend', "subView", $viewConfig)) {
			foreach ($subViews as $subview) {
				$view = $subview->getAttribute('view');
				$slug = $subview->getAttribute('slug');
				$label = $subview->getAttribute('label');
				if (lattice::config('frontend', "//view[@name=\"$view\"]")) {

					if ($view && $slug) {
						$subViewContent = latticeviews::getViewContent($view, $slug);
					} else if ($slug) {
                  $object = Graph::object($slug);
						$view = $object->objecttype->objecttypename;
						$subViewContent = latticeviews::getViewContent($view, $slug);
					} else if ($view) {
						$subViewContent = latticeviews::getViewContent($view);
					} else {
						die("subview $label must have either view or slug");
					}
					$subView = new View($view);

					foreach ($subViewContent as $key => $content) {
						$subView->$key = $content;
					}
					$data[$label] = $subView->render();
				} else {
					//assume it's a module
					$data[$label] = lattice::buildModule(array('modulename' => $view/* , 'controllertype'=>'object' */), $subview->getAttribute('label'));
				}
			}
		}

		return $data;
	}

	public static function getIncludeContent($includeTier, $parentId){
    $content = array();
    if($includeContentQueries = lattice::config('frontend', 'includeData', $includeTier)) {
         foreach ($includeContentQueries as $includeContentQueryParams) {
            $query = new Graph_ObjectQuery();
            $query->initWithXml($includeContentQueryParams);
            $includeContent = $query->run($parentId);

            for ($i = 0; $i < count($includeContent); $i++) {
               $children = latticeviews::getIncludeContent($includeContentQueryParams, $includeContent[$i]['id']);
               $includeContent[$i] = array_merge($includeContent[$i], $children);
            }
            $content[$query->attributes['label']] = $includeContent;
         }
    }
    return $content;
  }

    
}
 