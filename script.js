var progress = null;
var download = true;
var downloadSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16">
    <path id="download" stroke="transparent" fill="transparent" stroke-width=".5px" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
  </svg>
`;

function $(str){
  return document.querySelector(str);
}
function auto(){
  $('.main').style.pointerEvents = 'auto';
}
function none(){
  $('.main').style.pointerEvents = 'none';
}
function width(target, size, easing, time, fn){
  anime({
    targets: target,
    width: size,
    easing: (easing || 'easeOutElastic(1, .5)'),
    duration: (time || 1000),
    complete: (fn || function(){})
  });
}
function opacity(target, num, delay, fn){
  anime({
    targets: target,
    opacity: num,
    duration: 250,
    delay: (delay || 0),
    easing: 'linear',
    complete: (fn || function(){})
  });
}
function svgStrokeAnim(target, delay){
  $(target).setAttribute('stroke', 'white');
  anime({
    targets: target,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutCubic',
    delay: (delay || 0),
    complete: function(){
      $(target).setAttribute("fill","white");
      auto();
    }
  });
}
function ready(){
  none();
  $('#btn').innerHTML = downloadSvg;
  opacity('.main', 1, 250);
  svgStrokeAnim('#download', 500);
}
function downloadBtnClick(){
  width('.info', 80);
  opacity('#btn', 0, null, function(){
    $('#btn').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16">
        <path id="cancel" stroke="transparent" fill="transparent" stroke-width=".5px" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
      </svg>
    `;
    $('#btn').style.opacity = 1;
    svgStrokeAnim('#cancel');
  });
  $('.text').innerText = '0%';
  opacity('.text', [0,1], 500, function(){
    progress = anime({
      targets: '.progress',
      height: 80,
      easing: 'linear',
      duration: 2000,
      update: function(){
        $('.text').innerText = Math.round(this.progress)+'%';
      },
      complete: function(){
        none();
        width('.actions', 0, 'easeInOutCubic', 500);
        opacity('.text', 0, null, function(){
          $('.text').innerHTML = `
            <svg id="check-svg" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16">
              <path id="check" stroke="transparent" stroke-width=".5px" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
            </svg>
          `;
          $('.text').style.opacity = 1;
          svgStrokeAnim('#check');
          setTimeout(function(){
            none();
            progress = null;
            download = true;
            $('#btn').innerHTML = downloadSvg;
            opacity('#check-svg', 0, null, function(){
              width('.actions', 80, 'easeInOutCubic', 500);
              width('.info', 0, 'easeInOutCubic', 500, function(){
                $('.progress').style.height = 0;
              });
              svgStrokeAnim('#download', 500);
            });
          }, 2000);
        });
      }
    });
  });
}
function cancelBtnClick(){
  progress.pause();
  progress = null;
  width('.info', 0, 'easeInOutCubic', 500, function(){
    $('.progress').style.height = 0;
  });
  opacity('#btn', 0, null, function(){
    $('#btn').innerHTML = downloadSvg;
    $('#btn').style.opacity = 1;
    svgStrokeAnim('#download');
  });
}
function btnClick(){
  none();
  if(download){
    downloadBtnClick();
    download = false;
  }else{
    cancelBtnClick();
    download = true;
  }
}

if(document.addEventListener){
  document.addEventListener('readystatechange', function readyFn(){
    document.removeEventListener('readystatechange', readyFn);
    ready();
  });
  $('#btn').addEventListener('click', btnClick);
}else if(document.attachEvent){
  document.attachEvent('onreadystatechange', function readyFn(){
    document.detachEvent('onreadystatechange', readyFn);
    ready();
  });
  $('#btn').attachEvent('onclick', btnClick);
}else{
  ready();
  $('#btn').onclick = btnClick;
}