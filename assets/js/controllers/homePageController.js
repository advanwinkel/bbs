//var Vue = require('vue');

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

			var evts = [];

			io.socket.get('/event', function whenServerResponds(resp, JWR) {
        
        console.log('Fetched videos and subscribed... Response:', resp);
        
        //console.log(resp.length);
        
        for(var i=0;i<resp.length;i++){
				     evts.push(resp[i]);
				}
        //this.$set('events', evts);
        if (JWR.statusCode >= 400) {
   
          console.log('something bad happened',resp);
    
          return;
        }
      });

	    // $set is a convenience method provided by Vue that is similar to pushing
	    // data onto an array
	    console.log("evts: " + evts);
	    this.$set('events', evts);
    
	    io.socket.on('event', function whenAVideoIsCreatedUpdatedOrDestroyed(msg) {
        console.log('Is it firing',msg);
        if (msg.verb == "created") {
		      vm.events.unshift({
			          name: msg.data.name,
			          description: msg.data.description,
			          date: msg.data.date
	      	 });
	    	}
	    	if (msg.verb == "destroyed"){
	        vm.events.unshift({
			          name: msg.previous.name,
			          description: msg.previous.description,
			          date: msg.previous.date
      	 	});
	    	}
      });
     },

    // Adds an event to the existing events array
	  addEvent: function() {
	    if(this.event.name) {
	     	var evt = this.event;
				//console.log(evt);

				io.socket.post('/event',
					{name: evt.name,
					 description: evt.description,
					 date: evt.date },
					 function whenServerResponds(resp, JWR) {
					//console.log(JWR.statusCode);
					//console.log(JWR);
					if (JWR.statusCode != 201) {
   
	          console.log('something bad happened',resp);
	    
	          return;
        	}
					evt.id = resp.id;
				});
				this.events.push(this.event);
				this.event = { name: '', description: '', date: '' }
				
	    }

	    

	  },

	  deleteEvent: function(index) {
	  
		  if(confirm("Are you sure you want to delete this event?")) {

				var id_delete = this.events[index].id;
				io.socket.delete('/event/' + id_delete, function (response, JWR) {
					//console.log(JWR.statusCode);
					if (JWR.statusCode != 200) {
   
	          console.log('something bad happened',resp);
	    
	          return;
        	}
				  console.log("event " + id_delete + " deleted");
				});
				this.events.$remove(index);	
		  }
		}
  }
});