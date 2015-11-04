/*!
 * Home page controller for vue bbs demo app
 * (c) 2015 Ad van Winkel
 *
 * Vue demo app originally by Ryan Chenkie modified using Sails.js  
 * as a backend framework for persistency
 * and reactive client-client interaction using websockets
 */

//Vue.config.debug = true;

// Saving Vue instance in vm variable is necessary for accessing the instance 
// from within io.socket callback function
var vm = new Vue({
// We want to target the div with an id of 'events'
  el: '#events',

  // Here we can register any values or collections that hold data
  // for the application
  data: {
	  event: { name: '', description: '', date: '' },
  	events: []
  },

  // Anything within the ready function will run when the application loads
  ready: function() {
  	this.fetchEvents();
  },

  // Methods we want to use in our application are registered here
  methods: {
  	// We dedicate a method to retrieving and setting some data
	  fetchEvents: function() {

				io.socket.get('/event', function whenServerResponds(resp, JWR) {
        
        console.log('Fetched videos and subscribed... Response:', resp);
     
        if (JWR.statusCode >= 400) {
   
          console.log('something bad happened',resp);
    
          return;
        }
        // $set is a convenience method provided by Vue that is similar to pushing
	    	// data onto an array
        vm.$set('events', resp);
      });
    	//register event handler that runs when event is created, updated or destroyed
	    io.socket.on('event', function whenAnEventIsCreatedUpdatedOrDestroyed(msg) {
        //console.log('Is it firing',msg);
        if (msg.verb == "created") {
        	//add new event to events array
		      vm.events.push({
			          name: msg.data.name,
			          description: msg.data.description,
			          date: msg.data.date,
			          id: msg.id
	      	 });
	    	}
	    	if (msg.verb == "destroyed"){
	    		//apply filter to events array to remove destroyed event
	        vm.events = vm.events.filter(function dontDelete(obj){
	        	return obj.id != msg.id 
	       	});
	    	}
      });
     },

    // Adds an event to the existing events array
	  addEvent: function() {
	    if(this.event.name) {
	     	var evt = this.event;
				//console.log(evt);

				io.socket.post('/event', vm.event,
					function whenServerResponds(resp, JWR) {

					if (JWR.statusCode != 201) {
   
	          console.log('something bad happened',resp);
	    
	          return;
        	}
        	vm.event.id = resp.id;
					vm.events.push(vm.event);
					vm.event = { name: '', description: '', date: '' }
				});
	    }
	  },

	  deleteEvent: function(index) {
	  
		  if(confirm("Are you sure you want to delete this event?")) {

		  	var id_delete = vm.events[index].id;
				io.socket.delete('/event/' + id_delete, function (response, JWR) {
					//console.log(JWR.statusCode);
					if (JWR.statusCode != 200) {
   
	          console.log('something bad happened',response);
	    
	          return;
        	}
        	vm.events.splice(index,1);
				  console.log("event " + id_delete + " deleted");
				});
		  }
		}
  }
});