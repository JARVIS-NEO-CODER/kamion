const CATS=['Tech','Déco','Gaming','Digital & Créa'];
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function cartCount(){return JSON.parse(localStorage.getItem('toutic-cart')||'[]').length;}
function updateCartLink(){const l=document.getElementById('cartLink');if(l)l.textContent='Panier ('+cartCount()+')';}
function initials(n){return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}
function productMedia(p){return p.img?'<img src="'+p.img+'" alt="'+p.name+'" loading="lazy">':'<div class="digi">'+initials(p.name)+'</div>';}
async function loadProducts(){
 const res=await fetch('products.json');const items=await res.json();
 const grid=document.getElementById('grid');const chips=document.querySelectorAll('.chip');
 let filter='all';
 function render(){
  grid.innerHTML='';
  items.filter(p=>filter==='all'||p.cat===filter).forEach(p=>{
   const el=document.createElement('article');el.className='pcard';
   el.innerHTML='<div class="ph">'+productMedia(p)+'<span class="badge">'+p.cat+'</span></div>'
    +'<div class="body"><h4>'+p.name+'</h4><p class="desc">'+p.desc+'</p>'
    +'<span class="pill">'+p.status+'</span>'
    +'<div class="row"><span class="price">'+p.price+'</span></div>'
    +'<button class="btn wide" data-buy="'+p.id+'">Je le veux</button></div>';
   grid.appendChild(el);
  });
 }
 chips.forEach(c=>c.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('on'));c.classList.add('on');filter=c.dataset.filter;render();}));
 render();window.__products=items;
}
function openOrderModal(p){
 const m=document.getElementById('modal');if(!m)return;
 m.querySelector('#orderName').textContent=p.name;
 m.querySelector('#orderPrice').textContent=p.price;
 m.querySelector('#orderImg').src=p.img||'';
 m.querySelector('#orderImg').style.display=p.img?'block':'none';
 m.dataset.id=p.id;m.classList.add('open');
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-buy]');
 if(b){const p=(window.__products||[]).find(x=>x.id===b.dataset.buy);if(p)openOrderModal(p);}
 if(e.target.id==='modal'||e.target.id==='closeModal'){const m=document.getElementById('modal');if(m)m.classList.remove('open');}
});
function menuInit(){const btn=document.getElementById('menuBtn');const links=document.getElementById('navlinks');
 if(btn&&links)btn.addEventListener('click',()=>links.classList.toggle('open'));}
menuInit();updateCartLink();
async function orderSubmit(e){
 e.preventDefault();
 const m=document.getElementById('modal');const id=m.dataset.id;
 const name=m.querySelector('#f-prenom').value.trim();const email=m.querySelector('#f-email').value.trim();
 if(!name||!email){toast('Remplis ton prénom et ton email');return;}
 const body=new URLSearchParams(new FormData(e.target)).toString();
 body.set('form-name','commandes');body.set('produit',id);
 try{await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});}catch(err){}
 localStorage.setItem('toutic-cart',JSON.stringify([...JSON.parse(localStorage.getItem('toutic-cart')||'[]'),{id:id,at:Date.now()}]));
 updateCartLink();m.classList.remove('open');e.target.reset();
 toast('Commande envoyée ! On te répond par email.');
}
document.addEventListener('submit',e=>{if(e.target.id==='orderForm')orderSubmit(e);});
