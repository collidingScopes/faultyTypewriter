/* To do list:
Pause/play animation button?
Set starting canvas width / height based on user device dimensions
Toggle for transparent background / gradient / image background
Toggle for whole word break instead of letter break?
User control for where to start the first letter -- X/Y padding
Randomize inputs function
Gif export
Add other fonts from google fonts
Font for different languages?
site OG properties
About section / link section
Better formatting for text input (larger and more visible)
Better hotkey method (user will be typing alot)
Set default font size at startup, depending on screen size
Name: faulty typewriter
Fix mobile record function (conform to the standard muxer function)
Movie posters / famous quotes -- Blade Runner, wong kar wai, etc.
*/

var animation = document.getElementById("animation");

var canvasWidthInput = document.getElementById("canvasWidthInput");
canvasWidthInput.addEventListener("change",refresh);
var canvasWidth;

var canvasHeightInput = document.getElementById("canvasHeightInput");
canvasHeightInput.addEventListener("change",refresh);
var canvasHeight;

var animationfps=45;
var animationInterval;
var playAnimationToggle = false;
var xPadding = 20; //padding from the origin point, in pixels
var yPadding = 5;

var textInput = document.getElementById("textInput");
textInput.addEventListener("change",refresh);
var text;

var colorInput = document.getElementById("colorInput");
colorInput.addEventListener("change",refresh);
var color;

var backgroundChoiceInput = document.getElementById("backgroundChoiceInput");
backgroundChoiceInput.addEventListener("change",refresh);
var backgroundChoice;

var backgroundColorInput = document.getElementById("backgroundColorInput");
backgroundColorInput.addEventListener("change",refresh);
var backgroundColor;

var fontSizeInput = document.getElementById("fontSizeInput");
fontSizeInput.addEventListener("change",refresh);
var fontSize;

var speedInput = document.getElementById("speedInput");
speedInput.addEventListener("change",refresh);
var speed;

var wavyInput = document.getElementById("wavyInput");
wavyInput.addEventListener("change",refresh);
var wavyFactor;

var colorRangeInput = document.getElementById("colorRangeInput");
colorRangeInput.addEventListener("change",refresh);
var colorRange;

var lineWidthInput = document.getElementById("lineWidthInput");
lineWidthInput.addEventListener("change",refresh);
var lineWidth;

var opacityInput = document.getElementById("opacityInput");
opacityInput.addEventListener("change",refresh);
var opacity;

var fontInput = document.getElementById("fontInput");
fontInput.addEventListener("change",refresh);
var font;

var randomXDeltaInput = document.getElementById("randomXDeltaInput");
randomXDeltaInput.addEventListener("change",refresh);
var randomXDelta;

var randomYDeltaInput = document.getElementById("randomYDeltaInput");
randomYDeltaInput.addEventListener("change",refresh);
var randomYDelta;

var randomRotationInput = document.getElementById("randomRotationInput");
randomRotationInput.addEventListener("change",refresh);
var randomRotation;

var fillCheckbox = document.getElementById('fillCheckbox');
fillCheckbox.addEventListener('click', refresh);
var fillLetterToggle = false;

/*
var drawButton = document.getElementById("drawButton");
drawButton.addEventListener("click",refresh);
*/

var initialXOffset = xPadding;
var x;
var initialYOffset = yPadding;
var y;
var initialDashLen;

var ctx = animation.getContext("2d");
ctx.lineJoin = "round";

var originalImg = document.getElementById("originalImg");
var imageFileInput = document.getElementById('imageFileInput');
imageFileInput.addEventListener('change', readSourceImage);
var isImageLoaded = false;
var imageContainer = document.getElementById('imageContainer');

var backgroundColorInputCell = document.getElementById('backgroundColorInputCell');
var imageInputCell = document.getElementById('imageInputCell');
var videoInputCell = document.getElementById('videoInputCell');

var actualWidth = 1536; //dimensions of default image
var actualHeight = 1536;

var scaledWidth = actualWidth;
var scaledHeight = actualHeight;
var widthScalingRatio = 1;
var maxImageWidth = Math.min(window.innerWidth,4000); //can be tweaked

//detect user browser
var ua = navigator.userAgent;
var isSafari = false;
var isFirefox = false;
var isIOS = false;
var isAndroid = false;
if(ua.includes("Safari")){
    isSafari = true;
}
if(ua.includes("Firefox")){
    isFirefox = true;
}
if(ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")){
    isIOS = true;
}
if(ua.includes("Android")){
    isAndroid = true;
}
console.log("isSafari: "+isSafari+", isFirefox: "+isFirefox+", isIOS: "+isIOS+", isAndroid: "+isAndroid);

//save image button
var saveImageButton = document.getElementById("saveImageButton");
saveImageButton.addEventListener('click', saveImage);

//video recording function
var recordBtn = document.getElementById("recordVideoButton");
var recording = false;
var mediaRecorder;
var recordedChunks;
recordBtn.addEventListener('click', chooseRecordingFunction);
var finishedBlob;
var recordingMessageDiv = document.getElementById("videoRecordingMessageDiv");
var recordVideoState = false;
var videoRecordInterval;
var videoEncoder;
var muxer;

var mobileRecorder;

var videofps = 15;

/*
//randomize inputs button
var randomizeButton = document.getElementById("randomizeButton");
randomizeButton.addEventListener('click', randomizeInputs);
*/

function getUserInputs(){
    
    canvasWidth = Number(canvasWidthInput.value);
    canvasHeight = Number(canvasHeightInput.value);
    console.log("Canvas width / height: "+canvasWidth+", "+canvasHeight);
    animation.width = canvasWidth;
    animation.height = canvasHeight;
    
    text = String(textInput.value);
    console.log("User text: "+text);

    color = String(colorInput.value);
    
    backgroundChoice = String(backgroundChoiceInput.value) 
    backgroundColor = String(backgroundColorInput.value);

    //set background color of the canvas
    if(backgroundChoice == "solid"){
        ctx.globalAlpha = 1;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0,0,canvasWidth, canvasHeight);

        backgroundColorInputCell.classList.remove("hidden");
        imageInputCell.classList.add("hidden");
        videoInputCell.classList.add("hidden");

    } else if(backgroundChoice == "transparent"){
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0,0,canvasWidth, canvasHeight);

        backgroundColorInputCell.classList.add("hidden");
        imageInputCell.classList.add("hidden");
        videoInputCell.classList.add("hidden");

    } else if(backgroundChoice == "image"){
        ctx.drawImage(originalImg, 0, 0, canvasWidth, canvasHeight);

        backgroundColorInputCell.classList.add("hidden");
        imageInputCell.classList.remove("hidden");
        videoInputCell.classList.add("hidden");

    } else if(backgroundChoice == "video"){
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0,0,canvasWidth, canvasHeight);

        backgroundColorInputCell.classList.add("hidden");
        imageInputCell.classList.add("hidden");
        videoInputCell.classList.remove("hidden");

    }

    ctx.strokeStyle = ctx.fillStyle = color;
    lineWidth = Number(lineWidthInput.value);
    ctx.lineWidth = lineWidth;
    opacity = Number(opacityInput.value);
    ctx.globalAlpha = opacity/100;

    font = String(fontInput.value);
    fontSize = Number(fontSizeInput.value)
    ctx.font = fontSize+"px "+font;
    
    initialDashLen = fontSize * 4;
    speed = Number(speedInput.value)/100 * initialDashLen/1.5;

    wavyFactor = Number(wavyInput.value);
    colorRange = Number(colorRangeInput.value);

    randomXDelta = Number(randomXDeltaInput.value);
    randomYDelta = Number(randomYDeltaInput.value) / 2;
    randomRotation = Number(randomRotationInput.value) / 200;

    if(fillCheckbox.checked){
        fillLetterToggle = true;
    } else{
        fillLetterToggle = false;
    }
}

function refresh(){
    console.log("refresh");
    if(playAnimationToggle == true){
        clearInterval(animationInterval); //stop animation
        playAnimationToggle = false;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); //clear entire canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);  
    ctx.rotate(0);
    getUserInputs();
    setTimeout(drawText,300);
}

//MAIN METHOD
canvasWidthInput.value = window.innerWidth;
canvasHeightInput.value = window.innerHeight/2;
setTimeout(getUserInputs,200);
setTimeout(drawText,1800); //wait for fonts to load

function drawText(){

    if(playAnimationToggle == true){
        clearInterval(animationInterval);
        playAnimationToggle = false;
    }

    playAnimationToggle = true;
    dashLen = initialDashLen, dashOffset = dashLen, x = initialXOffset, i = 0;

    let metrics = ctx.measureText(text);
    let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    var textWidth = metrics.width;
    console.log("textWidth: "+textWidth+", textHeight: "+textHeight);

    initialYOffset = textHeight+yPadding;
    y = initialYOffset;
    var rowCounter=1;
    var middleYPosition = initialYOffset;

    animationInterval = setInterval(loop,1000/animationfps); //start loop
        
    function loop(){
        
        if(!playAnimationToggle){
            return;
        }

        var ch = text[i];
        var chWidth = ctx.measureText(ch).width;

        var sineShift = Math.sin((x/canvasWidth)*Math.PI*2) * wavyFactor;
        y = middleYPosition + sineShift;

        //create line break and tweak color if next char will spill over the right or top
        if(x + chWidth > canvasWidth || y < 0){
            x = initialXOffset;
            rowCounter++;
            middleYPosition = (textHeight+ctx.lineWidth)*1.1*rowCounter + yPadding;
            tweakCanvasColor();
            //y += (textHeight+ctx.lineWidth)*1.1;
        }

        ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
        dashOffset -= speed;                                       // reduce dash length
        ctx.strokeText(ch, x, y);                 // stroke letter

        if (dashOffset <= 0){ //once letter stroke is finished

          if(fillLetterToggle){
            ctx.fillText(ch, x, y);    // fill final letter
        }
          var posOrNeg;
          if(Math.random()<0.5){
            posOrNeg = -1;
          }else{
            posOrNeg = 1;
          }
          x += chWidth + ctx.lineWidth + (randomXDelta * Math.random())*posOrNeg; //random x-delta
          i++;
          ch = text[i];
          ctx.setTransform(1, 0, 0, 1, 0, Math.random() * randomYDelta);        // random y-delta
          ctx.rotate(Math.random() * randomRotation);                         // random rotation
          
          if((ch == ' ') || (ch == '\t') || (ch == '\n')){
            dashOffset = dashLen/2;   //small pause if whitespace
          } else {
            dashOffset = dashLen;   // prep next char
          }
          
          //stop animation
          if (i >= text.length || y > (canvasHeight*1.1)){
            console.log("stop animation");
            clearInterval(animationInterval);
            playAnimationToggle = false;

            if(recordVideoState == true){
                console.log("stop video record");
                setTimeout(chooseEndRecordingFunction,5000);
            }
          }

        }
    }
}

//HELPER FUNCTIONS BELOW

//read and accept user input image
function readSourceImage(){

    //remove any existing images
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    if(playAnimationToggle == true){
        clearInterval(animationInterval);
        playAnimationToggle = false;
    }
        
    //read image file      
    var file = imageFileInput.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
        var imageData = event.target.result;
        var image = new Image();
        image.src = imageData;
        image.onload = () => {
          
            actualWidth = image.width;
            actualHeight = image.height;

            //image scaling
            if(actualWidth > maxImageWidth){
                scaledWidth = maxImageWidth;
                widthScalingRatio = scaledWidth / actualWidth;
                scaledHeight = actualHeight * widthScalingRatio;
            } else{
                scaledWidth = actualWidth;
                widthScalingRatio = 1;
                scaledHeight = actualHeight;
            }

            canvasWidthInput.value = scaledWidth;
            canvasHeightInput.value = scaledHeight;

            //resize the src variable of the original image
            var newCanvas = document.createElement('canvas');
            newCanvas.width = Math.floor(scaledWidth/2)*2; //video encoder doesn't accept odd numbers
            newCanvas.height = Math.floor(scaledHeight/8)*8; //video encoder wants a multiple of 8
            var ctx = newCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
        
            var resizedImgSrc = newCanvas.toDataURL();
    
            //draw the resized image onto the page
            originalImg = document.createElement('img');
            originalImg.setAttribute("id", "originalImg");
            originalImg.src = resizedImgSrc;
            originalImg.width = scaledWidth;
            originalImg.height = scaledHeight;
            imageContainer.appendChild(originalImg);

            setTimeout(refresh,1000);
            animation.scrollIntoView({ behavior: "smooth" });
   
        };
    };
      
    reader.readAsDataURL(file);
    isImageLoaded = true;
    
}

videoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    video.src = url;
    video.addEventListener('loadedmetadata', () => {
        video.width = video.videoWidth;
        video.height = video.videoHeight;
    });
    
    setTimeout(function(){
        video.play();
        canvasWidthInput.value = video.videoWidth;
        canvasHeightInput.value = video.videoHeight;
        refresh();
    },2000);

});

function saveImage(){
    const link = document.createElement('a');
    link.href = animation.toDataURL();

    const date = new Date();
    const filename = `typewriter_${date.toLocaleDateString()}_${date.toLocaleTimeString()}.png`;
    link.download = filename;
    link.click();
}

function tweakCanvasColor(){
    var currentHex = ctx.fillStyle;
    console.log("current color: "+currentHex);
    var currentRGB = hexToRgb(currentHex);
    var newR = currentRGB.r - colorRange/2 + Math.random()*colorRange;
    var newG = currentRGB.g - colorRange/2 + Math.random()*colorRange;
    var newB = currentRGB.b - colorRange/2 + Math.random()*colorRange;

    var newHex = rgbToHex(newR, newG, newB);
    ctx.fillStyle = newHex;
    ctx.strokeStyle = newHex;
    console.log("new color: "+newHex);

}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}


//shortcut hotkey presses
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        refresh();
    }
    /*
    else if (event.key === 's') {
        saveImage();
    }  else if (event.key === 'r') {
        chooseRecordingFunction();
    }  else if (event.key === 'i') {
        randomizeInputs();
    }
    */
});


function chooseRecordingFunction(){
    if(isIOS || isAndroid || isFirefox){
        startMobileRecording();
    }else {
        recordVideoMuxer();
    }
}

function chooseEndRecordingFunction(){
    if(isIOS || isAndroid || isFirefox){
        finalizeMobileVideo();
    }else {
        finalizeVideo();
    }  
}

//record html canvas element and export as mp4 video
//source: https://devtails.xyz/adam/how-to-save-html-canvas-to-mp4-using-web-codecs-api
async function recordVideoMuxer() {
    console.log("start muxer video recording");
    var videoWidth = Math.floor(animation.width/2)*2;
    var videoHeight = Math.floor(animation.height/8)*8; //force a number which is divisible by 8
    console.log("Video dimensions: "+videoWidth+", "+videoHeight);

    //display user message
    //recordingMessageCountdown(videoDuration);
    recordingMessageDiv.classList.remove("hidden");

    recordVideoState = true;
    const ctx = animation.getContext("2d", {
      // This forces the use of a software (instead of hardware accelerated) 2D canvas
      // This isn't necessary, but produces quicker results
      willReadFrequently: true,
      // Desynchronizes the canvas paint cycle from the event loop
      // Should be less necessary with OffscreenCanvas, but with a real canvas you will want this
      desynchronized: true,
    });
  
    muxer = new Mp4Muxer.Muxer({
      target: new Mp4Muxer.ArrayBufferTarget(),
    //let muxer = new Muxer({
        //target: new ArrayBufferTarget(),
        video: {
            // If you change this, make sure to change the VideoEncoder codec as well
            codec: "avc",
            width: videoWidth,
            height: videoHeight,
        },
  
      // mp4-muxer docs claim you should always use this with ArrayBufferTarget
      fastStart: "in-memory",
    });
  
    videoEncoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => console.error(e),
    });
  
    // This codec should work in most browsers
    // See https://dmnsgn.github.io/media-codecs for list of codecs and see if your browser supports
    videoEncoder.configure({
      codec: "avc1.42003e",
      width: videoWidth,
      height: videoHeight,
      bitrate: 10_000_000,
      bitrateMode: "constant",
    });
    //NEW codec: "avc1.42003e",
    //ORIGINAL codec: "avc1.42001f",

    recordVideoState = true;
    var frameNumber = 0;
    //setTimeout(finalizeVideo,1000*videoDuration+200); //finish and export video after x seconds
    
    refresh();

    //take a snapshot of the canvas every x miliseconds and encode to video
    videoRecordInterval = setInterval(
        function(){
            if(recordVideoState == true){
                renderCanvasToVideoFrameAndEncode({
                    animation,
                    videoEncoder,
                    frameNumber,
                    videofps
                })
                frameNumber++;
            }else{
            }
        } , 1000/videofps);

}

//finish and export video
async function finalizeVideo(){
    console.log("finalize muxer video");
    recordVideoState = false;
    clearInterval(videoRecordInterval);
    // Forces all pending encodes to complete
    await videoEncoder.flush();
    muxer.finalize();
    let buffer = muxer.target.buffer;
    finishedBlob = new Blob([buffer]); 
    downloadBlob(new Blob([buffer]));

    
    //hide user message
    recordingMessageDiv.classList.add("hidden");
    
}
  
async function renderCanvasToVideoFrameAndEncode({
    canvas,
    videoEncoder,
    frameNumber,
    videofps,
}) {
    let frame = new VideoFrame(animation, {
        // Equally spaces frames out depending on frames per second
        timestamp: (frameNumber * 1e6) / videofps,
    });

    // The encode() method of the VideoEncoder interface asynchronously encodes a VideoFrame
    videoEncoder.encode(frame);

    // The close() method of the VideoFrame interface clears all states and releases the reference to the media resource.
    frame.close();
}

function downloadBlob() {
    console.log("download video");
    let url = window.URL.createObjectURL(finishedBlob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    const date = new Date();
    const filename = `typwriter_${date.toLocaleDateString()}_${date.toLocaleTimeString()}.mp4`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

//record and download videos on mobile devices
function startMobileRecording(){
    
    var stream = animation.captureStream(videofps);
    mobileRecorder = new MediaRecorder(stream, { 'type': 'video/mp4' });
    //mobileRecorder.addEventListener('dataavailable', finishMobileRecording);

    console.log("start simple video recording");
    console.log("Video dimensions: "+animation.width+", "+animation.height);

    
    //display user message
    //recordingMessageCountdown(videoDuration);
    recordingMessageDiv.classList.remove("hidden");
    
    mobileRecorder.start();

    /*
    setTimeout(function() {
        recorder.stop();
    }, 1000*videoDuration+200);
    */
}

function finalizeMobileVideo(e) {
    setTimeout(function(){
        console.log("finish simple video recording");
        mobileRecorder.stop();
        var videoData = [ e.data ];
        finishedBlob = new Blob(videoData, { 'type': 'video/mp4' });
        downloadBlob(finishedBlob);
        
        //hide user message
        recordingMessageDiv.classList.add("hidden");

    },500);

}

//finish and export video
async function finalizeVideo(){
    console.log("finalize muxer video");
    recordVideoState = false;
    clearInterval(videoRecordInterval);
    // Forces all pending encodes to complete
    await videoEncoder.flush();
    muxer.finalize();
    let buffer = muxer.target.buffer;
    finishedBlob = new Blob([buffer]); 
    downloadBlob(new Blob([buffer]));

    
    //hide user message
    recordingMessageDiv.classList.add("hidden");
    
}

function recordingMessageCountdown(duration){

    /*
    var secondsLeft = Math.ceil(duration);

    var countdownInterval = setInterval(function(){
        secondsLeft--;
        recordingMessageDiv.innerHTML = 
        "Video recording underway. The video will be saved to your downloads folder in <span id=\"secondsLeft\">"+secondsLeft+"</span> seconds.<br><br>This feature can be a bit buggy on Mobile -- if it doesn't work, please try on Desktop instead.";  
        
        if(secondsLeft <= 0){
            console.log("clear countdown interval");
            clearInterval(countdownInterval);
        }
    },1000);
    */
    
}

/*
function randomizeInputs(){
    speedInput.value = Math.ceil(Math.pow(Math.random(),2)*100);
    xFreqInput.value = Math.ceil(Math.random()*50);
    yFreqInput.value = Math.ceil(Math.random()*50);
    xAmpInput.value = Math.ceil(Math.random()*100);
    yAmpInput.value = Math.ceil(Math.random()*100);

    getUserInputs();
}
*/

/*
//ORIGINAL ANIMATION ALGORITHM
//SOURCE: https://stackoverflow.com/questions/29911143/how-can-i-animate-the-drawing-of-text-on-a-web-page

function drawText(){
  //ctx.clearRect(x, 0, 60, 150);
  ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
  dashOffset -= speed;                                       // reduce dash length
  ctx.strokeText(text[i], x, initialYOffset);                 // stroke letter

  if (dashOffset > 0){
    requestAnimationFrame(drawText);             // animate
  } else {
    ctx.fillText(text[i], x, initialYOffset);    // fill final letter
    dashOffset = dashLen;
    i++;                                      // prep next char
    x += ctx.measureText(text[i]).width + ctx.lineWidth * Math.random();
    ctx.setTransform(1, 0, 0, 1, 0, Math.random() * randomYDelta);        // random y-delta
    ctx.rotate(Math.random() * randomRotation);                         // random rotation
    
    if (i < text.length){
        requestAnimationFrame(drawText);
    }
  }
}
*/