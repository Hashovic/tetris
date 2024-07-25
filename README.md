# TeTris
### Creator: Hashim Alfayyadh
### Video Demo: https://youtu.be/tt0t9fTbPTI

### Sources:
    - ChatGPT
    - Code Bullet (Youtube Channel) https://youtu.be/QOJfyp0KMmM?si=a-fbKzI5UxfXIumZ
    - p5.js documentation https://p5js.org/reference/
    - The Coding Train (Youtube Channel) https://www.youtube.com/@TheCodingTrain

### Description:

My Project is made up of 4 main javascript files:

    - main.js
    - sketch.js
    - Shape.js
    - Block.js

Along with:

    - an index.html file
    - a styles.css file

### Inspiration:

I've always wanted to create a clone of tetris since I began programming. Everytime I began I would instantly give up as I didn't know how to continue independently without following every single step from a tutorial. Now after completing the cs50x course, I had the tools I needed to create what I had in mind.

## p5.js
The project is based off of the __p5.js__ framework which makes it easy to create shapes and game loops. You can draw a shape onto a canvas with two functions and a couple lines of code. There are also great resources online such as The Coding Train, (cited above), that have very detailed descriptions on how to use p5.js. For nearly every problem I had, I simply looked for a Coding Train video and it was there. I found p5 originally from a video created by Code Bullet (cited above) in which he actually created tetris using the p5.js framework. In his video he actually created an AI along with it but I didn't go that far.

## assets

Contains all the assets used throughout the project. This includes fonts and icons that were used.

## main.js

First I'll discuss the functionality of the main.js file:

At the top of main.js there are two variables, <code>player1</code> and <code>player2</code>. These variables hold the instances of p5.js used for each player. Player1 is also used for the singleplayer mode. Below this there is an event listener 'DOMContentLoaded' that is called the moment the initial html is loaded. Underneath there are some constants that are used for accessing certain DOM elements, like the buttons and screens.

Then there are some event listeners for the buttons that check when they are clicked to start the game as singleplayer, multiplayer or to restart to the homescreen.

The <code>startGame</code> function creates one p5 instance if single player and two if multiplayer and assigns them to player1 and player2. The <code>restartGame</code> function simply displays the starting screen.

The final method which is outside the originial event listener, <code>gameOver</code> is called from within the p5 tetris instances (discussed later). It's job is to end the p5 instances and to display the game over screen. If it's single player it displays the score and if it's multiplayer it displays the winner. The statement is simply used to ensure that <code>gameOver</code> is in the global scope.

## sketch.js

This is where all the magic happens!

At the top of the file there are a few constants that are used for sizing and timing, along with some multiplayer specific variables likes garbage and isSinglePlayer.

The two instances, <code>tetris</code> and <code>tetris2</code> are nearly identical so I will only explain the functionality of one of them along with the unique parts of <code>tetris2</code>. 

Inside of the p5 instance there are multiple local variables that are used for controls and functionality. The <code>shapey</code> variable is the current active shape. 

### (Multiplayer Exclusive) ***

### p.preload()

The preload method is run prior to the setup function and is used to initialize the font.

### p.setup()

The setup method is run once prior to the draw function and is used to setup the canvas. There is an orientations array that is used to store how every shape should look like.
Specifically:

    - positions: This is the relative position in grid lengths of each block relative to the top left corner of the shape's "bounding box" or the possible space that it takes up in a square shape. This uses the p5.Vector createVector() which stores an x and y value.
    
    - coloring: The coloring of the shape type

    - rotate_pos: The imaginary square position where the rest of the blocks will rotate around.

Then three canvas are created using <code>createCanvas</code> and <code>createGraphics</code>. <code>createCanvas</code> creates the actual play area and <code>createGraphics</code> creates an imaginary canvas that is used in this game to create the held and next pieces. The active shape and the outline are then initialized using the <code>draw_block</code> function that creates a Shape object (discussed later). Then the next pieces are populated and initially placed onto the canvas. Then the canvas is centered and some values for text are initialized.

### p.draw()

This function is the game loop in a p5 instance that is constantly running.

Every iteration, the background is filled with gray and all the graphics are drawn, such as the held piece, instructions, grid, etc. Then each "dead" piece (or the unused pieces that are at the bottom of the playing board) are drawn along with the outline and the active shape. 

Then it checks if the active block has been placed. If true:

    - adds all the blocks in the shape to the dead blocks array
    - checks for a line clear
    - sends garbage (if applicable)
    - creates a new active piece and outline
    - checks if there was a loss

Or if it is false it simply runs the movement function

### createHold()

Draws the held text and piece onto the held_piece graphic and draws it onto the canvas.

### createGarbage() ***

Draws the red garbage bar that appears if a player is sent garbage in multiplayer.

### addGarbageBlocks() ***

Adds the acutal garbage blocks into the game with a randomly placed hole. It moves all the current dead pieces upwards to make room for the garbage pieces that will be added. Garbage is then set to 0 as all the garbage would have been added.

### sendGarbage(amount) ***

This function updates the contents of the garbage array when garbage is sent by a given amount.

### createNext()

Draws the shapes in the <code>next_shapes</code> array onto the <code>next_canvas</code> graphics element and draws it onto the main canvas.

### playerNum() ***

Displays the player number at the bottom right corner.

### createGrid()

Draws the grid using horizontal and vertical lines provided by the p5.js framework.

### createInstructions()

Creates the instructions displayed at the bottom left corner of the main canvas.

### p.centerCanvas()

Centers the canvas in the window. This function is also used for the multiplayer mode with a shift in the x director.

### p.windowResized()

Built in p5.js function that is called everytime the window is resized. It is used to call the <code>p.centerCanvas</code> function.

### draw_block()

Creates a Shape object with a specific x and y position along with a type and location (i.e. main canvas or a graphics element)

### p.keyPressed()

Built in p5.js function that is called everytime a key is pressed. It is used for rotation, hard_drops and holding. There is also some functionality with left and right giving a small delay on the first press.

### movement()

Deals with all the movement of the active piece. This moves the piece down, left and right in the regular state.

### check_valid(c, s=shapey)

Checks the validity of a specific move (i.e. rotation or movement) by finding the future positions of that specific move depending on the case <code>c</code> (i.e. what kind of movement). This function is used primarily for the active shape <code>shapey</code> but the outline uses this method as well, therefore there is another optional parameter to allow for this.

### line_clear()

Checks if a line is cleared and clears it, moving the dead pieces down accordingly. This function also returns the number of lines cleared to be used for garbage sending in the multiplayer mode.

### add_held()

Adds the held piece to the held piece area and creates new Shape objects accordingly. If the shape has switched without a block being placed, it will not allow for a change until the current active block is placed on the main play area. The color of the held piece also changes to match this behavior.

### next_piece()

This function rotates through all the next pieces and adds a new one to the end. It also deals with moving the next pieces up and returns the next piece to be used. This next piece return value is used for the active shape to decide what kind of shape it should be.

### check_lose()

Checks if the active piece was intially placed onto a currently dead piece and calls the <code>window.gameOver</code> function from the main.js file if this is the case.

### draw_outline()

Draws the outline shape that is used to show where the piece will land if a hard drop is done. It helps with visualizing where the piece will go with minimal difficulty. It does this by getting the current position of the active piece, creates a new block at that position, rotates it the proper amount and drops it as low as possible.

***

***The <code>tetris2</code> instance is nearly identical with a few key differences to allow for single player***

The controls at the top are different depending on where or not single player is being played.

### createInstructions()

The instructions differ depending on what controls are used.

### createScore()

Draws the score text at the bottom right corner of the screen with the properly updated score.

### centerCanvas()

Has different values for it's position depending on whether or not it is single or multi player.

## Shape.js

This is the object that allows for the complex shape behaviors.

At the top of the Shape.js file, there is a constructor that requires:

    - a starting position: used for the basis for shape drawing
    - a shape type: used to know the shape orientation, coloring and rotation point
    - pg: the area in which the shape will be drawn (i.e. main canvas or graphics)
    - instance: describes the p5 instance that the shape will be drawn onto

Using this information, the Shape object is populated with Block objects that are placed in the blocks array.

The Shape class has a few functions:

### draw()

Displays the shape

### mvdwn()

Moves the shape down one grid length

### mvleft()

Moves the shape to the left one grid length

### mvright()

Moves the shape to the right one grid length

### mvvect(vect)

Moves the shape an inputted vector distance away. The vector must be a p5.Vector object.

### rotate()

Rotates the shape around a point (specified by the shape type).

### future_pos(c)

Gets the future position depending on the case. Case 0 is the down case, case 1 is the left case, case 2 is the right case, and case 3 is the rotate case. This returns an array with all the future block positions to be used for collision detection purposes.

### get_pos()

Gets the position of all the Block objects that make up the Shape object and returns an array of the positions.

### get_cur_pos()

Gets the current position of the top left corner of the shape bounding box.

### get_type()

Returns the type of the shape

### set_color(c)

Sets the color of the shape to a specified color <code>c</code>. This color must be a p5 color object.

### reset_color()

Sets the color of the shape to the default color of that shape type.

### get_rotate_amount()

Returns the rotation state of the shape by getting the remainder of the number of rotation divided by 4. This is used for the outline or shadow shape on the canvas.

## Block.js

This is the object that each Shape object is made up of.

The constructor for the Block class requires:

    - A position: Used to know where the block is in grid lengths
    - A coloring: The coloring of the block
    - Instance: The player to draw to
    - pg: Where to draw it (i.e. the main canvas or graphics)

### draw()

Creates a square with a specified color and location

### mvdwn()

Moves the individual block one unit down

### mvleft()

Moves the individual block one unit left

### mvright()

Moves the individual block one unit right

### mvvect(vect)

Moves the block a specified p5.Vector unit distance.

### set_pos(val)

Sets the current position to the p5.Vector object, val.

### get_pos()

Gets a copy of the current block position

### set_color()

Sets the color of the individual block

## index.html

Only a single html document is used but certain things are hidden or displayed to create the user experience.

At the top of the file, the icon is initialized along with all the scripts being declared. The <code>start-screen</code> div is used to display the start screen. This includes the title, my name, and the buttons for single or multi player.

The <code>game-screen</code> div is used to display the acutal game screen with the canvases. The div elements with id's, player1 and player2 are where the two p5 instances are placed.

The final <code>game-over</code> div is used to display a GAME OVER message with a score for single player or the winner in a multiplayer battle.

## styles.css

This creates all the styles in the html document.

At the top of the stylesheet, there is a font initializer that initializes the font seen in the tetris title and all the UI. The rest of the css is used for spacing and placing in the proper locations. Coloring is also described in the css with a particularly interesting use at the very end of the sheet:

```
.tetris-letter {
    display: inline-block;
}

.tetris-letter.t {color: rgb(255, 80, 80);}

.tetris-letter.e {color: rgb(220, 90, 240);}

.tetris-letter.r {color: rgb(56, 196, 236);}

.tetris-letter.i {color: rgb(245, 140, 80);}

.tetris-letter.s {color: rgb(240, 220, 60);}
```

This is how the individual characters of the tetris title are created having different colors.