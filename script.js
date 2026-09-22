const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link')

navToggle.addEventListener('click', () =>{
  document.body.classList.toggle('nav-open');
  });

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
  })
})

document.querySelectorAll('[data-itch-src]').forEach((embed) => {
  const playBtn = embed.querySelector('.itch-embed__play');
  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    if (embed.classList.contains('is-playing')) return;

    const iframe = document.createElement('iframe');
    iframe.title = 'Play Zombinator';
    iframe.allowFullscreen = true;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.width = '1920';
    iframe.height = '1100';
    iframe.src = embed.dataset.itchSrc;

    embed.classList.add('is-playing');
    playBtn.remove();
    embed.appendChild(iframe);
  });
});
