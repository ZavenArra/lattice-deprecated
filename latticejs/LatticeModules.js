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
	
	saveField: function( postData, callback ){
//			console.log( "saveField.postData:", postData );
	    return new Request.JSON( { url: this.getSaveFieldURL(), onSuccess: callback } ).post( postData );
	},
	
	initialize: function( anElementOrId, aMarshal, options ){
//		console.log( "Constructing", this.toString(), this.childModules );
		this.parent( anElementOrId, aMarshal, options );  
		this.instanceName = this.element.get("id");
		this.build();
	},
	
	/*
	Function build: Instantiates lattice.ui elements by calling initUI, can be extended for other purposes...
	*/ 	
	build: function(){
//		console.log( "lattice.modules.Module.build!", this.element );
		this.UIFields = this.initUI();
//		console.log( ">>> ", this.UIFields );
		this.childModules = this.initModules( this.element );
//		console.log( ">>> ", this.childModules );
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
//	console.log( 'initModules', anElement );
		var childModules, filteredOutModules, descendantModules;
		descendantModules = ( anElement )? anElement.getElements(".module") : this.element.getElements(".module");
		childModules = [];
		filteredOutModules = [];
		descendantModules.each( function( aDescendant ){
			descendantModules.each( function( anotherDescendant ){
				if(  aDescendant.contains( anotherDescendant ) && aDescendant != anotherDescendant ){
//					console.log( "::::::", anotherDescendant );
					filteredOutModules.push( anotherDescendant );
				}
			}, this );
		}, this );		
		descendantModules.each( function( aDescendant ){
			if( !filteredOutModules.contains( aDescendant ) ){
				// console.log( "\t", 'calling initmodule on', aDescendant );
				var module = this.initModule( aDescendant );
				var instanceName = module.instanceName;
				// console.log( "\n::\t", module.instanceName, "is a descendant of ", this.toString());
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
		// console.log( Array.from( arguments ) );
		// console.log( "initModule", this.toString(),  "element", anElement );
		var elementClass = anElement.get( 'class' );
		var classPath = lattice.util.getValueFromClassName( "classPath", elementClass ).split( "_" );
		ref = null;
//		console.log( "\t\tinitModule classPath",  classPath );
		classPath.each( function( node ){
			ref = ( !ref )? this[node] : ref[node]; 
//		console.log( ref, node );
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
			if( aChild.get( "class" ).indexOf( "ui-" ) > -1 ){
//	    console.log( "\t\tfound ui field", aChild.get('class'), ':', aChild.get('data-field'), 'in', anElement.get('class') );
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
			console.log( anElement.getValueFromClassName('ui'), anElement.get('data-field'), field, typeof this.UIFields );
			this.UIFields[ anElement.get('data-field') ] = field; 
			field.setTabIndex( i+1 );
		}, this );
		return this.UIFields;
	},

	initUIField: function( anElement ){
//		console.log( "\t\tinitUIField", anElement )
		var field = new lattice.ui[anElement.getValueFromClassName( "ui" )]( anElement, this );
		return field;
	},
	
	destroyUIFields: function(){
//		console.log( "destroyUIFields before", this.instanceName, this.UIFields );
		Object.each( this.UIFields, function( aUIField ){
			console.log( '\t\t', aUIField, aUIField.fieldName );
			var fieldName = aUIField.fieldName;
			aUIField.destroy();
			aUIField = null;
			delete this.UIFields[ fieldName ];
		}, this );
//		console.log( "destroyUIFields after ", this.instanceName, this.UIFields );
	},

/*  Function: destroyChildModules */
	destroyChildModules: function( whereToLook ){
		//console.log( "destroyChildModules", this.toString(), this.childModules );
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
	this.objectId = this.element.get("id").split("_")[1];
},


getSaveFieldURL: function(){
	var url = lattice.util.getBaseURL() +"ajax/data/cms/savefield/" + this.getObjectId();
	return url;
},

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

	toString: function(){ return "[ Object, lattice.module.Module, lattice.modules.AjaxFormModule ]"; },

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
//			console.log( this.toString(), "onFormSubmissionComplete", text, json );
			json = JSON.decode( json );
//			console.log( this.toString(), "onFormSubmissionComplete" );
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
	addObjectDialogue: null,
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

	getObjectId: function(){
	    return this.objectId;
	},

	toString: function(){
		return "[ Object, lattice.LatticeObject, lattice.modules.Module, lattice.modules.LatticeList ]";
	},
	
	initialize: function( anElement, aMarshal, options ){
		this.parent( anElement, aMarshal, options );
		if( this.options.allowChildSort ) this.makeSortable( this.listing );
		this.objectId = this.element.get("id").split("_")[1];
	},
	
	build: function(){
		this.parent();
		this.addObjectDialogue = null;
		this.initControls();
		this.initList();
	},	
	
	initList: function(){
		this.listing = this.element.getElement( ".listing" );
		var children = this.listing.getChildren("li");
		children.each( function( element ){
			new lattice.modules.ListItem( element, this, this.addObjectDialogue );
		}, this );
	},

	initControls: function(){
		this.controls = this.element.getChildren( ".controls" );
		var addObjectButton = this.controls.getElement( ".addItem" ).addEvent("click", this.addObjectRequest.bindWithEvent( this ) );
		addObjectButton = null;
	},
	
	addObjectRequest: function( e ){
		lattice.util.stopEvent( e );
		if( this.addObjectDialogue ) lattice.modalManager.removeModal( this.addObjectDialogue );
		this.addObjectDialogue = null;
		this.addObjectDialogue = new lattice.ui.AddObjectDialogue( this );
		this.addObjectDialogue.spin();
		this.addObjectDialogue.show();
		console.log( "addObjectRequest:", this.getAddObjectURL() );
		return new Request.JSON( { url: this.getAddObjectURL(), onSuccess: this.onAddObjectResponse.bind( this ) } ).send();
	},
    
	onAddObjectResponse: function( json ){
		console.log( "onAddObjectResponse", json );
		var element, listItem, addItemText;
		element = json.response.html.toElement();
		addItemText = this.controls.getElement( ".addItem" ).get( "text" );
		listItem = new lattice.modules.ListItem( element, this, this.addObjectDialogue );
		listItem.hideControls();
		this.addObjectDialogue.setContent( element , addItemText );
		Object.each( listItem.UIFields, function( uiField ){
			uiField.scrollContext = "modal";
			if( uiField.reposition ) uiField.reposition('modal');
		});
		lattice.util.EventManager.broadcastMessage( "resize" );
	},

	removeObject: function( item ){
    this.removeObjectRequest( item.getObjectId() );
		item.destroy();
		item = null;
		lattice.util.EventManager.broadcastMessage( "resize" );          
	},
	
	removeObjectRequest: function( itemObjectId ){
		var jsonRequest = new Request.JSON( { url: this.getRemoveObjectURL( itemObjectId ) } ).send();
		return jsonRequest;
	},

	insertItem: function( anItem ){
		var anElement = anItem.element;
		var where = ( this.options.sortDirection == "DESC" )? "top" : "bottom";
		this.listing.grab( anElement, where );
		if( this.allowChildSort && this.sortableList ) this.sortableList.addItems( anElement );
		var listItemInstance = anElement.retrieve("Class");
		Object.each( listItemInstance.UIFields, function( aUIField ){
			aUIField.scrollContext = "window";
			if( aUIField.reposition ) aUIField.reposition()
		});
		anElement.tween( "opacity", 1 );
		anItem.showControls();
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
            var request = new Request.JSON( { url: this.getSubmitSortOrderURL } ).post( { sortorder: newOrder } );
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
		if( this.addObjectDialogue ) lattice.modalManager.removeModal( this.addObjectDialogue ) 
		this.addObjectDialogue = this.controls = this.instanceName = this.listing = this.oldSort = this.allowChildSort, this.sortDirection, this.submitDelay = null;
    if( this.scroller ) this.scroller = null;
		lattice.util.EventManager.broadcastMessage( 'resize' );
		this.parent();
	}

});

lattice.modules.ListItem = new Class({

	Extends: lattice.modules.Module,
	Implements: [ Events, Options ],
	addObjectDialogue: null,
	objectId: null,
	controls: null,
	fadeOut: null,
	
  /* Section: Getters & Setters */
	getObjectId: function(){ return this.objectId; },
	getSaveFieldURL: function(){
		var url =  this.marshal.getSaveFieldURL( this.getObjectId() );
//		console.log( "listItem.getSaveFieldURL", url );
		return url;
	},

	getSaveFileSubmitURL: function(){
			return lattice.util.getBaseURL() + 'ajax/data/cms/savefile/' + this.getObjectId()+"/";
	},

	initialize: function( anElement, aMarshal, options ){
		this.element = anElement;
		this.element.store( "Class", this );
		this.marshal = aMarshal;
		this.instanceName = this.element.get( "id" );
		this.objectId = this.element.get("id").split("_")[1];
		this.build();
	},

	toString: function(){ return "[ Object, lattice.modules.Module, lattice.modules.ListItem ]"; },

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
		this.fadeOut = new Fx.Morph( this.element, { duration: 350, onComplete: function(){ this.marshal.removeObject( this ) }.bind( this ) } );
		this.fadeOut.start( { height: 0, opacity: 0 } );
	},
	
	hideControls: function(){ this.controls.addClass( 'hidden' ); },
	showControls: function(){ this.controls.removeClass('hidden') },
	resumeSort: function(){ if( this.marshal.sortableList ) this.marshal.resumeSort(); },
	suspendSort: function(){ if( this.marshal.sortableList ) this.marshal.suspendSort(); },
	
	destroy: function(){
		this.parent();
		this.controls = this.fadeOut = this.objectId = null;
	}
	
});
