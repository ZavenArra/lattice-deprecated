<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Ajax extends Controller_Lattice {

	public function action_index()
	{
		throw new HTTP_Exception_404('Ajax controller called without action. Check URL.');
	}
   
   private function handleException($e){
      
      // Get the exception information
      $type    = get_class($e);
      $code    = $e->getCode();
      $message = $e->getMessage();
      $file    = $e->getFile();
      $line    = $e->getLine();

      // Get the exception backtrace
      $trace = $e->getTrace();
      
      ob_start();

      // Include the exception HTML
      if ($view_file = Kohana::find_file('views', Kohana_Exception::$error_view))
      {
        include $view_file;
      }
      else
      {
        throw new Kohana_Exception('Error view file does not exist: views/:file', array(
          ':file' => Kohana_Exception::$error_view,
        ));
      }

      // Display the contents of the output buffer
      $message = ob_get_clean();
      return $message;
   }

	public function action_data($uri)
	{
		//request to child, just data
		$arguments = explode('/', $uri);

		try {
			$subRequest = Request::Factory($uri);
			$data = $subRequest->execute()->data();
		} catch (Exception $e) {
			//return HTML from exception
         
          // Start an output buffer
   
			$ajaxResponse = array(
				'returnValue' => FALSE,
				'response' => $this->handleException($e),
				'arguments'=>$arguments

			);
			$this->response->headers('Content-Type', 'application/json');
			$this->response->body(json_encode($ajaxResponse));
			return;
		}
		$ajaxResponse = array(
			'returnValue' => TRUE,
			'response'=>$data,
			'arguments'=>$arguments
		);
		$this->response->headers('Content-Type', 'application/json');
		$this->response->body(json_encode($ajaxResponse));
		$this->response->body();
	}

	public function action_html($uri)
	{
		Kohana::$log->add(Log::INFO, 'Ajax html request begin');
		$arguments = explode('/', $uri);

		try {
			$subRequest = Request::Factory($uri);
			$html = $subRequest->execute()->body();
		} catch (Exception $e) {
			//return HTML from exception

			$message = $e;
			$ajaxResponse = array(
				'returnValue' => FALSE,
				'response' => $this->handleException($e),
				'arguments'=>$arguments

			);
			$this->response->headers('Content-Type', 'application/json');
			$this->response->body(json_encode($ajaxResponse));
			return;
		}


		$cssResources = array();
		foreach($this->resources['librarycss'] as $css){
			array_push($cssResources, $css);
		}
		foreach($this->resources['css'] as $css){
			array_push($cssResources, $css);
		}

		$jsResources = array();
		foreach($this->resources['libraryjs'] as $js){
			array_push($jsResources, $js);
		}
		foreach($this->resources['js'] as $js){
			array_push($jsResources, $js);
		}

		$ajaxResponse = array(
			'response'=>array(
				'html'=>$html,
				'js'=>$jsResources,
				'css'=>$cssResources
			),
			'returnValue' => TRUE,
			'arguments'=>$arguments
		);
		$this->response->headers('Content-Type', 'application/json');
		$this->response->body(json_encode($ajaxResponse));
	}

	public function action_compound($uri)
	{
		$arguments = explode('/', $uri);

		try {
   		$subRequest = Request::Factory($uri);
			$requestResponse = $subRequest->execute();
   	} catch (Exception $e) {
			//return HTML from exception
			$message = $e;
			$ajaxResponse = array(
				'returnValue' => FALSE,
				'response' => $this->handleException($e),
				'arguments'=>$arguments
			);
			$this->response->headers('Content-Type', 'application/json');
			$this->response->body(json_encode($ajaxResponse));
			return;
		}


		$cssResources = array();
		foreach($this->resources['librarycss'] as $css){
			array_push($cssResources, $css);
		}
		foreach($this->resources['css'] as $css){
			array_push($cssResources, $css);
		}

		$jsResources = array();
		foreach($this->resources['libraryjs'] as $js){
			array_push($jsResources, $js);
		}
		foreach($this->resources['js'] as $js){
			array_push($jsResources, $js);
		}


		$compoundResponse = array(
			'data' => $requestResponse->data(),
			'html' => $requestResponse->body(),
			'css' => $cssResources,
			'js' => $jsResources,
		);
		$ajaxResponse = array(
			'returnValue' => TRUE,
			'response'=>$compoundResponse,
			'arguments'=>$arguments
		);
		$this->response->headers('Content-Type', 'application/json');
		$this->response->body(json_encode($ajaxResponse));
	}

} // End Welcome
