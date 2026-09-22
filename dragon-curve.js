/**
 * Dragon Curve L-system
 *
 * JavaScript/Canvas port of my original Elm + GraphicSVG implementation.
 *
 * Original algorithm:
 * - L-system rewrite rules
 * - Turtle graphics
 * - Recursive generation
 * https://github.com/SammyDods/Dragon-Curve-Generator
 */
(function () {
  const Fwd1 = "Fwd1";
  const Fwd2 = "Fwd2";
  const Fwd3 = "Fwd3";
  const Right = "Right";
  const Left = "Left";

  function rewriteOne(move) {
    switch (move) {
      case Fwd1:
        return [Fwd1, Left, Fwd2, Fwd3, Left];
      case Fwd2:
        return [Right, Fwd3, Fwd1, Right, Fwd2];
      case Fwd3:
        return [Fwd3];
      case Right:
        return [Right];
      case Left:
        return [Left];
      default:
        return [move];
    }
  }

  function rewrite(moves) {
    return moves.flatMap(rewriteOne);
  } 

  function genMoves(n, list) {
    if (n <= 0) return list;
    return genMoves(n - 1, rewrite(list));
  }

  function ink(moves) {
    let x = 0;
    let y = 0;
    let dx = 10;
    let dy = -10;
    const points = [[0, 0]];

    for (const move of moves) {
      if (move === Right) {
        const ndx = dy;
        const ndy = -dx;
        dx = ndx;
        dy = ndy;
      } else if (move === Left) {
        const ndx = -dy;
        const ndy = dx;
        dx = ndx;
        dy = ndy;
      } else {
        x += dx;
        y += dy;
        points.push([x, y]);
      }
    }

    return points;
  }

  function genPoints(degree) {
    return ink(genMoves(degree, [Fwd3, Fwd1]));
  }

  function setup(canvas) {
    const ctx = canvas.getContext("2d");
    const degreeLabel = document.querySelector("[data-dragon-degree]");
    const buttons = document.querySelectorAll("[data-dragon-set]");
    let degree = 5;

    function sizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(123, 197, 226, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = (w / 10) * i;
        const y = (h / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const points = genPoints(degree);
      if (points.length < 2) return;

      const scaleElm = 2 / (1 + Math.pow(degree, 1.9));
      const offsetYElm = 10 + 1.4 * degree;

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      const transformed = points.map(([px, py]) => {
        const x = px * scaleElm;
        const y = -(py * scaleElm + offsetYElm); 
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        return [x, y];
      });

      const pad = 28;
      const spanX = Math.max(maxX - minX, 1);
      const spanY = Math.max(maxY - minY, 1);
      const fit = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      ctx.beginPath();
      transformed.forEach(([x, y], i) => {
        const sx = w / 2 + (x - midX) * fit;
        const sy = h / 2 + (y - midY) * fit;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.strokeStyle = "#e53935";
      ctx.lineWidth = 1.75;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      if (degreeLabel) degreeLabel.textContent = String(degree);
      buttons.forEach((btn) => {
        btn.classList.toggle(
          "is-active",
          Number(btn.dataset.dragonSet) === degree
        );
      });
    }

    function setDegree(n) {
      degree = Math.max(0, Math.min(15, n));
      draw();
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => setDegree(Number(btn.dataset.dragonSet)));
    });

    window.addEventListener("resize", sizeCanvas);
    sizeCanvas();
  }

  document.querySelectorAll("[data-dragon-canvas]").forEach(setup);
})();
