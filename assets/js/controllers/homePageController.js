//var Vue = require('vue');

new Vue({
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
	  	
	        this.$http.get('event').success(function (data){
					this.$set('events', data);
					//console.log(events);
				})
				.error(function (data, status, request){
					if (status === '404') {
						return;
					}
					console.log("An unexpected error occurred: " + status);
				})
				
	    // $set is a convenience method provided by Vue that is similar to pushing
	    // data onto an array
	    //this.$set('events', events);
    },

    // Adds an event to the existing events array
	  addEvent: function() {
	    if(this.event.name) {
	      //this.events.push(this.event);
	      //this.event = { name: '', description: '', date: '' };
	      this.$http.post('event', this.event).success(function(response) {
	      	//console.log(response.id);
	      	this.event.id = response.id;
				  this.events.push(this.event);
				  console.log("Event added!");
				}).error(function(error) {
				  console.log(error);
				});

	    }
	  },

	  deleteEvent: function(index) {
	  	//console.log(index);
	 		//console.log(this.events[index].id);
		  if(confirm("Are you sure you want to delete this event?")) {
		    // $remove is a Vue convenience method similar to splice
		    //this.events.$remove(index);
		    this.$http.delete('event/' + this.events[index].id).success(function(response) {
				  this.events.$remove(index);
				}).error(function(error) {
				  console.log(error);
				});

		  }
		}
  }
});