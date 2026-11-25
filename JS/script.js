document.getElementById("ano").textContent = new Date().getFullYear();

const topo = document.getElementById("topo");
const botaoMenu = document.querySelector(".botao-menu");
const menu = document.getElementById("menu");
const linksMenu = [...menu.querySelectorAll("a")];
const secoes = linksMenu.map((link) => document.querySelector(link.hash));
const telaAmpla = window.matchMedia("(min-width: 768px)");

function definirMenu(aberto) {
  menu.classList.toggle("aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
}

botaoMenu.addEventListener("click", () => {
  definirMenu(!menu.classList.contains("aberto"));
});

linksMenu.forEach((link, indice) => {
  link.addEventListener("click", (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
    definirMenu(false);
    secoes[indice].focus({ preventScroll: true });
  });
});

topo.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    definirMenu(false);
    botaoMenu.focus();
  }
});

topo.addEventListener("focusout", (evento) => {
  if (!topo.contains(evento.relatedTarget)) definirMenu(false);
});

telaAmpla.addEventListener("change", () => {
  const focoNoMenu = menu.contains(document.activeElement);
  definirMenu(false);

  if (!telaAmpla.matches && focoNoMenu) botaoMenu.focus();
});

topo.classList.add("menu-interativo");
botaoMenu.hidden = false;

const voltarTopo = document.querySelector(".voltar-topo");

function atualizarRolagem() {
  topo.classList.toggle("rolou", window.scrollY > 10);
  voltarTopo.classList.toggle("visivel", window.scrollY > 500);

  const limite = topo.offsetHeight + window.innerHeight / 4;
  const fimDaPagina = window.scrollY > 0 &&
    Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
  const secaoAtiva = fimDaPagina
    ? secoes[secoes.length - 1]
    : secoes.findLast((secao) => secao.getBoundingClientRect().top <= limite);

  linksMenu.forEach((link, indice) => {
    const ativo = secoes[indice] === secaoAtiva;
    link.classList.toggle("ativo", ativo);
    if (ativo) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", atualizarRolagem, { passive: true });
window.addEventListener("resize", atualizarRolagem);
atualizarRolagem();

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add("visivel");
        observador.unobserve(target);
      }
    });
  });

  document.querySelectorAll(".revelar").forEach((elemento) => {
    observador.observe(elemento);
  });
}

const grupoFiltros = document.querySelector(".filtros");
const filtros = grupoFiltros.querySelectorAll(".filtro");
const cards = [...document.querySelectorAll(".card-projeto")];
const resultado = document.getElementById("resultado-filtro");

filtros.forEach((botao) => {
  botao.addEventListener("click", () => {
    const escolhido = botao.dataset.filtro;

    filtros.forEach((outro) => {
      const ativo = outro === botao;
      outro.classList.toggle("ativo", ativo);
      outro.setAttribute("aria-pressed", String(ativo));
    });

    let quantidade = 0;
    cards.forEach((card) => {
      const tecnologias = card.dataset.tec.split(/\s+/);
      const mostrar = escolhido === "todos" || tecnologias.includes(escolhido);
      card.hidden = !mostrar;
      if (mostrar) quantidade++;
    });

    resultado.textContent = quantidade === 1
      ? "1 projeto exibido."
      : `${quantidade} projetos exibidos.`;
    atualizarRolagem();
  });
});

grupoFiltros.hidden = false;
