# A-Frame Project: Interactive Virtual Museum Tour

## Project Overview

In this hands-on project, you'll create an **interactive virtual museum** where visitors can teleport between different rooms, view artwork, interact with exhibits using gaze controls, and hear ambient sound effects. This project combines many of the concepts you've learned throughout the course.

### Learning Objectives

By completing this project, you'll practice:

- Scene setup and 3D modeling
- Applying textures to objects
- Implementing lighting and fog
- Creating gaze-based interactions
- Building VR tour functionality with teleportation
- Adding sound effects
- Optimizing code with custom components

---

## Project Structure

Your museum will have:

1. **Entrance Hall** - Main lobby with a welcome message
2. **Art Gallery** - Room with textured artwork displays
3. **Sculpture Court** - Room with 3D models and interactive elements
4. **Planetarium** - A cosmic-themed room with animations

Each room will be accessible via gaze-activated waypoint buttons.

---

## Step-by-Step Tutorial

### Step 1: Create the Basic HTML Structure

Start with a basic A-Frame scene. You should remember the basic A-Frame setup from Module 1.

**Hints:**

- Remember to import A-Frame from the CDN in your `<head>`
- Use `<a-scene>` as the root container
- Add a camera with position and VR mode enabled
- Set up a canvas texture for rendering

Create your `index.html`:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Virtual Museum Tour</title>
		<meta name="description" content="Interactive A-Frame Museum" />
		<script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
		<script src="script.js"></script>
	</head>
	<body>
		<a-scene
			background="color: #1a1a2e"
			fog="type: linear; color: #1a1a2e; near: 1; far: 35"
		>
			<!-- Camera and Controls -->
			<a-entity
				camera
				position="0 1.6 0"
				look-controls
				wasd-controls
			></a-entity>

			<!-- Entrance Hall (Starting Room) -->
			<!-- TODO: Add floor plane -->
			<!-- TODO: Add welcome sign -->
			<!-- TODO: Add waypoint buttons to different rooms -->
		</a-scene>
	</body>
</html>
```

### Step 2: Create the Entrance Hall

Now you'll build the entrance room. Think about Module 2 (Modeling) and Module 3 (Textures).

**Hint about the floor:**

- Use a large plane to create a floor
- Position it below the camera (negative Y value)
- Use a texture (you can use a simple color to start)
- Scale it appropriately so it looks spacious

**Hint about the welcome sign:**

- Create a plane geometry for displaying text
- Use the `text` or position text above a plane
- You can use a colored material
- Consider positioning it at eye level (around `y: 1.6`)

```html
<!-- Entrance Hall Floor -->
<a-plane
	position="0 -1 0"
	rotation="-90 0 0"
	width="20"
	height="20"
	color="#2a4d6d"
	material="side: double"
></a-plane>

<!-- Back Wall -->
<a-plane position="0 3 -10" width="20" height="8" color="#1a2332"></a-plane>

<!-- Welcome Sign -->
<a-entity
	text="value: WELCOME TO THE MUSEUM; align: center; color: white; width: 10"
	position="0 2.5 -9.9"
></a-entity>
```

**Task:** Add these elements to your HTML scene.

---

### Step 3: Add Lighting and Fog

You learned about lighting in Module 4. Now apply it to create ambiance.

**Hints:**

- Use directional light to simulate natural light
- Add an ambient light for overall illumination
- Fog is already in the scene tag - adjust if needed

```html
<!-- Lighting -->
<a-light
	type="directional"
	color="white"
	intensity="0.8"
	position="5 10 5"
></a-light>
<a-light type="ambient" color="white" intensity="0.4"></a-light>
```

**Task:** Add these lights to your scene in the `<a-scene>`.

---

### Step 4: Create Waypoint Buttons for Room Teleportation

This is where you implement VR Tour functionality (Module 12). Students will look at buttons to teleport.

**Hints:**

- Create a box or plane to serve as a button
- Position it at eye level
- You can listen to `click` events or use raycaster for gaze interactions
- When clicked/gazed upon, change the camera position to teleport to a new room
- Use a scaling animation to provide feedback

Create buttons in your HTML:

```html
<!-- Waypoint Button to Art Gallery -->
<a-entity
	position="5 1.6 -5"
	id="gallery-button"
	geometry="primitive: box; width: 1.5; height: 0.8; depth: 0.2"
	material="color: #4fc3f7; emissive: #4fc3f7; emissiveIntensity: 0.5"
	cursor="fuse: true; fuseTimeout: 2000"
	event-set__enter="_event: mouseenter; scale: 1.2 1.2 1.2"
	event-set__leave="_event: mouseleave; scale: 1 1 1"
>
	<a-text
		value="Art Gallery"
		align="center"
		anchor="center"
		color="white"
	></a-text>
</a-entity>

<!-- Waypoint Button to Sculpture Court -->
<a-entity
	position="-5 1.6 -5"
	id="sculpture-button"
	geometry="primitive: box; width: 1.5; height: 0.8; depth: 0.2"
	material="color: #ef5350; emissive: #ef5350; emissiveIntensity: 0.5"
	cursor="fuse: true; fuseTimeout: 2000"
	event-set__enter="_event: mouseenter; scale: 1.2 1.2 1.2"
	event-set__leave="_event: mouseleave; scale: 1 1 1"
>
	<a-text
		value="Sculpture"
		align="center"
		anchor="center"
		color="white"
	></a-text>
</a-entity>
```

Now, create `script.js` to handle the teleportation:

```javascript
// Get references to the camera and buttons
const camera = document.querySelector("a-entity[camera]");
const galleryButton = document.getElementById("gallery-button");
const sculptureButton = document.getElementById("sculpture-button");

// Room configurations (position and rotation for each room)
const rooms = {
	entrance: { position: "0 1.6 0", rotation: "0 0 0" },
	gallery: { position: "30 1.6 0", rotation: "0 0 0" },
	sculpture: { position: "-30 1.6 0", rotation: "0 0 0" },
};

// Function to teleport camera to a room
function teleportTo(roomKey) {
	const room = rooms[roomKey];
	camera.setAttribute("position", room.position);
	// TODO: Add sound effect when teleporting
}

// Add click listeners to buttons
galleryButton.addEventListener("click", () => {
	teleportTo("gallery");
});

sculptureButton.addEventListener("click", () => {
	teleportTo("sculpture");
});
```

**Task:** Add the waypoint buttons and implement the teleportation logic.

---

### Step 5: Create the Art Gallery Room

Now extend your HTML to include the Art Gallery. Use textures (Module 3) and modeling (Module 2).

**Hints:**

- Create a new set of walls and floor for this room
- Position them at x: 30 (offset from entrance)
- Create picture frames using planes with colors or textures
- Use simple colored planes to simulate artwork
- Add text labels for each artwork

```html
<!-- ART GALLERY ROOM (at position x: 30) -->

<!-- Gallery Floor -->
<a-plane
	position="30 -1 0"
	rotation="-90 0 0"
	width="20"
	height="20"
	color="#3d5a50"
></a-plane>

<!-- Gallery Back Wall -->
<a-plane position="30 3 -10" width="20" height="8" color="#2a3a35"></a-plane>

<!-- Artwork 1 - Abstract -->
<a-box
	position="28 2 -9.5"
	width="3"
	height="3"
	depth="0.2"
	material="color: #ff6b6b"
></a-box>
<a-entity
	text="value: Abstract Expression; color: white; align: center"
	position="28 0.7 -9.4"
></a-entity>

<!-- Artwork 2 - Digital -->
<a-box
	position="32 2 -9.5"
	width="3"
	height="3"
	depth="0.2"
	material="color: #4ecdc4"
></a-box>
<a-entity
	text="value: Digital Dreams; color: white; align: center"
	position="32 0.7 -9.4"
></a-entity>

<!-- Return Button -->
<a-entity
	position="30 1.6 8"
	id="return-button"
	geometry="primitive: box; width: 1.5; height: 0.8; depth: 0.2"
	material="color: #9c27b0; emissive: #9c27b0; emissiveIntensity: 0.5"
	cursor="fuse: true; fuseTimeout: 2000"
	event-set__enter="_event: mouseenter; scale: 1.2 1.2 1.2"
	event-set__leave="_event: mouseleave; scale: 1 1 1"
>
	<a-text value="Exit" align="center" anchor="center" color="white"></a-text>
</a-entity>
```

Add to your `script.js`:

```javascript
const returnButton = document.getElementById("return-button");

returnButton.addEventListener("click", () => {
	teleportTo("entrance");
});
```

**Task:** Create the art gallery room with at least 2 artworks and a return button.

---

### Step 6: Create the Sculpture Court (with 3D Model Import)

Create another room using Module 5 (Import Third-Party Models) and Module 2 (Modeling).

**Hints:**

- Use simple geometric shapes to create sculptures
- Or import a simple model from Sketchfab using the asset management system
- Create an interesting layout with multiple objects
- Consider using different colors and scales

```html
<!-- SCULPTURE COURT (at position x: -30) -->

<!-- Court Floor -->
<a-plane
	position="-30 -1 0"
	rotation="-90 0 0"
	width="20"
	height="20"
	color="#4a3728"
></a-plane>

<!-- Sculpture 1 - Cone -->
<a-cone
	position="-28 1 0"
	radius-bottom="1.5"
	radius-top="0.5"
	height="3"
	material="color: #ff9800"
></a-cone>
<a-entity
	text="value: Geometric Form; color: white"
	position="-28 0.2 0"
></a-entity>

<!-- Sculpture 2 - Sphere -->
<a-sphere
	position="-32 1.5 0"
	radius="1.5"
	material="color: #2196f3"
></a-sphere>
<a-entity text="value: Harmony; color: white" position="-32 0.2 0"></a-entity>

<!-- Sculpture 3 - Cylinder -->
<a-cylinder
	position="-30 1 -3"
	radius="1"
	height="3"
	material="color: #9c27b0"
></a-cylinder>
<a-entity
	text="value: Ascension; color: white"
	position="-30 0.2 -3"
></a-entity>

<!-- Return Button -->
<a-entity
	position="-30 1.6 8"
	id="sculpture-return"
	geometry="primitive: box; width: 1.5; height: 0.8; depth: 0.2"
	material="color: #9c27b0; emissive: #9c27b0; emissiveIntensity: 0.5"
	cursor="fuse: true; fuseTimeout: 2000"
	event-set__enter="_event: mouseenter; scale: 1.2 1.2 1.2"
	event-set__leave="_event: mouseleave; scale: 1 1 1"
>
	<a-text value="Exit" align="center" anchor="color: white"></a-text>
</a-entity>
```

Add to `script.js`:

```javascript
const sculptureReturn = document.getElementById("sculpture-return");

sculptureReturn.addEventListener("click", () => {
	teleportTo("entrance");
});
```

**Task:** Create the sculpture court with 3 sculptures and a return button.

---

### Step 7: Add Sound Effects (Module 13)

Add ambient sound and interaction sounds to enhance the experience.

**Hints:**

- Use `<a-sound>` elements to add audio
- Add ambient background music to each room
- Play a "whoosh" sound when teleporting
- You can use free sound effects from freesound.org or pixabay.com

Add to your HTML `<a-scene>`:

```html
<!-- Ambient Sounds -->
<a-sound
	src="url('path/to/ambient-music.mp3')"
	autoplay="true"
	loop="true"
	volume="0.3"
></a-sound>

<!-- Teleport Sound (hidden audio element) -->
<audio
	id="teleport-sound"
	src="path/to/whoosh-sound.mp3"
	preload="auto"
></audio>
```

Update your `teleportTo` function in `script.js`:

```javascript
function teleportTo(roomKey) {
	const room = rooms[roomKey];
	camera.setAttribute("position", room.position);

	// Play sound effect
	const sound = document.getElementById("teleport-sound");
	sound.currentTime = 0;
	sound.play().catch((e) => console.log("Sound playback failed:", e));
}
```

**Task:** Add at least one sound effect. (You can use placeholder URLs for now and replace with real audio later)

---

### Step 8: Add Animations (Module 6)

Add subtle animations to make your museum more dynamic.

**Hints:**

- Use `<a-animation>` to animate objects
- Consider rotating sculptures slowly
- Add movement to light sources
- Keep animations subtle to not overwhelm visitors

Example animation for a sculpture:

```html
<a-cone
	position="-28 1 0"
	radius-bottom="1.5"
	radius-top="0.5"
	height="3"
	material="color: #ff9800"
>
	<a-animation
		attribute="rotation"
		dur="4000"
		from="0 0 0"
		to="0 360 0"
		repeat="indefinite"
	></a-animation>
</a-cone>
```

**Task:** Add a rotating animation to at least one sculpture.

---

### Step 9: Optional Enhancements

Try these if you want to push your project further:

**Option A: Collision Detection (Module 9)**

- Create collectible "coins" or "artifacts" scattered around the museum
- Track how many the user collects as they walk around

**Option B: Custom Components (Module 10)**

- Create a custom component called `museum-room` to reduce code repetition
- Use it to manage room creation more efficiently

**Option C: Physics (Module 8)**

- Add ball objects that bounce around the museum floor
- Create a fountain or water feature with particles

**Option D: Interactive Exhibits (Module 11)**

- Add gaze-activate displays that show information about artworks
- Create interactive quiz questions that appear when looking at art

---

## Hints & Troubleshooting

### General Tips:

1. **Test frequently** - Open your HTML file in a browser as you build
2. **Use the browser console** - Press F12 to see any JavaScript errors
3. **Gaze controls note** - The `cursor="fuse:true"` creates a gaze-based crosshair that interacts with entities
4. **Mobile/VR:** Test in VR by using Enter VR button (if using a VR headset or Google Cardboard)

### Common Issues:

- **Entities not visible?** Check the position and rotation values
- **Text too small/large?** Adjust the `scale` attribute or font size in the text component
- **Sound not playing?** Check browser console for CORS errors; use HTTPS URLs or local files
- **Buttons not responding?** Make sure they have `cursor` attribute and `click` listeners in JavaScript

### Debugging Positions:

Remember that A-Frame uses X, Y, Z coordinates:

- **X axis:** Left (-) to Right (+)
- **Y axis:** Down (-) to Up (+)
- **Z axis:** Away (-) to Towards you (+)

The camera starts at position="0 1.6 0" (eye level height is 1.6m)

---

## Challenge Questions for Learning

As you build, think about these questions:

1. How could you add a minimap showing all rooms?
2. What would happen if you combined the Physics module with sculptures?
3. How could you create a guided tour using animations and waypoints?
4. Can you create a "secret room" that's hidden until certain conditions are met?

---

## Submission Checklist

Your museum should have:

- [ ] Entrance hall with welcome message
- [ ] At least 2 additional rooms (Art Gallery, Sculpture Court, Planetarium)
- [ ] Functioning teleportation between rooms via gaze-activated buttons
- [ ] Proper lighting and fog in the scene
- [ ] At least 2 artworks or sculptures
- [ ] At least 1 sound effect
- [ ] At least 1 animation
- [ ] Clean, organized JavaScript code
- [ ] Working in both desktop and VR modes

---

## Resources

- [A-Frame Documentation](https://aframe.io/docs/)
- [Sketchfab Models](https://sketchfab.com/) (for 3D models)
- [Free Sounds](https://freesound.org/) (for audio effects)
- [A-Frame Inspector](https://aframe.io/docs/1.4.0/introduction/visual-inspector-and-dev-tools.html) - Press `CTRL+ALT+I` in your scene

---

## Final Notes

This project is designed to be flexibly - you can add more rooms, more complex interactions, or more detailed models as you become comfortable. The goal is to practice integrating multiple A-Frame concepts into a cohesive experience.

Good luck, and have fun building your museum! 🎨
