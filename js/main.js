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
let finalRecording;

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
				replayButton.style.display = 'block';
				break;
		}
	} else {
		switch (mainVideo.src)
		{
			case window.location.origin + '/videos/Intro_edited.mp4':
				messageElement.innerHTML = 'Sarah\'s waiting for your reply. You\'ll need to talk into your device to deliver your message - just like you would on a real video call.<br><br>She\'s waiting and listening, there is no limit on your response. Just think about what you want to say, and deliver it in your own, authentic way.<br><img src="images/phone.png" width="90" height="77" /><b>Select NEXT to speak your reply</b>';
				mainVideo.src = 'videos/Listening loop 2.mp4';
				mainVideo.loop = true;
				mainVideo.play();
				recordFirstButton.style.display = 'block';
				break;
			case window.location.origin + '/videos/Response%201.2.mp4':
				firstRecording = new Blob(recordedBlobs, {type: 'video/webm'});
				messageElement.innerHTML = 'How will you move the conversation on? Think of an open question to ask that will help you better understand Sarah\'s situation.<br><br><img src="images/phone.png" width="90" height="77" /><b>Select NEXT to speak your reply.</b>';
				mainVideo.src = 'videos/Listening loop 2.mp4';
				mainVideo.loop = true;
				mainVideo.play();
				recordSecondButton.style.display = 'block';
				break;
			case window.location.origin + '/videos/Response%202.2.mp4':
				secondRecording = new Blob(recordedBlobs, {type: 'video/webm'});
				messageElement.innerHTML = 'You\'re about to see the conversation again from Sarah\'s perspective.<br><br>Reflect on your responses and think about anything you would do differently next time.'; 
				startReplayButton.style.display = 'block';
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
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'final.webm';
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

const startFirstButton = document.querySelector('button#startFirst');
startFirstButton.style.display = 'none';
startFirstButton.addEventListener('click', () => {
	startFirstButton.style.display = 'none';
	document.querySelector('audio#ringtone').play();
	setTimeout(() => {
		mainVideo.src = 'videos/Intro_edited.mp4';
		mainVideo.play();
	}, 2000);

});

const recordFirstButton = document.querySelector('button#recordFirst');
recordFirstButton.style.display = 'none';
recordFirstButton.addEventListener('click', () => {
	recordFirstButton.style.display = 'none';
	messageElement.innerHTML = '<b>Speak now!</b><br><br>What will you say to Sarah?<br><br>Remember to show Respect in your reply:	<br>&#x2022;	Make her feel comfortable	<br>&#x2022;	Give her your full attention<br><br><b>When you\'re finished recording your response, select END';
	startRecording();
	endFirstButton.style.display = 'block';
});

const endFirstButton = document.querySelector('button#endFirst');
endFirstButton.style.display = 'none';
endFirstButton.addEventListener('click', () => {
	stopRecording();
	messageElement.innerHTML = "";
	endFirstButton.style.display = 'none';
	mainVideo.src = 'videos/Response 1.2.mp4';
	mainVideo.loop = false;
	mainVideo.play();
});

const recordSecondButton = document.querySelector('button#recordSecond');
recordSecondButton.style.display = 'none';
recordSecondButton.addEventListener('click', () => {
	recordSecondButton.style.display = 'none';
	messageElement.innerHTML = '<b>Speak now!</b><br><br>Start to empathise by asking an open question to find out more about Sarah\'s situation<br><br><b>When you\'re finished recording your response, select END.'; 
	startRecording();
	endSecondButton.style.display = 'block';
});

const endSecondButton = document.querySelector('button#endSecond');
endSecondButton.style.display = 'none';
endSecondButton.addEventListener('click', () => {
	stopRecording();
	messageElement.innerHTML = "";
	endSecondButton.style.display = 'none';
	mainVideo.src = 'videos/Response 2.2.mp4';
	mainVideo.loop = false;
	mainVideo.play();
});

const startReplayButton = document.querySelector('button#startReplay');
startReplayButton.style.display = 'none';
startReplayButton.addEventListener('click', () => {
	startReplayButton.style.display = 'none';
	stopStream();
	videoCall.style.display = 'block';
	previewVideo.style.display = 'none';
	playback = true;
	replay();
});

const replayButton = document.querySelector('button#replay');
replayButton.style.display = 'none';
replayButton.addEventListener('click', () => {
	replayButton.style.display = 'none';
	replay();
});

function replay() {
	clip = 0;
	mainVideo.src = 'videos/Intro_edited.mp4';
	mainVideo.play();
}

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
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
	
function stopStream(stream) {
  window.stream.getTracks().forEach(track => track.stop());
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const previewVideo = document.querySelector('video#preview');
  previewVideo.srcObject = stream;
  
  messageElement.innerText = "Sarah, a member of your team has just called you for a chat...";
  start.style.display = 'none';
  startFirstButton.style.display = 'block';
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

videoCallElement.style.display = 'block';
messageElement.innerHTML = '<h2>Lloyds Mental Health PoC</h2><br><br><b>Click Start to begin</b>';