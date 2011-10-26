/**
 * A jQuery Rotator Plugin
 *
 * Made to play nicely with my WordPress theme framework.
 * Hopefully.
 * @author Jay Zawrotny <jayzawrotny@gmail.com>
 * @version 1.0
 */
(function( $ ){

  var methods = {
	/**
	 * Current Slide Index
	 */
	current_slide : 0,

	/**
	 * The collection of slides
	 */
	 slides : new Object(),

	/**
	 * Total slides
	 */
	total_slides : 0,

	/*
	 * The Interval Timer for when to change slides
	 */
	interval: 0,

	/*
	 * Default Settings
	 */
	settings : {
		'slide_duration' : 5000,
		'padding' : 35
	},

	/**
	 * Initiator Function
	 *
	 * Controls our main logic, gathers the slides, finds the next one.
	 * Sets the event handlers. Whatever needs to be done.
	 * @param {object} options The options to over-ride the default.
	 * @return {object} The jQuery object for chainability
	 * @member jTater
	 */
	init : function( options ) { 

		if( options ) {
			$.extend( methods.settings, options );
		}


		return this.each(function() {

			var $this = $(this);
            
			/**
			 * Start Here
			 */

			methods.set_slides( $this );
            methods.set_container_width($this);
			methods.start_rotating();


			/**
			 * Handle Events
			 */

			$('#rotator-ui li a').click( methods.select_slide );
            $('.slide', methods.slides).mouseenter( methods.stop_rotating );
			$('.slide', methods.slides).mouseleave( methods.start_rotating );
		} );

	},

    /**
	 * Function Select Slide
	 *
	 * An event triggered when our UI bullet button is clicked.
	 * @param {object} Event object.
	 * @return bool
	 * @member jTater
	 * @private
	 */
	select_slide : function( event )
	{
		var index = $(this).attr('rel');
		methods.stop_rotating();
		methods.slide_to( index );
		methods.update_ui( index );
		methods.current_slide = index;

		methods.start_rotating();
		return false;
	},

	/**
	 * Function Slide To
	 *
	 * Uses slide index to slide to that slide.
	 * @param {Number} slide_index 0 Based Slide Index to Slide to
	 * @member jTater
	 */
	slide_to : function( slide_index )
	{
		var current_index = methods.current_slide;
        var width = methods.calculate_slide_position( slide_index );
		var up_to_width = width;

		$(methods.slides).animate( {
				'margin-left' : -(up_to_width)
			});
	},

	/**
	 * Function Set Container Width
	 *
	 * Makes sure the parent ul is the horizontal width of all
	 * the slides plus their margin.
	 */
	set_container_width : function(slides_ul) {

		var total_width = 0;

		$('li', slides_ul).each( function() {
			   total_width += $(this).width();
		} );

		total_width += methods.settings.padding * methods.total_slides;

		$(methods.slides).css( 'width', total_width );
	},

	/**
	 * Function Set Slides
	 *
	 * Initiating function that locally stores our slides 
	 * container DOM tree.
	 * @private
	 * @param {Object} slides_ul The jQuery selected objects
	 * @member jTater
	 */
	set_slides : function( slides_ul )
	{
		methods.slides = slides_ul;
		methods.total_slides = $('li', slides_ul).length;
	},
                                            
	/**
	 * Function Start Rotating
	 *
	 * Starts rotating the slides. Can be stopped when you want to puse.
	 * @method jTater
	 */
	start_rotating : function(event)
	{
		if( methods.interval != 0 )
		{
			return;
		}
		methods.interval = setInterval( methods.rotate_slide, methods.settings.slide_duration );
	},

	/**
	 * Function Stop Rotating
	 *
	 * Stops rotating the slides.
	 * @member jTater
	 */
	stop_rotating : function(event)
	{
		clearInterval( methods.interval );
		methods.interval = 0;
	},

	/**
	 * Function Rotate Slide
	 * 
	 * Trigged from our Interval. Tells the rotator to get the next slide.
	 * @member jTater
	 */
	rotate_slide : function()
	{
		methods.next_slide();
	},
    /**
	 * Function Next Slide
	 *
	 * Selects, animates, or resets the next slide. If we're at the last one
	 * Animate it back to the first.
	 * @member jTater
	 */
	next_slide : function()
	{

		if( methods.current_slide == methods.total_slides - 1 )
		{
			methods.reposition_slides();
            methods.current_slide = 0;
		}else{
			methods.current_slide++;	
			methods.slide_to( methods.current_slide );
		}

		methods.update_ui( methods.current_slide );

	},

	/**
	 * Function Reposition Slides
	 *
	 * Animates the slides back to the beginning when at the last slide.
	 * @member jTater
	 */
	reposition_slides : function ()
	{
		$(methods.slides).animate( {
				'margin-left' : 0
			} );
	},

	/**
	 * Function Calculate Slide Position
	 *
	 * Calculates the distance to show that slide in the rotator frame.
	 * Takes the current slide index multiplied by the width of the slide.
	 * @param {Number} slide_index the slide to calculate the distance to.
	 * @member jTater
	 */
	calculate_slide_position : function( slide_index )
	{
		var width = $('li:eq(' + slide_index + ')', methods.slides).width();
		width = ( width + methods.settings.padding ) * slide_index;   
		
		return width;
	},

	/**
	 * Function Update UI
	 *
	 * Updates the rotator user interface by showing which link was selected.
	 * @param {Number} slide_index the index to show selected
	 * @member jTater
	 */
	update_ui : function( slide_index )
	{
		var rotator_ui = $(methods.slides).parent('div').siblings( '#rotator-ui' );

		$('li', rotator_ui).removeClass( 'selected' );
		$( 'li:eq(' + slide_index + ')', rotator_ui ).addClass( 'selected' );
	}

  };

  /**
   * Main Plugin Logic
   *
   * Our self contained jTater class object handler thing.
   * $('slider-container').jTater( {Object} options );
   */
  $.fn.jTater = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.jTater' );
    }    
  
  };

})( jQuery );
