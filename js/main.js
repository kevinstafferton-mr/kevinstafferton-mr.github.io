/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;
let firstRecording;
let secondRecording;

let playback = false;
let clip = 0;

const messageElement = document.querySelector('span#instruction');
const errorMsgElement = document.querySelector('span#errorMsg');
const videoCallElement = document.querySelector("div#videoCall");
const mainVideo = document.querySelector('video#main');
mainVideo.addEventListener('ended', () => {
	if (playback)
	{
		switch (clip)
		{
			case 0:
				mainVideo.src = window.URL.createObjectURL(firstRecording);
				mainVideo.play();
				clip++;
				break;
			case 1:
				mainVideo.src = 'videos/Response 1.2.mp4';
				mainVideo.play();
				clip++;
				break;
			case 2:
				mainVideo.src = window.URL.createObjectURL(secondRecording);
				mainVideo.play();
				clip++
				break;
			case 3:
				mainVideo.src = 'videos/Response 2.2.mp4';
				mainVideo.play();
				clip++;
				break;
			default:
				download.style.display = 'block';
				downloadButton.disabled = false;
				break;
		}
	} else {
		switch (mainVideo.src)
		{
			case window.location.origin + '/videos/Intro_edited.mp4':
				mainVideo.src = 'videos/Listening loop 2.mp4';
				mainVideo.loop = true;
				mainVideo.play();
				startRecording();
				endFirstButton.style.display = 'block';
				break;
			case window.location.origin + '/videos/Response%201.2.mp4':
				firstRecording = new Blob(recordedBlobs, {type: 'video/webm'});
				messageElement.innerText = "Start to empathise by asking an open question to find out more about Sarah's situation"; 
				startRecording();
				mainVideo.src = 'videos/Listening loop 2.mp4';
				mainVideo.loop = true;
				mainVideo.play();
				endSecondButton.style.display = 'block';
				break;
			case window.location.origin + '/videos/Response%202.2.mp4':
				secondRecording = new Blob(recordedBlobs, {type: 'video/webm'});
				videoCall.style.display = 'none';
				messageElement.innerText = 'You\'re about to see the conversation again from Sarah\'s perspective.\r\rReflect on your responses and think about anything you would do differently next time.'; 
				setTimeout(() => {
					replay();
				}, 10000);
				break;
		}
	}
});

const previewVideo = document.querySelector('video#preview');

videoCallElement.style.display = 'none';

const recordButton = document.querySelector('button#record');
recordButton.style.display = 'none';
recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
	saveButton.disabled = false;
  }
});

const playButton = document.querySelector('button#play');
playButton.style.display = 'none';
playButton.addEventListener('click', () => {
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  previewVideo.src = null;
  previewVideo.srcObject = null;
  previewVideo.src = window.URL.createObjectURL(superBuffer);
  previewVideo.controls = true;
  previewVideo.play();
});

const downloadButton = document.querySelector('button#download');
downloadButton.style.display = 'none';
downloadButton.addEventListener('click', () => {
  const blob = new Blob([], {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

const saveButton = document.querySelector('button#save');
saveButton.style.display = 'none';
saveButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
});

const endFirstButton = document.querySelector('button#endFirst');
endFirstButton.style.display = 'none';
endFirstButton.addEventListener('click', () => {
	stopRecording();
	endFirstButton.style.display = 'none';
	mainVideo.src = 'videos/Response 1.2.mp4';
	mainVideo.loop = false;
	mainVideo.play();
});

const endSecondButton = document.querySelector('button#endSecond');
endSecondButton.style.display = 'none';
endSecondButton.addEventListener('click', () => {
	stopRecording();
	endSecondButton.style.display = 'none';
	mainVideo.src = 'videos/Response 2.2.mp4';
	mainVideo.loop = false;
	mainVideo.play();
});

function replay() {
	messageElement.innerText = '';
	videoCall.style.display = 'block';
	previewVideo.style.display = 'none';
	playback = true;
	clip = 0;
	mainVideo.src = 'videos/Intro_edited.mp4';
	mainVideo.controls = true;
	mainVideo.play();
}

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startStageOne() {
	messageElement.innerText = "Sarah, a member of your team has just called you for a chat...";
	start.style.display = 'none';
	setTimeout(() => {
		messageElement.innerText = "";
		videoCallElement.style.display = "block";
		mainVideo.src = 'videos/Intro_edited.mp4';
		mainVideo.play();
	}, 10000);
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = {mimeType: 'video/webm;codecs=vp8,opus'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: ''};
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const previewVideo = document.querySelector('video#preview');
  previewVideo.srcObject = stream;
  
  startStageOne();

}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  const constraints = {
    audio: { },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
});

