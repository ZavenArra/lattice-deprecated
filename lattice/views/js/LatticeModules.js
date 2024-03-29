/*
	Section: lattice.module
	Lattice Modules
*/
lattice.modules = {};
/* 
	Class: lattice.modules.Module
	Base module
*/
lattice.modules.Module = new Class({

	Extends: lattice.LatticeObject,	
	/*
		Variable: instanceName
		unique id
	*/
	instanceName: null,
	/*
		Variable: UIFields
		Object that stores module's ui elements
	*/
	UIFields: {},
	/*
		Variable: childModules
		Modules within this module
	*/
	childModules: {},
	
	getSaveFieldURL: function(){
		throw "Abstract function getSaveFieldURL must be overriden in" + this.toString();
	},
	
	getClearFieldURL: function(){
		throw "Abstract function getClearFieldURL must be overriden in" + this.toString();		
	},

	getClearFiledURL: function(){
		throw "Abstract function getClearFieldURL must be overriden in" + this.toString();		
	},
	
	saveField: function( postData, callback ){
//			lattice.log( "saveField.postData:", postData );
	    return new Request.JSON( {url: this.getSaveFieldURL(), onSuccess: callback} ).post( postData );
	},

	clearFile: function( fieldName, callback ){
		var url = this.getClearFileURL( fieldName );
//		lattice.log( 'module.clearFile', fieldName, url );
		return new Request.JSON( {url: url, onComplete: this.callback} ).send();		
	},
		
	clearField: function( fieldName ){
		return new Request.JSON( {url: this.getClearFieldURL( fieldName )} ).send();
	},	
	
	getObjectId: function(){
		return this.objectId;
	},
	
	initialize: function( anElementOrId, aMarshal, options ){
//		lattice.log( "Constructing", this.toString(), this.childModules );
		this.parent( anElementOrId, aMarshal, options );  
		this.instanceName = this.element.get("id");
		this.objectId = this.element.get( 'data-objectid');
		
		this.build();
	},
	
	/*
	Function build: Instantiates lattice.ui elements by calling initUI, can be extended for other purposes...
	*/ 	
	build: function(){
//		lattice.log( "lattice.modules.Module.build!", this.element );
		this.UIFields = this.initUI();
//		lattice.log( ">>> ", this.UIFields );
		this.childModules = this.initModules( this.element );
//		lattice.log( ">>> ", this.childModules );
	},
	
	toElement: function(){
		return this.element;
	},

	toString: function(){
		return "[ object, lattice.modules.Module ]";
	},
	
	/*
		Function: initModules	
		Loops through elements with the class "module" and initializes each as a module
		// there is likely a better ( faster ) way to solve this 
	*/
	initModules: function( anElement ){
//	lattice.log( 'initModules', anElement );
		var childModules, filteredOutModules, descendantModules;
		descendantModules = ( anElement )? anElement.getElements(".module") : this.element.getElements(".module");
		childModules = [];
		filteredOutModules = [];
		descendantModules.each( function( aDescendant ){
			descendantModules.each( function( anotherDescendant ){
				if(  aDescendant.contains( anotherDescendant ) && aDescendant != anotherDescendant ){
//					lattice.log( "::::::", anotherDescendant );
					filteredOutModules.push( anotherDescendant );
				}
			}, this );
		}, this );		
		descendantModules.each( function( aDescendant ){
			if( !filteredOutModules.contains( aDescendant ) ){
				// lattice.log( "\t", 'calling initmodule on', aDescendant );
				var module = this.initModule( aDescendant );
				var instanceName = module.instanceName;
				// lattice.log( "\n::\t", module.instanceName, "is a descendant of ", this.toString());
				childModules[ instanceName ] = module;
			}
		}, this );
		return childModules;
	},
	
	
	/*
		Function: initModule
		Initializes a specific module
	*/
	initModule: function( anElement ){
		// lattice.log( Array.from( arguments ) );
		// lattice.log( "initModule", this.toString(),  "element", anElement );
		var elementClass = anElement.get( 'class' );
		var classPath = lattice.util.getValueFromClassName( "classPath", elementClass ).split( "_" );
		ref = null;
//		lattice.log( "\t\tinitModule classPath",  classPath );
		classPath.each( function( node ){
			ref = ( !ref )? this[node] : ref[node]; 
//		lattice.log( ref, node );
		});
		var newModule = new ref( anElement, this );
		return newModule;		
	},

	/*
		Function: getModuleUIFields
	*/
	getModuleUIFields: function( anElement ){
		var elements = [];
		anElement.getChildren().each( function( aChild, anIndex ){
//			lattice.log( 'getModuleUIFields', aChild, aChild.get('class') );
			if( aChild.get('class') && aChild.get( "class" ).indexOf( "ui-" ) > -1 ){
//	    lattice.log( "\t\tfound ui field", aChild.get('class'), ':', aChild.get('data-field'), 'in', anElement.get('class') );
				elements.combine( [ aChild ] );
			} else if( !aChild.hasClass( "modal" ) && !aChild.hasClass( "module" ) && !aChild.hasClass( "listItem" ) ){
				elements.combine( this.getModuleUIFields( aChild ) );
			}
		}, this );
		return elements;
	},
	/*
		Function: initUI
		loops through child elements and instantiates ui elements that dont live inside other modules
	*/
	initUI: function( anElement ){
		anElement = ( anElement )? anElement : this.element;
		var moduleUIFields, field; 
		moduleUIFields = this.getModuleUIFields( anElement );
		moduleUIFields.each( function( anElement, i ){
			field = this.initUIField( anElement );
//			lattice.log( anElement.getValueFromClassName('ui'), anElement.get('data-field'), field, typeof this.UIFields );
			this.UIFields[ anElement.get('data-field') ] = field; 
		}, this );
		return this.UIFields;
	},

	initUIField: function( anElement ){
//		lattice.log( "\t\tinitUIField", anElement )
		var field = new lattice.ui[anElement.getValueFromClassName( "ui" )]( anElement, this );
		return field;
	},
	
	destroyUIFields: function(){
//		lattice.log( "destroyUIFields before", this.instanceName, this.UIFields );
		Object.each( this.UIFields, function( aUIField ){
//			lattice.log( '\t\t', aUIField, aUIField.fieldName );
			var fieldName = aUIField.fieldName;
			aUIField.destroy();
			aUIField = null;
			delete this.UIFields[ fieldName ];
		}, this );
//		lattice.log( "destroyUIFields after ", this.instanceName, this.UIFields );
	},

/*  Function: destroyChildModules */
	destroyChildModules: function( whereToLook ){
		//lattice.log( "destroyChildModules", this.toString(), this.childModules );
		if( !this.childModules || Object.getLength( this.childModules ) == 0 ) return;
		var possibleTargets = ( whereToLook )? whereToLook.getElements( ".module" ) : this.element.getElements( ".module" );
		Object.each( this.childModules, function( aModule ){
			if( possibleTargets.contains( aModule.element ) ){
				var key = aModule.instanceName;
				aModule.destroy();
				delete this.childModules[key];
				delete aModule;
				aModule = null;
			}
		}, this );
	},
	
	destroy: function(){
		this.destroyChildModules();
		this.destroyUIFields();
		this.instanceName = null;
		this.UIFields = null;
		this.childModules = null;
		this.parent();
	}

});


/* 
	Class: lattice.modules.Module
	Base module
*/

lattice.modules.Cluster = new Class({

Extends: lattice.modules.Module,

	initialize: function( anElementOrId, aMarshal, options ){
		this.parent( anElementOrId, aMarshal, options );
	},

	toString: function(){
		return "[Object, lattice.LatticeObject, lattice.modules.Module, lattice.modules.Cluster ]";
	},

	getSaveFieldURL: function(){
//		lattice.log( this.toString(), this.element );
		var url = lattice.util.getBaseURL() +"ajax/data/cms/savefield/" + this.getObjectId();
//		lattice.log( 'cluster.getSaveFieldURL', url );
		return url;
	}

});



/*
	Class lattice.module.AjaxFormModule
	Module that validates and submits inputs via ajax calls.
*/
lattice.modules.AjaxFormModule = new Class({

	Extends: lattice.modules.Module,
	generatedData: {},

	initialize: function( anElement, aMarshal, options ){
		this.parent( anElement, aMarshal, options );
		this.element.getElement("input[type='submit']").addEvent( "click", this.submitForm.bindWithEvent( this ) );
		this.resultsContainer = this.element.getElement(".resultsContainer");
	},

	toString: function(){return "[ Object, lattice.module.Module, lattice.modules.AjaxFormModule ]";},

	submitForm: function( e ){
    lattice.util.stopEvent( e );
    this.generatedData = Object.merge( this.generatedData, this.serialize() );
		if( this.options.validate && !this.validateFields() ) return false;	
		return new Request.JSON({
            url:  this.getSubmitFormURL(),
            onSuccess: this.onFormSubmissionComplete.bind( this )
        }).post( this.generatedData );
	},

	validateFields: function(){
		var returnVal = true
		this.UIFields.each( function( aUIField, anIndex ){
			if( aUIField.validationOptions && aUIField.enabled ){
				returnVal = ( aUIField.validate() )? true : false ;
			}
		});
		return returnVal;
	},

	getGeneratedDataQueryString: function(){
		return new Hash( this.generatedData ).toQueryString();
	},

	serialize: function(){
		var query = "";
		var keyValuePairs = {};
		this.UIFields.each( function( aUIField ){
			if( aUIField.type != "interfaceWidget" ){
				keyValuePairs.append( aUIField.getKeyValuePair() );
			}
		}, this );
		return keyValuePairs;
	},
	
	clearFormFields: function( e ){
		lattice.util.stopEvent( e );
		this.UIFields.each( function( aUIField ){
			aUIField.setValue( null );
		}, this );
	},

	onFormSubmissionComplete: function( text, json ){

		if( json ){
//			lattice.log( this.toString(), "onFormSubmissionComplete", text, json );
			json = JSON.decode( json );
//			lattice.log( this.toString(), "onFormSubmissionComplete" );
			if( this.resultsContainer ){
//				this.resultsContainer.setStyle( "height", 'auto' );
//				this.resultsContainer.removeClass( "centeredSpinner" );
				this.resultsContainer.set( "html", json.html );
			}
//			log( this.resultsContainer.get( "html" ) );
		}else{
			throw "NO JSON RESPONSE... check for 500 error?";
		}
	
	}
	

});

lattice.modules.LatticeList = new Class({

	/* TODO write unit tests for List*/
	Extends: lattice.modules.Module,
	// listing properties and members, helps with maintenance and destruction.... standard practice from now on
	sortable: null,
	sortDirection: null,
	instanceName: null,
	items: null,
	controls: null,
	sortableList: null,
	scroller: null,
	submitDelay: null,
	oldSort: null,
	
	/* Section: Getters & Setters */
	
	getSaveFieldURL: function(){
    throw "LatticeList Abstract function getSaveFieldURL must be overriden in" + this.toString();
	},

	getAddObjectURL: function(){
	    throw "Abstract function getAddObjectURL must be overriden in" + this.toString();
	},
	
	getRemoveObjectURL: function(){
	    throw "Abstract function getRemoveObjectURL must be overriden in" + this.toString();
	},

	getSubmitSortOrderURL: function(){ 
	    throw "Abstract function getSubmitSortOrderURL must be overriden in" + this.toString();
	},

	toString: function(){
		return "[ Object, lattice.LatticeObject, lattice.modules.Module, lattice.modules.LatticeList ]";
	},
	
	
	clearField: function( fieldName ){
		this.marshal.clearField( fieldName );
	},
	
	initialize: function( anElement, aMarshal, options ){
		this.parent( anElement, aMarshal, options );
		this.objectId = this.element.get( 'data-objectid' );
		// lattice.log( "============================================" );
		// lattice.log( "element", anElement );
		// lattice.log( "options", this.options );
		// lattice.log( "============================================" );
		this.allowChildSort = ( this.options.allowChildSort == 'true' )? true : false;
		this.makeSortable( this.listing );
	},
	
	build: function(){
		this.parent();
		this.initControls();
		this.initList();
	},	
	
initList: function(){
    var children;
    this.listing = this.element.getElement( ".listing" );
    children = this.listing.getChildren("li");
    children.each( function( element ){
			this.initItem( element );
		}, this );
  },

	initItem: function( element ){
		var classPath, ref, newItem;
		classPath = element.getData('classpath');
		if(!classPath){
			newItem = new lattice.modules.ListItem( element, this );
		} else {
			ref = this.getClassFromClassPath( classPath, '.' );
			if(ref){
				newItem = new ref( element, this );
			} else {
				throw "classPath " + classPath + "  for element: " + element + " is referring to a class that is not loaded or does not exist";
				return false;
			}
		}
		return newItem;
	},

	initControls: function(){
			this.controls = this.element.getChildren( ".controls" );
			this.controls.each( function( controlGroup ){
				controlGroup.getElements( ".addItem" ).each( function( item ){
	//				lattice.log( '\t\tinitControls', item );
					item.addEvent("click", this.addObjectRequest.bindWithEvent( this, item.get( 'href' ) ) );
				}, this );
			}, this );
		},
   
    getClassFromClassPath: function( classPath, delimiter ){
      var ref;			
      delimiter = ( !delimiter )? "_" : delimiter;
      classPath = classPath.split( delimiter );
//			lattice.log( "\t\tinitModule classPath",  classPath );
      classPath.each( function( node ){
//				lattice.log( 'node', node, ref );
         ref = ( !ref )? this[node] : ref[node]; 
      });
			//lattice.log( 'getClassFromClassPath', ref );
      return ref;
   },
	
	addObjectRequest: function( e, path ){
//		lattice.log( 'addObjectRequest', path );
		e.preventDefault();
		this.listing.spin();
		return new Request.JSON( {url: this.getAddObjectURL( path ), onSuccess: this.onAddObjectResponse.bind( this )} ).send();
	},
    
	onAddObjectResponse: function( json ){
//		lattice.log( "onAddObjectResponse", json );
		this.listing.unspin();
		var element, listItem, addItemText, classPath, ref;
		element = json.response.html.toElement();
		addItemText = this.controls.getElement( ".addItem" ).get( "text" );		
		listItem = this.initItem( element );
		Object.each( listItem.UIFields, function( uiField ){
			uiField.scrollContext = "modal";
			if( uiField.reposition ) uiField.reposition('modal');
		});
		lattice.util.EventManager.broadcastMessage( "resize" );
		this.insertItem( listItem );
	},

	removeObject: function( item ){
    this.removeObjectRequest( item.getObjectId() );
		item.destroy();
		item = null;
		lattice.util.EventManager.broadcastMessage( "resize" );          
	},
	
	removeObjectRequest: function( itemObjectId ){
		var jsonRequest = new Request.JSON( {url: this.getRemoveObjectURL( itemObjectId )} ).send();
		return jsonRequest;
	},

	insertItem: function( anItem ){
		var where, listItemInstance, coords;
		where = ( this.options.sortDirection == "DESC" )? "top" : "bottom";
//		lattice.log( "\t", this.options.sortDirection, where );
		this.listing.grab( anItem.element, where );
		if( this.allowChildSort && this.sortableList ) this.sortableList.addItems( anItem.element );
		Object.each( anItem.UIFields, function( aUIField ){
			aUIField.scrollContext = "window";
			if( aUIField.reposition ) aUIField.reposition()
		});
		anItem.element.tween( "opacity", 1 );
		coords = anItem.element.getCoordinates();
		this.element.getOffsetParent().scrollTo( coords.left, coords.top )
		if( this.allowChildSort != null ) this.onOrderChanged();
	},

	makeSortable: function(){
		if( this.allowChildSort && !this.sortableList ){
			this.sortableList = new lattice.ui.Sortable( this.listing, this, $( document.body ) );
		}else if( this.allowChildSort ){
			this.sortableList.attach();
		}
		this.oldSort = this.serialize();
	},
	
	resumeSort: function(){
		if( this.allowChildSort && this.sortableList ) this.sortableList.attach();
	},
	
	suspendSort: function(){
		if( this.allowChildSort && this.sortableList ) this.sortableList.detach();
	},
	
	removeSortable: function( aSortable ){
		aSortable.detach();
		delete aSortable;
		aSortable = null;
	},
	
	onOrderChanged: function(){
		var newOrder = this.serialize();
		clearInterval( this.submitDelay );
		this.submitDelay = this.submitSortOrder.periodical( 3000, this, newOrder.join(",") );
		newOrder = null;
	},
	
	submitSortOrder: function( newOrder ){
		if( this.allowChildSort && this.oldSort != newOrder ){
			clearInterval( this.submitDelay );
			this.submitDelay = null;
     	var request = new Request.JSON( {url: this.getSubmitSortOrderURL()} ).post( {sortOrder: newOrder} );
			this.oldSort = newOrder;
			return request;
		}
	},
	
	serialize:function(){
		var sortArray, children, listItemId, listItemIdSplit;
		sortArray = [];
		children = this.listing.getChildren("li");
		children.each( function ( aListing ){
	    if( aListing.get( "id" ) ){
        listItemId = aListing.get("id");
        listItemIdSplit = listItemId.split( "_" );
        listItemId = listItemIdSplit[ listItemIdSplit.length - 1 ];
        sortArray.push( listItemId );		        
	    }
		});
		return sortArray;
	},

	destroy: function(){
		if(this.sortableList) this.removeSortable( this.sortableList );
		clearInterval( this.submitDelay );
		this.controls = this.instanceName = this.listing = this.oldSort = this.allowChildSort, this.sortDirection, this.submitDelay = null;
    if( this.scroller ) this.scroller = null;
		lattice.util.EventManager.broadcastMessage( 'resize' );
		this.parent();
	}

});

lattice.modules.ListItem = new Class({

	Extends: lattice.modules.Module,
	Implements: [ Events, Options ],
	objectId: null,
	controls: null,
	fadeOut: null,
	
  /* Section: Getters & Setters */
	getSaveFieldURL: function(){
		var url =  this.marshal.getSaveFieldURL( this.getObjectId() );
//		lattice.log( "listItem.getSaveFieldURL", url );
		return url;
	},

	getSaveFileSubmitURL: function(){
			return lattice.util.getBaseURL() + 'ajax/data/cms/savefile/' + this.getObjectId()+"/";
	},
	
	getClearFileURL: function( fieldName ){
		var url = lattice.util.getBaseURL() + "ajax/data/cms/clearField/" + this.getObjectId() + "/" + fieldName;
		return url;
	},
	

	initialize: function( anElement, aMarshal, options ){
		this.element = anElement;
		this.element.store( "Class", this );
		this.marshal = aMarshal;
		this.instanceName = this.element.get( "id" );
		this.objectId = this.element.get("data-objectId");
		this.build();
	},

	toString: function(){return "[ Object, lattice.modules.Module, lattice.modules.ListItem ]";},

	build: function(){
		this.parent();
		this.initControls();
	},

	initControls: function(){
		this.controls = this.element.getElement(".itemControls");
		if( this.controls.getElement(".delete") ) this.controls.getElement(".delete").addEvent( "click", this.removeObject.bindWithEvent( this ) );
	},
	
	removeObject: function( e ){
		lattice.util.stopEvent( e );
		if( this.marshal.sortableList != null ) this.marshal.onOrderChanged();
		this.fadeOut = new Fx.Morph( this.element, {duration: 350, onComplete: function(){this.marshal.removeObject( this )}.bind( this )} );
		this.fadeOut.start( {height: 0, opacity: 0} );
	},

	clearField: function( fieldName ){
		this.marshal.clearField( fieldName );
	},
	
	hideControls: function(){this.controls.addClass( 'hidden' );},
	showControls: function(){this.controls.removeClass('hidden')},
	resumeSort: function(){if( this.marshal.sortableList ) this.marshal.resumeSort();},
	suspendSort: function(){if( this.marshal.sortableList ) this.marshal.suspendSort();},
	
	destroy: function(){
		this.parent();
		this.controls = this.fadeOut = this.objectId = null;
	}
	
});

lattice.modules.LatticeRadioAssociator = new Class({

	/* TODO write unit tests for List*/
	Extends: lattice.modules.Module,
	// listing properties and members, helps with maintenance and destruction.... standard practice from now on
	sortable: null,
	sortDirection: null,
	instanceName: null,
	items: null,
	controls: null,
	associated: null,
	pool: null,
	sortableList: null,
	scroller: null,
	submitDelay: null,
	oldSort: null,
	
	/* Section: Getters & Setters */
	
	getAssociateURL: function(){
	    throw "Abstract function getAssociateURL must be overriden in" + this.toString();
	},
	
	getDissociateURL: function(){
	    throw "Abstract function getDissociateURL must be overriden in" + this.toString();
	},

	getSubmitSortOrderURL: function(){ 
	    throw "Abstract function getSubmitSortOrderURL must be overriden in" + this.toString();
	},

	toString: function(){
		return "[ Object, lattice.LatticeObject, lattice.modules.Module, lattice.modules.LatticeAssociator ]";
	},

	radioClicked: function( e, el ){
		lattice.util.stopEvent( e );
		this.associateRequest( el );
	},
	
	associateRequest: function( el ){
		if( this.activeItem ){
			var oldel = this.activeItem;
			this.dissociateRequest( oldel.get("data-objectid") );
			oldel.erase( "checked" );
		}
		this.activeItem = el;			
		lattice.log( 'associateRequest', el, 	this.activeItem.get("data-objectid") );
		return new Request.JSON({
			url: this.getAssociateURL( this.getObjectId(), this.activeItem.get('data-objectid'), this.element.get('data-lattice')  ), 
			onSuccess: function( json ){ this.onAssociateResponse( json ); }.bind( this )
		}).send();
	},

	onAssociateResponse: function( json ){
//		lattice.log( "onAssociateResponse", json );
	},

	dissociateRequest: function( objid ){
		lattice.log( 'dissociateRequest', objid );
		lattice.util.EventManager.broadcastMessage( "resize" );          
		var jsonRequest = new Request.JSON({
			url: this.getDissociateURL( this.getObjectId(), objid, this.element.get('data-lattice') ),
			onSuccess: function( json ){ this.onDissociateResponse( json ); }.bind( this )
		}).send();
		return jsonRequest;
	},

	onDissociateResponse: function( json, item ){
//		lattice.log( "onDissociateResponse", json );
	},

	clearField: function( fieldName ){
		this.marshal.clearField( fieldName );
	},
	
	initialize: function( anElement, aMarshal, options ){
		this.parent( anElement, aMarshal, options );
		this.objectId = this.element.get( 'data-objectid' );
//		this.allowChildSort = ( this.options.allowChildSort == 'true' )? true : false;
		this.allowChildSort = ( this.element.get('data-allowchildsort') == 'true' )? true : false;
	},
	
	build: function(){
		this.parent();
		this.element.getElements('.radios input').each( function( el ){
			el.addEvent( 'click', this.radioClicked.bindWithEvent( this, el ) );
		}, this );
		var checkedItem = this.element.getElement("input[checked='checked']");
		if( checkedItem ){
			this.activeItem = checkedItem;
			console.log( "Active Id:", this.activeItem );
		}
	},	
	
	initItems: function(){
//		lattice.log(">>>>>>>>>>>>>>>>", this.element.getElements( "ul.associated li" ), this.element.getElements( "ul.pool li" ))
    var items = this.element.getElements( "ul.associated li" ).combine( this.element.getElements( "ul.pool li" ) );
		items.each( function( el ){
			this.initItem( el );
		}, this );
  },

	initItem: function( el ){
		var classPath, ref, newItem;
		classPath = el.getData('classpath');
		if(!classPath){
			newItem = new lattice.modules.AssociatorItem( el, this );
		} else {
			ref = this.getClassFromClassPath( classPath, '.' );
			if( ref ){
				newItem = new ref( el, this );
			} else {
				throw "classPath " + classPath + "  for element: " + el + " is referring to a class that is not loaded or does not exist";
				return false;
			}
		}
		return newItem;
	},

	initControls: function(){
			this.controls = this.element.getChildren( ".controls" );
			this.controls.each( function( controlGroup ){
				controlGroup.getElements( ".associate" ).each( function( item ){
					item.addEvent("click", this.associateRequest.bindWithEvent( this, item ) )
				}, this );
			}, this );
		},
   
    getClassFromClassPath: function( classPath, delimiter ){
      var ref;
      delimiter = ( !delimiter )? "_" : delimiter;
      classPath = classPath.split( delimiter );
      classPath.each( function( node ){
         ref = ( !ref )? this[node] : ref[node]; 
      });
      return ref;
   },

	destroy: function(){
		if(this.sortableList) this.removeSortable( this.sortableList );
		clearInterval( this.submitDelay );
		this.controls = this.instanceName = this.pool = this.associated = this.oldSort = this.allowChildSort, this.sortDirection, this.submitDelay = null;
    if( this.scroller ) this.scroller = null;
		lattice.util.EventManager.broadcastMessage( 'resize' );
		this.parent();
	}

});

lattice.modules.LatticeAssociator = new Class({

	/* TODO write unit tests for List*/
	Extends: lattice.modules.Module,
	// listing properties and members, helps with maintenance and destruction.... standard practice from now on
	sortable: null,
	sortDirection: null,
	instanceName: null,
	items: null,
	controls: null,
	associated: null,
	pool: null,
	sortableList: null,
	scroller: null,
	submitDelay: null,
	oldSort: null,
	
	/* Section: Getters & Setters */
	
	getSaveFieldURL: function(){
    throw "Abstract function getSaveFieldURL must be overriden in" + this.toString();
	},

	getAssociateURL: function(){
		throw "Abstract function getAssociateURL must be overriden in" + this.toString();
	},
	
	getDissociateURL: function(){
		throw "Abstract function getDissociateURL must be overriden in" + this.toString();
	},

	getFilterPoolByWordURL: function(){
		throw "Abstract function getFilterPoolByWordURL must be overriden in" + this.toString();
	},
	
	getSubmitSortOrderURL: function(){ 
		throw "Abstract function getSubmitSortOrderURL must be overriden in" + this.toString();
	},

	toString: function(){
		return "[ Object, lattice.LatticeObject, lattice.modules.Module, lattice.modules.LatticeAssociator ]";
	},
	
	clearField: function( fieldName ){
		this.marshal.clearField( fieldName );
	},
	
	initialize: function( anElement, aMarshal, options ){
		this.parent( anElement, aMarshal, options );
		this.objectId = this.element.get( 'data-objectid' );
//	this.allowChildSort = ( this.options.allowChildSort == 'true' )? true : false;
		this.allowChildSort = ( this.element.get('data-allowchildsort') == 'true' )? true : false;
	},
	
	filterPoolByWord: function( e ){
		e.preventDefault();
		var word = this.element.getElement( '.filter input' ).get("value");
		var url = this.getFilterPoolByWordURL( this.getObjectId(), this.element.get('data-lattice'), word );
		var jsonRequest = new Request.JSON({
			url: url,
			onSuccess: function( json ){ console.log( "filterPoolByWord Success", json ) }
		}).send();
		return jsonRequest;
	},

	build: function(){
		this.parent();
		this.associated = this.element.getElement( 'ul.associated' );
		this.pool = this.element.getElement('div.pool');
		this.poolList = this.element.getElement( 'ul' );
		this.element.getElements( '.shadow' ).each( function( el ){
			el.addBoxShadow( "1px 1px 5px #ddd");
		});
		this.poolMorph = new Fx.Morph( this.pool, { duration: 'short', transition: Fx.Transitions.Sine.easeOut } );

		this.element.addEvent( 'mouseenter', function(){
			this.poolMorph.cancel();
			this.pool.setStyles({
				"opacity": 0,
				"height": 0,
				"display": "block"
			});
			this.poolMorph.start({
				"opacity": 1,
				"height": "auto",
				"display": "block"				
			});
		}.bind( this ) );		

		this.element.addEvent( 'mouseleave', function(){
			this.poolMorph.cancel();
			this.poolMorph.start({
				"opacity": 0,
				"height": "0px"
			});
		}.bind( this ));
		this.initControls();
		this.initItems();
		this.filterSubmitButton = this.element.getElement(".filter .button");
		this.filterSubmitButton.addEvent('click', this.filterPoolByWord.bindWithEvent( this ) );
		this.makeSortable( this.associated );

	},	
	
	initItems: function(){
//		lattice.log(">>>>>>>>>>>>>>>>", this.element.getElements( "ul.associated li" ), this.element.getElements( "ul.pool li" ))
    var items = this.element.getElements( "ul.associated li" ).combine( this.element.getElements( "ul.pool li" ) );
		items.each( function( el ){
			this.initItem( el );
		}, this );
  },

	initItem: function( el ){
		var classPath, ref, newItem;
		classPath = el.getData('classpath');
		if(!classPath){
			newItem = new lattice.modules.AssociatorItem( el, this );
		} else {
			ref = this.getClassFromClassPath( classPath, '.' );
			if(ref){
				newItem = new ref( el, this );
			} else {
				throw "classPath " + classPath + "  for element: " + el + " is referring to a class that is not loaded or does not exist";
				return false;
			}
		}
		return newItem;
	},

	initControls: function(){
			this.controls = this.element.getChildren( ".controls" );
			this.controls.each( function( controlGroup ){
				controlGroup.getElements( ".associate" ).each( function( item ){
					item.addEvent("click", this.associateRequest.bindWithEvent( this, item ) )
				}, this );
			}, this );
		},
   
    getClassFromClassPath: function( classPath, delimiter ){
      var ref;			
      delimiter = ( !delimiter )? "_" : delimiter;
      classPath = classPath.split( delimiter );
      classPath.each( function( node ){
         ref = ( !ref )? this[node] : ref[node]; 
      });
      return ref;
   },
	
	associateRequest: function( item ){
//		lattice.log( 'addObjectRequest', item );
		this.associated.grab( item.getElement() );
		return new Request.JSON( {url: this.getAssociateURL( this.getObjectId(), item.getObjectId(), this.element.get('data-lattice')  ), onSuccess: function( json ){ this.onAssociateResponse( json, item ); }.bind( this ) } ).send();
	},
    
	onAssociateResponse: function( json, item ){
//		lattice.log( "onAssociateResponse", json );
		item.element.unspin();
		var element, listItem, addItemText, classPath, ref;
		associateText = this.controls.getElement( ".associate" ).get( "text" );
/*	FOR META FIELDS WE NEED TO TAKE THE JSON RESPONSE AND REPLACE THE ELEMENT WITH IT, WHICH MEANS WE'LL NEED TO REINIT IT TOO 
		element = json.response.html.toElement();
		listItem = this.initItem( element );
*/
		// Object.each( listItem.UIFields, function( uiField ){
		// 	uiField.scrollContext = "modal";
		// 	if( uiField.reposition ) uiField.reposition('modal');
		// });
		lattice.util.EventManager.broadcastMessage( "resize" );
//	this.insertItem( listItem );
	},

	dissociateRequest: function( item ){
//		lattice.log("dissociate", item, item.getObjectId() );
    item.element.spin();
		this.poolList.grab( item.element );
		lattice.util.EventManager.broadcastMessage( "resize" );          
		var jsonRequest = new Request.JSON( { url: this.getDissociateURL( this.getObjectId(), item.getObjectId(), this.element.get('data-lattice') ), onSuccess: function( json ){ this.onDissociateResponse( json, item ); }.bind( this ) } ).send();
		return jsonRequest;
	},

	onDissociateResponse: function( json, item ){
		item.element.unspin();
	},
	
	makeSortable: function(){
		if( this.allowChildSort && !this.sortableList ){
			this.sortableList = new lattice.ui.Sortable( this.container, this, $( document.body ) );
		}else if( this.allowChildSort ){
			this.sortableList.attach();
		}
		this.oldSort = this.serialize();
	},
	
	resumeSort: function(){
		if( this.allowChildSort && this.sortableList ) this.sortableList.attach();
	},
	
	suspendSort: function(){
		if( this.allowChildSort && this.sortableList ) this.sortableList.detach();
	},
	
	removeSortable: function( aSortable ){
		aSortable.detach();
		delete aSortable;
		aSortable = null;
	},
	
	onOrderChanged: function(){
		var newOrder = this.serialize();
		clearInterval( this.submitDelay );
		this.submitDelay = this.submitSortOrder.periodical( 3000, this, newOrder.join(",") );
		newOrder = null;
	},
	
	submitSortOrder: function( newOrder ){
		if( this.allowChildSort && this.oldSort != newOrder ){
			clearInterval( this.submitDelay );
			this.submitDelay = null;
     	var request = new Request.JSON( {url: this.getSubmitSortOrderURL()} ).post( {sortOrder: newOrder} );
			this.oldSort = newOrder;
			return request;
		}
	},
	
	serialize:function(){
		var sortArray, listItemId, listItemIdSplit;
		sortArray = [];
		this.associated.getChildren("li").each( function ( aListing ){
	    if( aListing.get( "id" ) ){
        listItemId = aListing.get("id");
        listItemIdSplit = listItemId.split( "_" );
        listItemId = listItemIdSplit[ listItemIdSplit.length - 1 ];
        sortArray.push( listItemId );		        
	    }
		});
		return sortArray;
	},

	destroy: function(){
		if(this.sortableList) this.removeSortable( this.sortableList );
		clearInterval( this.submitDelay );
		this.controls = this.instanceName = this.poolList = this.associated = this.oldSort = this.allowChildSort, this.sortDirection, this.submitDelay = null;
    if( this.scroller ) this.scroller = null;
		lattice.util.EventManager.broadcastMessage( 'resize' );
		this.parent();
	}

});

lattice.modules.AssociatorItem = new Class({

	Extends: lattice.modules.Module,
	Implements: [ Events, Options ],
	objectId: null,
	controls: null,
	fadeOut: null,
	
  /* Section: Getters & Setters */
	getSaveFieldURL: function(){
		var url =  this.marshal.getSaveFieldURL( this.getObjectId() );
//		lattice.log( "AssociatorItem.getSaveFieldURL", url );
		return url;
	},

	getSaveFileSubmitURL: function(){
			return lattice.util.getBaseURL() + 'ajax/data/cms/savefile/' + this.getObjectId()+"/";
	},
	
	getClearFileURL: function( fieldName ){
		var url = lattice.util.getBaseURL() + "ajax/data/cms/clearField/" + this.getObjectId() + "/" + fieldName;
		return url;
	},
	

	initialize: function( anElement, aMarshal, options ){
		this.element = anElement;
		this.element.store( "Class", this );
		this.marshal = aMarshal;
		this.instanceName = this.element.get( "id" );
		this.objectId = this.element.get("data-objectid");
//		lattice.log( "ASSOCIATORITEM", this.objectId );
		this.build();
	},

	toString: function(){return "[ Object, lattice.modules.Module, lattice.modules.AssociatorItem ]";},

	build: function(){
		this.parent();
		this.initControls();
	},

	isAssociated: function(){
		return ( this.marshal.element.hasClass('.pool') )? false : true;
	},
	
	initControls: function(){
		this.controls = this.element.getElement(".itemControls");
		if( this.controls.getElement(".associate") ){
//		if the item is associated, add the associated class (which then determines its appearance )
//		if( this.isAssociated() ) this.element.addClass("associated");
			this.controls.getElement(".associate").addEvent( "click", this.associate.bindWithEvent( this ) );
		}
		if( this.controls.getElement(".dissociate") ){
			this.controls.getElement(".dissociate").addEvent( "click", this.dissociate.bindWithEvent( this ) );
		}
	},
	
	associate: function( e ){
		lattice.util.stopEvent( e );
//	this.addClass('associated');
		if( this.marshal.sortableList != null ) this.marshal.onOrderChanged();
		this.element.spin();
		this.marshal.associateRequest( this );
	},
	
	dissociate: function( e ){
		lattice.util.stopEvent( e );
//	this.removeClass('associated');
		if( this.marshal.sortableList != null ) this.marshal.onOrderChanged();
		this.marshal.dissociateRequest( this );
	},

	clearField: function( fieldName ){
		this.marshal.clearField( fieldName );
	},
	
	// hideControls: function(){this.controls.addClass( 'hidden' );},
	// showControls: function(){this.controls.removeClass('hidden')},
	
	resumeSort: function(){if( this.marshal.sortableList ) this.marshal.resumeSort();},
	suspendSort: function(){if( this.marshal.sortableList ) this.marshal.suspendSort();},
	
	destroy: function(){
		this.parent();
		this.controls = this.objectId = null;
	}
	
});
