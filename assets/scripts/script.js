/* 

imageFlip
By Tristan Darwent

Mouse over the image to start to reveal a new image. Once the whole image is revealed it will then start to reveal another new one.
You can use your left and right arrow keys to choose new images.

*/ 

var imageFlip = function() {

	// Stores body tag
	var body = document.getElementsByTagName('body')[0];

	// Stores the boxes in an array
	var boxes1 = [];
	var boxes2 = [];

	// Gets width of window
	var windowWidth = window.innerWidth;

	// Sets number of boxes to be displayed
	var numBoxes = 60;

	// Sets size of boxes based on size of window
	var size = windowWidth/10;

	// Initializes i for for loops
	var i;

	// Holds images in array
	var images = [
		'assets/images/cats.jpg',
		'assets/images/internet.jpg',
		'assets/images/burger.jpg',
		'assets/images/city.jpg',
		'assets/images/people.jpg'
	];

	// Holds random number for image selection
	var imageNum;

	// Gets the horizonal position of where to place the box based on the second digit in the i for the for loop
	function getHorizontalPosition (boxNum) {
		return Math.floor(boxNum / (Math.pow(10, 0)) % 10) * size;
	}

	// Gets the vertical position of where to place the box based on the first digit in the i for the for loop
	function getVerticalPosition (boxNum) {
		return Math.floor(boxNum / (Math.pow(10, 1)) % 10) * size;
	}

	// Generates a random number for the image selection
	function randomImageNum () {
		return Math.floor(Math.random()*images.length);
	}

	// Gets and returns the position of the cursor
	function getPosition (e) {
		// console.log(e.offsetX);
		// console.log(e.offsetY);
		return [ e.offsetX , e.offsetY ];
	}

	// Checks the class names of all the boxes in boxes2 to see if they've all been flipped and returns true or false
	function checkComplete () {
		var complete = false;
		for (i = 0; i < boxes2.length; i++) {
			if (boxes2[i].element.className !== 'box') {
				return complete;
			}
		}
		complete = true;
		return complete;
	}

	// Resets all the boxes and starts the "game" over (starting with the same image they were revealing so the user doesn't notice)
 	function resetBoxes () {
		// Clears everything out of the body tag
		body.innerHTML = '';

		// Empties out box arrays
		boxes1 = [];
		boxes2 = [];

		// Places new boxes on the screen
		placeBoxes();
	}

	// Checks the key press
	function checkKeyPress (e) {
		// If key press is left
	    if (e.keyCode == '37') {
	    	// Check current image num and move it 2 spots backwards then reset the boxes
	    	if (imageNum > 1) {
				imageNum = imageNum-2;
			} else if (imageNum === 1) {
				imageNum = images.length-1;
			} else {
				imageNum = images.length-2;
			}
	        resetBoxes();
	    }
	    // If key press is right
	    else if (e.keyCode == '39') {
	    	// Reset the boxes
	        resetBoxes();
	    }
	}

	// Box object
	function Box (boxNum, back) {
		var self = this;

		// Holds the position of the current box
		var hPos = getHorizontalPosition(boxNum);
		var vPos = getVerticalPosition(boxNum);

		// Creates a div
		this.element = document.createElement('div');

		// If passed 'true' for back, rotates the box via css to be showing the back
		if (back) {
			this.element.className = 'box back';
		} else {
			this.element.className = 'box';
		}

		// Sets width and height of box
		this.element.style.width = size + 'px';
		this.element.style.height = size + 'px';

		// Sets postion of box based on hPos and vPos
		this.element.style.top = vPos + 'px';
		this.element.style.left = hPos + 'px';

		// Gets the selected image and sets it as a background image on the div
		this.element.style.backgroundImage = 'url(' + images[imageNum] + ')';

		// Sets the size of the image to have the same width as the window
		this.element.style.backgroundSize = windowWidth + 'px';

		// Sets the position of the background image in the div based on the position of the div to give the effect of a full unbroken image
		this.element.style.backgroundPosition = '-' + hPos + 'px' + ' -' + vPos +'px';

		// Runs when cursor is moved over the box
		this.element.onmousemove = function() {

			// Gets the x and y of the cursor on the box
			var xy = getPosition(event);

			// Sets margin of area on the box to look for the cursor
			var offset = 15;

			// Finds what size the cursor is first entering the box
			if (xy[0] < offset) {
				self.flip('flipLeft');
			} else if (xy[0] > size - offset) {
				self.flip('flipRight');
			} else if (xy[1] < offset) {
				self.flip('flipTop');
			} else if (xy[1] > size - offset) {
				self.flip('flipBottom');
			}
		};

		// Adds a class that rotates the box in a related direction to the cursor
		this.flip = function (flipDir) {
			self.element.className = 'box ' + flipDir;

			// Removes back class from the related box in the second array of boxes
			boxes2[boxNum].element.className = 'box';

			// Checks to see if all boxes are flipped after they flip a box
			if (checkComplete()) {
				resetBoxes();
			}
		};

		// Adds box to the body tag to display it on screen
		this.element = body.appendChild(this.element);
	}

	// Generates a random number for the image array
	imageNum = randomImageNum();

	// Places all the boxes on the screen
	function placeBoxes () {
		// Creates and pushes to array new boxes to be facing forward
		for (i = 0; i < numBoxes; i++) {
			boxes1.push(new Box(i, false));
		}

		// Moves image number to the next possible image (if at the end of the array, goes to the first)
		if (imageNum !== images.length-1) {
			imageNum++;
		} else {
			imageNum = 0;
		}

		// Creates and pushes to array new boxes to be facing backwards
		for (i = 0; i < numBoxes; i++) {
			boxes2.push(new Box(i, true));
		}
	}

	// Places the initial boxes on load
	placeBoxes();

	// Runs function when a key press is detected
	document.onkeydown = checkKeyPress;
};

// Runs the application
imageFlip();