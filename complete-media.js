"use strict";
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-recording-seek]');if(!button)return;
 const video=document.getElementById(button.dataset.video);if(!video)return;
 if(typeof setMode==='function')setMode('visual');
 try{if(video.readyState<1){video.load();await new Promise((resolve,reject)=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',reject,{once:true});});}
 video.currentTime=Number(button.dataset.recordingSeek);video.scrollIntoView({block:'center',behavior:'instant'});await video.play();}
 catch(error){const status=video.closest('.complete-recording').querySelector('[role=status]');status.textContent='视频尚未加载；可点击“下载完整 MP4”保存后播放。';}
});
document.querySelectorAll('video[data-local-recording]').forEach(video=>{
 if(location.protocol==='file:')video.src=video.dataset.localRecording;
 video.addEventListener('error',()=>{if(!video.dataset.remoteTried){video.dataset.remoteTried='1';video.src=video.dataset.remoteRecording;video.load();}});
});
