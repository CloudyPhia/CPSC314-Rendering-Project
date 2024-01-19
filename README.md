# 🦈 CPSC314 Underwater Rendering Project🦈
## Animating with Hierarchical Transformations
Runner-up of best creative A3 submission for the 2023W1 term!

As a huge fan of all things ocean-related, I decided to try rendering a hammerhead shark for this assignment. There are two key motions that can be switched between when pressing the space bar:

Motion 1: swimming back and forth (this continues in a loop which is a bit difficult to see because of the gif's length and because I was showing off the scene here, including the bobbing seahorses)
![](https://github.com/CloudyPhia/CPSC314-Rendering-Project/blob/main/gifs/sharkvideo1.gif)

Motion 2: swimming up and then doing a "diving" motion
![](https://github.com/CloudyPhia/CPSC314-Rendering-Project/blob/main/gifs/sharkvideo2.gif)

You can also change the colour of the light source randomly by pressing "L":
![](https://github.com/CloudyPhia/CPSC314-Rendering-Project/blob/main/gifs/sharkvideo3.gif)

Or, you can also pause the animation by pressing the "T" button:
![](https://github.com/CloudyPhia/CPSC314-Rendering-Project/blob/main/gifs/sharkvideo4.gif)

Here is my preliminary sketching and planning as to the positioning of each element, including planning out approximately where I dimensionally imagined each component. Then, I planned out the links of each component (and their subsequent matricies and coordinate frames) with the additional help of a scene graph. The links within the code ended up having different matrix values, but this was an excellent exercise in planning out the dimensions and sizes!
![](https://github.com/CloudyPhia/CPSC314-Rendering-Project/blob/main/sketch.jpg)

Note: What is shown here is the creative component to CPSC 314's A3. Part of the code shown here is part of Michiel van de Panne's assignment code. I worked on: setting up animation data structures; loading the textures; initialization of the scene and motions (including adding all keyframes); the matrices/link setup and animation for seahorse1, seahorse2, and shark; created part of the initObjects; created all of initShark; created part of initFileObjects; created part of onResourcesLoaded; adjusted and added to the onDocumentKeyDown(event) function; updated the update() function; designed the scene, came up with the concept, and created the initial sketch. 
