
async function loadProjects(){
  const listEl = document.querySelector('.gallery');
  const moreBtn = document.getElementById('loadMore');
  const errorEl = document.getElementById('loadError');
  try{
    const res = await fetch('./projects/projects.json?cachebust=' + Date.now());
    if(!res.ok) throw new Error('HTTP '+res.status);
    const projects = await res.json();
    // Sort newest first by date string (yyyy-mm-dd)
    projects.sort((a,b)=> (a.date < b.date ? 1 : -1));
    const pageSize = 5;
    let cursor = 0;
    function render(){
      const slice = projects.slice(cursor, cursor + pageSize);
      slice.forEach(p=>{
        const a = document.createElement('a');
        a.className='card';
        a.href = p.href;
        a.innerHTML = `
          <img src="${p.cover}" alt="${p.title}">
          <div class="content">
            <div class="pills">
              ${p.tags.map(t=>`<span class="pill">${t}</span>`).join('')}
            </div>
            <h3>${p.title}</h3>
            <div class="meta">${p.meta||''}</div>
          </div>`;
        listEl.appendChild(a);
      });
      cursor += slice.length;
      if(cursor >= projects.length) {
        moreBtn.disabled = true;
        moreBtn.textContent = 'All projects loaded';
      }
    }
    render();
    moreBtn.addEventListener('click', render);
  }catch(err){
    console.error(err);
    errorEl.textContent = 'Failed to load projects.';
    errorEl.style.display='block';
  }
}
document.addEventListener('DOMContentLoaded', loadProjects);
