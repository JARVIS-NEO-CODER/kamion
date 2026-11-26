const CATS=['Tech','Déco','Gaming','Mode','Digital & Créa'];
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function cartItems(){return JSON.parse(localStorage.getItem('toutic-cart')||'[]');}
function saveCart(c){localStorage.setItem('toutic-cart',JSON.stringify(c));updateCartLink();}
function cartCount(){return cartItems().length;}
function updateCartLink(){const l=document.getElementById('cartLink');if(l)l.textContent='Panier ('+cartCount()+')';}
function initials(n){return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}
function productMedia(p){return p.img?'<img src="'+p.img+'" alt="'+p.name+'" loading="lazy">':'<div class="digi">'+initials(p.name)+'</div>';}
function backInit(){const b=document.createElement('button');b.id='backBtn';b.className='backbtn';b.textContent='← Retour';
 b.addEventListener('click',()=>{let same=false;try{same=new URL(document.referrer).host===location.host}catch(e){}
 if(same)history.back();else location.href='/';});
 document.body.appendChild(b);}

async function loadCatalog(){
 try{const r=await fetch('/api/products');if(r.ok)return await r.json();}catch(e){}
 const r=await fetch('products.json');return await r.json();
}
async function loadProducts(){
 const items=await loadCatalog();
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
    +'<a class="btn wide" href="produit.html?id='+encodeURIComponent(p.id)+'">Voir le produit</a></div>';
   grid.appendChild(el);
  });
 }
 chips.forEach(c=>c.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('on'));c.classList.add('on');filter=c.dataset.filter;render();}));
 render();window.__products=items;
}
async function renderCart(){
 const list=document.getElementById('cartList');if(!list)return;
 const items=await loadCatalog();
 const rows=cartItems().map(x=>items.find(p=>p.id===x.id)).filter(Boolean);
 const empty=document.getElementById('cartEmpty');const formBox=document.getElementById('orderBox');const tb=document.getElementById('cartTotalBox');
 if(!rows.length){list.innerHTML='';empty.style.display='block';formBox.style.display='none';if(tb)tb.style.display='none';return;}
 empty.style.display='none';formBox.style.display='block';if(tb)tb.style.display='block';
 let total=0;
 list.innerHTML=rows.map(p=>{let pr=parseFloat(p.price.replace(',','.'));if(isNaN(pr))pr=0;total+=pr;
  return '<div class="cartitem">'+(p.img?'<img src="'+p.img+'" alt="">':'<div class="digi digism">'+initials(p.name)+'</div>')
   +'<div class="nm"><b>'+p.name+'</b><br><span class="tag">'+p.cat+' · '+p.status+'</span></div>'
   +'<span class="pr">'+p.price+'</span><button data-remove="'+p.id+'">Retirer</button></div>';}).join('');
 const tot=document.getElementById('cartTotal');if(tot)tot.textContent=total.toFixed(2).replace('.',',')+' €';
}
document.addEventListener('click',e=>{
 const r=e.target.closest('[data-remove]');
 if(r){saveCart(cartItems().filter(x=>x.id!==r.dataset.remove));renderCart();}
});
function menuInit(){const btn=document.getElementById('menuBtn');const links=document.getElementById('navlinks');
 if(btn&&links)btn.addEventListener('click',()=>links.classList.toggle('open'));}
menuInit();updateCartLink();backInit();
async function orderSubmit(e){
 e.preventDefault();
 const prenom=document.getElementById('f-prenom').value.trim();const email=document.getElementById('f-email').value.trim();
 if(!prenom||!email){toast('Remplis ton prénom et ton email');return;}
 const items=await loadCatalog();
 const rows=cartItems().map(x=>items.find(p=>p.id===x.id)).filter(Boolean);
 if(!rows.length){toast('Ton panier est vide');return;}
 let total=0;rows.forEach(p=>{let pr=parseFloat(p.price.replace(',','.'));if(!isNaN(pr))total+=pr;});
 const fd=new FormData(e.target);
 const body=new URLSearchParams();
 body.set('form-name','commandes');body.set('prenom',prenom);body.set('email',email);
 body.set('produits',rows.map(p=>p.id+' | '+p.name+' | '+p.price).join(' ;; '));
 body.set('nb_produits',String(rows.length));
 body.set('total',total.toFixed(2).replace('.',',')+' €');
 try{await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});}catch(err){}
 saveCart([]);renderCart();e.target.reset();
 toast('Commande envoyée ! On te répond par email.');
}
document.addEventListener('submit',e=>{if(e.target.id==='orderForm')orderSubmit(e);});
