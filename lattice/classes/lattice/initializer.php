<?php

Class Lattice_Initializer {
   
   protected static $messages = array();
   protected static $problems = array(); //not yet implemented

   public static function check($dependencies) {

		 if(!$dependencies){
			return;
		 }
      
      try {
         ORM::Factory('initializedmodule');
      } catch (Exception $e) {
         if ($e->getCode() == 1146) { //code for table doesn't exist
            //install the initializedmodules table
            $sqlFile = Kohana::find_file('sql', 'initializedmodules', $ext = 'sql');
            $sql = file_get_contents($sqlFile);
            mysql_query($sql);
         }
      }

      foreach ($dependencies as $dependency) {
         $check = ORM::factory('initializedmodule')
                 ->where('module', '=', $dependency)
                 ->find();
         if (!$check->loaded() || $check->status != 'INITIALIZED') {

            if (Kohana::find_file('classes/initializer', $dependency)) {
              try {
               $initializerClass = 'initializer_' . $dependency;
               $initializer = new $initializerClass();
               $problems = $initializer->initialize();
              } catch (Exception $e){
                throw $e;
              }
               if (count($problems) == 0) {
                  if (!$check->loaded()) {
                     $check = ORM::Factory('initializedmodule');
                  }
                  $check->module = $dependency;
                  $check->status = 'INITIALIZED';
                  $check->save();
							 }
            } else {
                 if (!$check->loaded()) {
                  $check = ORM::Factory('initializedmodule');
               }
               $check->module = $dependency;
               $check->status = 'INITIALIZED';
               $check->save();
            }
         }
      }
      
      if(count(self::$problems) || count(self::$messages)){
         $view = new View('initializationproblems');
         $view->problems = self::$problems;
         $view->messages = self::$messages;
         echo $view->render();
         die();
      }
   }
   
   public static function reinitialize($module) {
      $check = ORM::factory('initializedmodule')
              ->where('module', '=', $module)
              ->find();
      $check->status = 'NOTINITIALIZED';
      $check->save();
      $allProblems = self::check(array($module));

      if (count($allProblems) || count(self::$messages)) {
         $view = new View('initializationproblems');
         $view->problems = $allProblems;
         $view->messages = self::$messages;
         echo $view->render();
         exit;
      }
   }
   
  
   public static function addProblem($message){
      self::$problems[] = $message;
      
   }

   
   public static function addMessage($message){
      self::$messages[] = $message;
      
   }

}
