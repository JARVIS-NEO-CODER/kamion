async function loadProducts(){
  const res = await fetch('products.json');
  const items = await res.json();
  const grid = document.getElementById('grid');
  const chips = document.querySelectorAll('.chip');
  let filter = 'all';
  function render(){
    grid.innerHTML = '';
    items.filter(p => filter === 'all' || p.type === filter).forEach(p => {
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = '<div class="ph" data-mark="KAMION"></div><div class="body"><h4>' + p.name + '</h4><p class="desc">' + p.desc + '</p><div class="row"><span class="price">' + p.price + '</span><span class="tagpill">' + p.status + '</span></div><button class="btn buy" data-id="' + p.id + '">Commander</button></div>';
      grid.appendChild(el);
    });
  }
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('on'));
    c.classList.add('on');
    filter = c.dataset.filter;
    render();
  }));
  render();
}
loadProducts();
document.addEventListener('click', e => {
  if (e.target.classList && e.target.classList.contains('buy')) {
    alert('Commandes bientôt ouvertes avec PayPal. En attendant, passe par Discord.');
  }
});
