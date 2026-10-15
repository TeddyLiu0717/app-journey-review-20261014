'use strict';
const $ = id => document.getElementById(id);
let catalog, selected, generation=0;
function humanBytes(n) {return (n / 1024 / 1024).toFixed(1) + ' MB';}
function link(url, text) {const a = document.createElement('a'); a.href=url; a.textContent=text; a.className='button secondary'; return a;}
function select(row, play=false) {
  generation++; selected=row; const video=$('player'); video.pause(); video.removeAttribute('src'); video.load();$('load').disabled=false;
  $('title').textContent=row.app_name+' · '+row.title;
  $('meta').textContent=row.duration_label+' · '+row.frames.toLocaleString()+' 帧 · 完整观看版 '+humanBytes(row.view_bytes);
  $('audio').textContent=row.audio_label;
  $('privacy').textContent=row.privacy_note+'。保留原有等待、重试、旋转和录制诊断；文件之间的录制空档没有补造。';
  $('load').textContent='在线播放完整录像'; $('load').hidden=false;
  $('play-status').textContent='点击播放后加载完整文件。网络慢时，可先下载内嵌视频的 HTML，之后直接打开。';
  $('downloads').replaceChildren(link(row.html_url,'下载完整离线 HTML · '+humanBytes(row.html_bytes)),link(row.video_url,'下载完整 MP4'));
  if (row.native_url) $('downloads').append(link(row.native_url,'下载原始 MKV · '+humanBytes(row.source_bytes)));
  else {const p=document.createElement('p');p.textContent='原始 MKV 含账号邮箱，原样保留在本地；此处提供全时长、仅遮盖邮箱的副本。';$('downloads').append(p);}
  $('hashes').textContent='完整 MP4 SHA-256：'+row.view_sha256+'\n原始 MKV SHA-256：'+row.source_sha256;
  $('timing').textContent='源视频帧数与观看版帧数完全一致；逐包核对播放时标，最大量化差异 '+row.max_pts_delta_seconds.toFixed(3)+' 秒；完整解码通过。';
  document.querySelectorAll('.record').forEach(b=>b.setAttribute('aria-current',String(b.dataset.id===row.id)));
  history.replaceState(null,'','#'+row.id);
  if (play) loadVideo();
}
async function loadVideo() {
  const token=generation,video=$('player');$('load').disabled=true;$('play-status').textContent='正在连接完整录像…';
  try {video.src=selected.video_url;await video.play();if(token!==generation)return;$('load').hidden=true;$('play-status').textContent='正在播放完整录制文件，可拖动进度。';}
  catch(error) {if(token===generation)$('play-status').textContent='在线加载暂未完成。可下载下方完整 HTML 或 MP4，下载完成后离线播放。';}
  finally {if(token===generation)$('load').disabled=false;}
}
function render() {
  const app=$('app').value,term=$('search').value.trim().toLocaleLowerCase();
  const rows=catalog.recordings.filter(r=>(!app||r.app===app)&&(!term||(r.app_name+' '+r.title+' '+r.id).toLocaleLowerCase().includes(term)));
  $('list').replaceChildren(...rows.map(row=>{const b=document.createElement('button');b.type='button';b.className='record';b.dataset.id=row.id;b.setAttribute('aria-current',String(selected?.id===row.id));
    const title=document.createElement('strong');title.textContent=row.app_name+' · '+row.title;const meta=document.createElement('small');meta.textContent=row.id+' · '+row.duration_label+(row.privacy_masked?' · 邮箱已遮盖':'');b.append(title,meta);b.addEventListener('click',()=>select(row));return b;}));
  $('count').textContent=rows.length+' 段';
}
$('app').addEventListener('change',render);$('search').addEventListener('input',render);$('load').addEventListener('click',loadVideo);
$('player').addEventListener('error',()=>{$('play-status').textContent='当前网络未能播放。下方完整 HTML 内含视频，下载后打开即可播放。';$('load').hidden=false;});
fetch('full-recordings.json').then(r=>{if(!r.ok)throw Error('catalog');return r.json();}).then(data=>{
  catalog=data;$('total').textContent=data.count;$('hours').textContent=(data.total_seconds/3600).toFixed(1);$('native').textContent=data.native_bytes_unchanged_count;
  const wanted=location.hash.slice(1);select(data.recordings.find(r=>r.id===wanted)||data.recordings[0]);render();
}).catch(()=>{$('play-status').textContent='目录加载失败，请刷新页面。';});
