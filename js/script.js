var canvas;
var context;
var iW = 0; // image width
var iH = 0; // image height
var p1 = 0.99;
var p2 = 0.99;
var p3 = 0.99;
var er = 0; // extra red
var eg = 0; // extra green
var eb = 0; // extra blue
var iBlurRate = 0;
var func = ''; // last used function

window.onload = function() {
    // creating context for original image
    canvasOrig = document.getElementById('orig');
    contextOrig = canvasOrig.getContext('2d');

    // draing original image
    var imgObj = new Image();
    imgObj.onload = function () {
        iW = this.width;
        iH = this.height;
        contextOrig.drawImage(imgObj, 0, 0, iW, iH); // draw the image on the canvas
    }
    imgObj.src = 'images/bad-man.jpg';

    // creating testing context
    canvas = document.getElementById('panel');
    context = canvas.getContext('2d');
};

// Filters functions

function Color() {
    func = 'color'; // last used function
    var imgd = contextOrig.getImageData(0, 0, iW, iH);
    var data = imgd.data;

    for (var i = 0, n = data.length; i < n; i += 4) {
        data[i]   = data[i]*p1+er; // red
        data[i+1] = data[i+1]*p2+eg; // green
        data[i+2] = data[i+2]*p3+eb; // blue
    }
    context.putImageData(imgd, 0, 0);
}

function Invert(vContext) {
    func = 'color'; // last used function
    var imgd = vContext.getImageData(0, 0, iW, iH);
    var data = imgd.data;

    for (var i = 0, n = data.length; i < n; i += 4) {

        // assigning inverted colors to our data
        data[i] = 255 - data[i]; // red
        data[i+1] = 255 - data[i+1]; // green
        data[i+2] = 255 - data[i+2]; // blue
    }

    // put image date back to context
    vContext.putImageData(imgd, 0, 0);
}


function contrastImage(vContext, contrast) {
	contrast = 100;
	var imgd = vContext.getImageData(0, 0, iW, iH);
    var data = imgd.data;
    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for(var i=0;i<data.length;i+=4)
    {
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
    }
    vContext.putImageData(imgd, 0, 0);
}



function contrastImages(vContext) {
	var imgData = vContext.getImageData(0, 0, iW, iH);
	var min=255, max=0;
	var intens=[];
	var j=0;
	var data = imgData.data;
	for (var i=0;i<data.length;i+=4) {
		intens[j] = (data[i]+data[i+1]+data[i+2])/3;
		if (intens[j]>max)
			max=intens[j];
		else if (intens[j]<min)
			min=intens[j];
		
		//imgData.data[i+3]=255;
		j++;
	}
	console.log('max'+max);
	console.log('min'+min);
	var x;
	for (var j=0;j<intens.length;j++){
		x=(intens[j]-min)/(max-min);
		data[j*4]*=x;
		data[j*4+1]*=x;
		data[j*4+2]*=x;
		//data[j*4+3]=255;
	}
	vContext.putImageData(imgData,0,0);
}



// Adjustment functions

function resetToColor() {
    p1 = 1;
    p2 = 1;
    p3 = 1;
    er = eg = eb = 0;
    iBlurRate = 0;

    Color();
}

function resetToInvert() {
    p1 = 1;
    p2 = 1;
    p3 = 1;
    er = eg = eb = 0;
    iBlurRate = 1;

    if (func == '') Color();
    Invert(context);
    //Invert(contextOrig);
}


function resetToContrastStretching() {
    p1 = 1;
    p2 = 1;
    p3 = 1;
    er = eg = eb = 0;
    iBlurRate = 1;

    if (func == '') Color();
    contrastImage(context);
    //Invert(contextOrig);
}


function resetToContrastStretching_s() {
    p1 = 1;
    p2 = 1;
    p3 = 1;
    er = eg = eb = 0;
    iBlurRate = 1;

    if (func == '') Color();
    contrastImages(context);
    //Invert(contextOrig);
}
