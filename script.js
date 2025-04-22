/* один источник видео — много «клонов»; object‑position‑Y = центр полосы относительно контейнера */

document.addEventListener('DOMContentLoaded', () => {
    const SRC  = 'video.mp4';
    const bars = [...document.querySelectorAll('.bar')];
    const vids = [];
  
    /* 1. вставляем <video> в каждую щель */
    bars.forEach(bar => {
      const v = document.createElement('video');
      Object.assign(v,{
        src:SRC, autoplay:true, muted:true, loop:true,
        playsInline:true, preload:'auto'
      });
      bar.appendChild(v);
      vids.push(v);
    });
  
    /* 2. рассчитываем object‑position: X всегда 50 %, Y зависит от строки */
    function updatePositions(){
      const frame = document.querySelector('.headline').getBoundingClientRect();
      const fh    = frame.height;
  
      bars.forEach(bar=>{
        const {top,height} = bar.getBoundingClientRect();
        const cy = top + height/2 - frame.top;     // расстояние от начала контейнера
        const py = (cy / fh) * 100;                // 0‒100 %
        bar.firstElementChild.style.objectPosition = `50% ${py}%`;
      });
    }
    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions, {passive:true});
  
    /* 3. синхронизация воспроизведения */
    const master = vids[0];
    master.addEventListener('canplay',()=>{
      vids.slice(1).forEach(v=>{v.currentTime = master.currentTime; v.play();});
    });
    setInterval(()=>{
      const t = master.currentTime;
      vids.forEach(v=>{
        if(Math.abs(v.currentTime - t) > 0.07) v.currentTime = t;
      });
    },500);
  
    /* 4. запасной автоплей (для iOS / строгих настроек) */
    const unlock = ()=>{ vids.forEach(v=>v.play()); document.removeEventListener('click',unlock); };
    document.addEventListener('click',unlock,{once:true});
  });
  