---
title: 'Make your own PCB Hacker Card'
description: Let's build a business card -- but with a twist -- it can transmit a URL on tap and light up! You'll learn the basics of designing a PCB, and you can get the cards made for free, with Hack Club's OnBoard.
contributor: 'maggie-j-liu'
contributorSlackID: U026XSMKEDC
thumbnail: 'https://cloud-r8rjrxk4j-hack-club-bot.vercel.app/0000hacker_card_jam_thumbnail__1__50.webp'
timeEstimate: '1 Hour'
difficulty: 'Beginner'
keywords: 'Hardware, PCB, EasyEDA, NFC, business card, OnBoard'
language: 'EasyEDA'
presentation: 'https://www.figma.com/proto/0ucrvtjExgBSEJ6WkTvegZ/hacker-card-jam?type=design&node-id=1-4&t=f8tg0SGZ0aMs0SFo-0&scaling=contain&page-id=0%3A1'
presentationPlay: 'https://www.figma.com/proto/0ucrvtjExgBSEJ6WkTvegZ/hacker-card-jam?type=design&node-id=1-4&t=f8tg0SGZ0aMs0SFo-0&scaling=contain&page-id=0%3A1'
presentationPDF: 'https://cloud-4gfgew7yj-hack-club-bot.vercel.app/00hacker_card_jam-min.pdf'
notes: ''
poster: 'https://github.com/hackclub/posters#:~:text=%40Krishna%20Bansal-,Download,-Go%20to%20Figma'
video: 'https://cloud-baw5pw456-hack-club-bot.vercel.app/0build_a_circuit_board_with_maggie.mp4'
slug: 'hacker-card'
---

Reva went through this workshop & the components in a hat workshop and ended up making a custom pcb project for her club! For a bit of inspiration: check it out [the slides](https://www.canva.com/design/DAF_cqpJG9U/DPYFvBbpFErhEzrQPm4iwQ/view?utm_content=DA[…]G9U&utm_campaign=designshare&utm_medium=link&utm_source=editor).

> This workshop will take about 60 minutes to design. After that, in a seperate 60 minute session you can order your board for manufacturing using [the OnBoard grant tutorial](https://jams.hackclub.com/jam/onboard-grant).

Printed Circuit Boards - PCBs -  are in nearly all electronics, from phones to cars! It's super easy to make your own, and make them not just functional, but also you can get creative with how they look. 

In this jam, you'll design your own business card -- but with a twist -- it can transmit a URL on tap and light up! You'll learn the basics of designing a PCB, and you can get the cards made for free, with [Hack Club's $100 OnBoard grant](https://hackclub.com/onboard). With these skills, you'll be able to tackle even more complex boards, such as a custom macropad or fidget toy.

## Schematic

The first step is creating a schematic for your PCB design. A schematic shows the components that will be used in the circuit, as well as how each of these components connect to each other. An important thing to note -- a schematic is only a diagram of what connects to what, not where the components are actually placed on the board, so don't worry about placement at this stage!


First, let's open up [EasyEDA](https://easyeda.com), which is a browser-based (and free) PCB design tool. 
It can be a little bit tricky to get used to, so we made a [very short video](https://youtu.be/lEcN3JnTge4).

When you go to the website, you should see a screen like this. Click `Sign Up` to create an account, if you don't already have one.

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/8new-project.png)

Click on the `EasyEDA Designer` button in the Navbar to open up the schematic editor. 

Once you've logged in, select `File` > `New` > `Project` to create a new project.
![](https://cloud-qega55fyl-hack-club-bot.vercel.app/8new-project.png)

This will open up the schematic editor. Some important parts:

- `Library` on the left toolbar: This is where we will search for components and place them into our schematic.
- `Wiring Tools` panel: We'll be using the wire tool to connect the components together.

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/3schematic.png)

## Placing components into the schematic

For our card, we'll want a capacitor, a resistor, a 2V LED and a NFC chip:

- A [NT3H2111W0FHKH](https://jlcpcb.com/partdetail/NxpSemicon-NT3H2111W0FHKH/C710403) NFC Chip: this will be the main component of our card -- it both handles the NFC functionality as well as harvests energy from the phone to light up the LED
- An ~2V LED. I'm using [C2296](https://jlcpcb.com/partdetail/Hubei_KentoElec-17_21SUYCTR8/C2296), but feel free to pick a different color (note: this part may also be called 17-21SUYC/TR8)
- A [47Ω resistor](https://jlcpcb.com/partdetail/23909-0603WAF470JT5E/C23182)
- A [220nF capacitor](https://jlcpcb.com/partdetail/21832-CL10B224KA8NNNC/C21120)

Click the `Library` button to open the parts picker. Search for a part (the part number works best), and make sure `JLCPCB Assembled` is selected. This will make sure we're choosing parts from JLCPCB's parts library, as this is currently Hack Club's Onboard PCB manufacturer. 

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/4searching-for-parts.png)

Select the part, then hit the `Place` button to add it to your schematic. Repeat for all 4 of the parts listed above.

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/9parts-on-schematic.png)

> Note: The EasyEDA parts library may not always be helpful when finding parts for your own future projects, so feel free to search the internet for parts and their codes. You can also create your own parts, but that's a bit more advanced.

### Adding the antenna

The NFC chip needs an antenna to work. We'll be using a PCB trace (a line of copper in the board) as the antenna, so we'll need to add that to our schematic.

Note: this is not an actual part, so it doesn't need to be assembled onto the board -- it's formed by the copper traces on the PCB.

To add the antenna, search for `25X48MM_NFC_ANTENNA` in the Library, and instead of `JLCPCB Assembled`, select `User Contributed`. Select one of the options (check the preview to make sure it looks similar to the one I used here, but most of them should work), and place it on your schematic.

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/5selecting-antenna.png)

## Wiring up the components

Now that all of our components are placed, let's connect them together! Make sure to save your work (command-s or control-s) as you go along.

The `Wire` tool indicates an electrical connection between the different parts -- this is similar to how you would connect wires on a breadboard. On the actual PCB, copper traces will go where we added wires, to form those electrical connections.

We'll reference the NFC Chip's Datasheet (yes, that obscure, horrifyingly detailed document), specifically [this explanation](https://www.nxp.com/docs/en/data-sheet/NT3H2111_2211.pdf#page=38) for creating an energy harvesting circuit.

The datasheet says

> A complete total connected capacitor in the range of typically 150 nF up to 220 nF
> maximum shall be connected between VOUT and GND

So we'll connect the capacitor between `VOUT` and GND (the `VSS` pin).

<video src="https://cloud-bfxdnmxrd-hack-club-bot.vercel.app/1wire-tool.mp4" controls="controls" style={{ maxWidth: "480px" }}></video>

- The pins `LA` and `LB` are for the antenna, so we'll wire up the antenna between those two pins.
- > If NTAG I2C also powers the I2C bus, then VCC must be connected to VOUT

  Since the NFC chip will use the power transmitted from the phone to power the chip itself, we'll connect `VCC` to `VOUT`.

- Finally, to complete the circuit and light up the LED, we'll connect the LED and resistor between `VOUT` and GND (the `VSS` pin).

Your schematic should look something like this when completed:

> Note that your schematic may look a bit different from mine -- that's okay! As long as the connections are the same, it should work. So feel free to experiment with different layouts, maybe keep the antenna on the right or change the position of LEDs and resistors? It's up to you!

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/3completed-schematic.png)

> Friendly reminder to save (`command + s` or `control + s`) your work! You can also click `Project` > `Save Project` to save your schematic. 

# Designing the PCB

Now that the schematic is complete, we can start designing the actual PCB. In this step, we'll place the components onto the board, in the exact shape and configuration that the final board will be. The schematic is our guide to how to connect the components together.

## Converting the schematic to a PCB

To convert the schematic into a PCB design file, click `Design` > `Convert Schematic to PCB`. You may get a warning about unfinished nets -- this is fine, just click "No, Keep Going."

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/5convert-schematic-to-pcb.png)

This will open up the PCB editor, as well as a popup window to specify the board's dimensions. (If the popup window doesn't show up for any reason, you can find it through `Tools` > `Set Board Outline`.)

Here are the dimensions I'll be using, but feel free to make your business card a different size! Bonus: try making your business card a custom shape (not circular or rectangular). You should have the tools to do that by the end of the jam.

- Board Outline: Round Rectangular
- Width: 88.9mm
- Height: 50.8mm
- Radius: 4mm

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/6set-board-outline.png)

## Functionality: Making a working PCB card

Once you set the board outline, you should see something like the image below. There's the outline of the board in pink, a bunch of components in red, and some thin blue lines connecting the components. Let's talk about what these are, and what the colors mean!

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/0pcb-editor.png)

### Layers

A PCB like a sandwich -- it's made up of many different layers. We're designing a 2-layer PCB, which has the following layers:

- The **substrate** is in the middle. This makes up the foundation of the PCB, and is usually made of FR-4 (fiberglass).
- On either side of the substrate are **copper layers** (since this is a 2-layer PCB, there are 2 copper layers: one on top and one on the bottom). In our PCB designer, these are indicated by the `TopLayer` (red) and `BottomLayer` (blue) layers. The copper layers are where electrical connections happen! You should place **traces** (lines that form electrical connections between components) on the `TopLayer` and `BottomLayer`.
- On top of the copper layers are **soldermask** layers. This is what gives PCBs their color -- common soldermask colors are green or black, but white, purple, blue, red, yellow, and more are also possible. Soldermask is added to the entire surface of the board (both the top and the bottom) by default. If you want to **remove** the soldermask (which will reveal the copper underneath), use the `TopSolderMaskLayer` or `BottomSolderMaskLayer` (for the top and bottom of the board, respectively).
- On top of the soldermask layers are **silkscreen** layers. Silkscreen is usually white, and is generally used to label and identify components, but we'll be using it for ✨ PCB art ✨. We can use this to add contact info, a QR code, or even some illustrations to our business card. In EasyEDA, silkscreen is added on the `TopSilkLayer` and `BottomSilkLayer`.

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/1pcb-layers.png)

### Components

You'll notice that the PCB designer already has your components populated on the board. By converting the schematic to a PCB design, EasyEDA automatically places the **footprints** of the components on the board. Try dragging these around! You're able to place them anywhere, but keep in mind that they must be placed within the pink board outline. This is exactly how the components will be placed on the final board.

Some helpful tips:

- You can hit the `R` key to rotate a component 90 degrees.
- The thin blue lines indicate where electrical connections need to be made; so try to rotate components so that the lines do not cross
- Don't worry if the yellow marks cross (that's just silkscreen), but the red parts should not be touching! (That's the copper layer, and if they touch, it will cause a short circuit.)

Drag the components around until you're happy with the placement. Here's what mine looks like, but don't copy it directly; almost anything will work!

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/4components-placed.png)

### Routing traces

Now, we have a bunch of components on the card. If we were to have the card manufactured right now, it wouldn't work -- the components are not connected to each other! We need to add **traces** to connect the components together.

It's best practice to manually route your traces, using the first button in the PCB tools panel: the `Track` tool.

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/2pcb-tools.png)

However, to speed up the jam a bit, we'll be using EasyEDA's auto-router. Select `Route` > `Auto Route...` and click `Run` to watch the magic happen...

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/0auto-router.png)

...Except, it seems like the magical autorouter 🪄 wasn't 100% successful :(. We'll finish up the last bit with some manual routing.

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/1autorouter-results.png)

In my case, the autorouter was able to connect most of the components, but there's still one thin blue line (representing an unrouted connection). Can you find it?

Zooooming in, we see that it's between the antenna loop and pin #8 on the NFC chip. Here's how to route it:

1. Click the `Track` tool in the PCB Tools panel
2. On the right sidebar, set `Routing Conflict` to `Ignore`. This step is generally not needed (for normal manual routing), but there's a small issue with the footprints that makes it necessary here.
3. Click between the two pads that need to be connected. The thin blue line should disappear, and a red trace should connect the two pads.

<video src="https://cloud-bfxdnmxrd-hack-club-bot.vercel.app/0manual-routing.mp4" controls="controls" style={{ maxWidth: "480px" }}></video>

Now, your PCB card is functional. Woooo! 🎉

> [!WARNING]
> Make sure your design has no short circuits

> [!WARNING]
> Ensure your trace length doesn't exceed 40mm at 0.254mm width, or consider increasing the trace thickness to 0.8mm. Use the KiCad Calculator Tool app and in the "Track Width" section, ensure you have a total combined voltage drop of less than 0.3V.
<Dropdown title="Hey, what's a short circuit and how can I prevent it?">  
           Short circuits is a circuits that allow current to travel along an unintended path. 

          Heres a simple example:
          ![](https://cloud-m5qt0nitx-hack-club-bot.vercel.app/0image.png)
          In this circuit, the path of least resistance is the path in red. It flows through the led and the battery, thus the LED will light up

          However, in this circuit:
          ![](https://cloud-abtjpv714-hack-club-bot.vercel.app/0image.png)
          The wires cross paths and make a new path of least resistance, that does not go through the LED. This causes the led to not light up.
        
</Dropdown>
 <Dropdown title="We don't want that! How can I see if I have a short circuit?">  
          The first thing to check for is if you have any traces(wires) that intersect or overlap, such as these 2 examples
          ![](https://cloud-5hfwliwe8-hack-club-bot.vercel.app/0image.png) ![](https://cloud-2hhbo4z62-hack-club-bot.vercel.app/0image.png)
          If you don't see any of these, you should be fine. However, if you want to be extra careful, do a Design Rule Check, by going to Design -> Check DRC
          
          Most of the errors are not actual issues, but if you click through them and find something that unsure of, consider asking around on the #Onboard channel on slack.
</Dropdown>
<Dropdown title="I have a short circuit! How do I get rid of it?">  
  You should check to see if there is a different path the wire could take so it doesn't intersect, kind of like the battery and led example from above. If this is not   possible, then don't worry. This is why our board as multiple layers!

The PCB below has many shorts
![](https://cloud-nggsler3h-hack-club-bot.vercel.app/0image.png)
The solution is to move the wire from the top layer to the bottom layer!
First, select the wire you want to move
![](https://cloud-grp5qt7qm-hack-club-bot.vercel.app/0image.png)
Next, in the top right, select TopLayer, and change it to BottomLayer
![](https://cloud-ny3wmd3c4-hack-club-bot.vercel.app/0image.png)
The wire should turn blue, or another color.

The last step is to change the pads to multilayer. First select the area where the wire and component intersect
![](https://cloud-hzdm59xgm-hack-club-bot.vercel.app/0image.png)

Select top layer, and change it to multilayer
![](https://cloud-k7tdushgc-hack-club-bot.vercel.app/0image.png)

Finnally, repeat for the other pad. 

</Dropdown>

Remember to save your progress! We can check out a preview by clicking the `3D` button in the top toolbar. Hmmm... doesn't look like a business card yet. Let's add some personality to it!

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/2card-preview.png)

## Aesthetics: Personalizing your card

We'll mostly be using the silkscreen layer to add our information and designs. Select the `TopSilkLayer` by clicking the yellow rectangle in the Layers and Objects panel. This will make sure that you're on the silkscreen layer.

### Adding text

In the PCB Tools panel, select the `Text` tool. If you want to make it a business card, you can add your name and contact info -- or add any other text you want. Select the text object you just placed, and change the font, line width, and size in the right sidebar.

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/8text-properties.png)

Drag the text to where you want it on your board. Here, I've added my name, website, and GitHub. If you need ideas: you can add your email, phone number, or other social media handles.

![](https://cloud-lagxcclbp-hack-club-bot.vercel.app/7text-added.png)

### Adding a QR Code

EasyEDA also supports importing images! I'll use this to add a QR Code that links to my website. I used [QRCode Monkey](https://www.qrcode-monkey.com) to generate a QR Code, then use the `File` > `Import` > `Image` option to import it.

Just like Text objects, you can select the image to modify the properties (width, height, etc.) on the right sidebar.

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/6import-image.png)

Note: we've been placing everything on the yellow `TopSilkLayer`. This means that they will all appear on the top side of our board. If you want to add anything to the bottom, use the green `BottomSilkLayer`! Keep in mind that the bottom layers of the board are a top-down, see through view, which is essentially flipped -- use the 3D viewer to check that all your text and images are oriented correctly.

### Bonus: Textures and other effects

Thus far, we've only used silkscreen to add designs and text to our board. The silkscreen will show up white on the manufactured board, but it's also possible to achieve a variety of other effects by combining different layers!

Here are some examples -- try incorporating these techniques into your board.

- **White silkscreen**: this is what we've been using. Add things to the `TopSilkLayer` or `BottomSilkLayer` to achieve this effect.
- **Shiny silver or gold** (depends on the finish selected when ordering): add your object to both the `TopLayer` and `TopSolderMaskLayer` (for the top of the board), or to both `BottomLayer` and `BottomSolderMaskLayer` (for the bottom of the board), and superimpose these layers on top of each other. The `TopLayer` or `BottomLayer` will put the shiny copper on your object, while the `TopSolderMaskLayer` or `BottomSolderMaskLayer` will **remove** the soldermask on the object, revealing the shiny copper underneath.
- **Textured, or with slight color variation**: add your object to only the `TopLayer` or `BottomLayer`. Without removing the soldermask, the copper will still be covered by the soldermask, but it may slightly lighten the soldermask color and will create a textured feel.
- **Translucent yellow** (color of the FR-4 material): add our object to only the `TopSolderMaskLayer` or `BottomSolderMaskLayer`. This will remove the soldermask on the object, revealing the yellow FR-4 material underneath. This technique is useful for allowing LEDs to shine from one side of the board to the other, or just for adding another color to your design.

![](https://cloud-qega55fyl-hack-club-bot.vercel.app/7layer-effects.png)

## Turn your design... into an actual card!

Now that you've got an amazing design, you can actually get your card manufactured and have it in your hands in a few weeks!

Hack Club's [OnBoard grant](https://hackclub.com/onboard/) gives high schoolers $100 to manufacture their own PCB designs, and you can use it to get your own card manufactured.

> If you're in a club or afterschool group that meets for an hour you're probably reaching the end of your meeting around now. Next meeting you can get started with [the OnBoard grant tutorial](https://jams.hackclub.com/jam/onboard-grant) to order your board for manufacturing.

## After receiving your PCB...
Test out your NFC card by flashing a URL to your personal website, or your personal phone number, or even create your own NFC scavenger hunt game by encoding text to NFC.

### Flashing data to NFC
Some NFC RFID readers, such as the ones on iPhones, may have trouble reading or writing the card - this is because the card hasn't been initialized from the factory yet. To initialize the chip, start off by installing an app with the capability to use custom NFC commands, such as [NFC Tools IOS](https://apps.apple.com/us/app/nfc-tools/id1252962749) or [NFC Tools Android](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc&hl=en_CA&pli=1). Then, flash the NFC card with this Advanced NFC command, `A2:03:E1:10:6D:00,A2:04:03:04:D8:00,A2:05:00:00:FE:00` . This will format the chip and allow it to be written to. You can find more information about the flashing process here on [GitHub](https://github.com/Hugoyhu/NTAG-I2C-Eval-Board).
