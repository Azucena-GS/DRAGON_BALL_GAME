import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from "sweetalert2";
import Acciones from "./Acciones.js";
const btn_player1 = document.getElementById("btn_player1");
const btn_player2 = document.getElementById("btn_player2");
const player1 = document.getElementById("py1");
const player2 = document.getElementById("py2");
const nombre1 = document.getElementById("player1");
const nombre2 = document.getElementById("player2");
const nombres = document.getElementById("nombres");
const panel_jugador1 = document.getElementById("panel_jugador1");
const panel_jugador2 = document.getElementById("panel_jugador2");
const controles_jugador1 = document.getElementById("controles_jugador1");
const controles_jugador2 = document.getElementById("controles_jugador2");
const username1 = document.getElementById("username1");
const username2 = document.getElementById("username2");
const personaje1 = document.getElementById("personaje1");
const personaje2 = document.getElementById("personaje2");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");

let pj1 = "", pj2 = "";
let jugador1, jugador2;
let turnoActual = 1;
let combateTerminado = false;
let ataquesBasicosEnCombate = 0;
const DANIO_ATAQUE_BASICO = 10;
const DANIO_ATAQUE_ESPECIAL = 20;

const actualizarBarra = (elemento, valor) => {
    if (!elemento) return;
    const porcentaje = Math.max(0, Math.min(100, Number(valor) || 0));
    elemento.style.width = `${porcentaje}%`;
    elemento.textContent = `${porcentaje}%`;
    elemento.setAttribute("aria-valuenow", porcentaje);
};

const actualizarEstadoJugador = (numero, jugador) => {
    if (!jugador) return;

    const vida = document.getElementById(numero === 1 ? "vida1" : "vida2");
    const ki = document.getElementById(numero === 1 ? "ki1" : "ki2");
    const energia = document.getElementById(numero === 1 ? "energia1" : "energia2");
    const semilla = document.getElementById(numero === 1 ? "semilla1" : "semilla2");

    actualizarBarra(vida, jugador.getVida());
    actualizarBarra(ki, jugador.getKi());
    actualizarBarra(energia, jugador.getEnergia());

    if (semilla) {
        semilla.textContent = jugador.getSemilla();
    }
};

const danarRival = (numeroAtacante, cantidad) => {
    let numeroRival;
    let rival;
    let nombreGanador;

    if (numeroAtacante === 1) {
        numeroRival = 2;
        rival = jugador2;
        nombreGanador = nombre1.value;
    } else {
        numeroRival = 1;
        rival = jugador1;
        nombreGanador = nombre2.value;
    }
    if (!rival) return false;

    rival.setVida(Math.max(0, rival.getVida() - cantidad));
    actualizarEstadoJugador(numeroRival, rival);

    if (rival.getVida() > 0) return false;

    combateTerminado = true;
    [controles_jugador1, controles_jugador2].forEach((controles) => {
        controles.querySelectorAll("button").forEach((boton) => {
            boton.disabled = true;
        });
    });
    Swal.fire({
        icon: "success",
        title: "¡Victoria!",
        text: `${nombreGanador} ganó el combate.`,
        confirmButtonText: "Nuevo juego"
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            window.location.reload();
        }
    });
    return true;
};

const animarAtaque = (numero, tipo) => {
    let imagen;
    let personaje;
    let direccion;

    if (numero === 1) {
        imagen = img1;
        personaje = pj1;
        direccion = 32;
    } else {
        imagen = img2;
        personaje = pj2;
        direccion = -32;
    }

    const rutaBase = `./public/img/${personaje}`;

    imagen.src = `${rutaBase}/${tipo}.png`;
    const movimiento = imagen.animate([
        { transform: "translateX(0) scale(1)" },
        { transform: `translateX(${direccion}px) scale(1.08)`, offset: 0.4 },
        { transform: "translateX(0) scale(1)" }
    ], { duration: 600, easing: "ease-in-out" });

    movimiento.onfinish = () => {
        imagen.src = `${rutaBase}/base.png`;
    };
};

const actualizarBotonesJugador = (numero, jugador) => {
    if (!jugador) return;

    let botonBasico;
    let botonEspecial;
    let botonCargar;
    let botonSemilla;

    if (numero === 1) {
        botonBasico = document.getElementById("btn_atk_basico_1");
        botonEspecial = document.getElementById("btn_atk_especial_1");
        botonCargar = document.getElementById("btn_cargar_ki_1");
        botonSemilla = document.getElementById("btn_semilla_1");
    } else {
        botonBasico = document.getElementById("btn_atk_basico_2");
        botonEspecial = document.getElementById("btn_atk_especial_2");
        botonCargar = document.getElementById("btn_cargar_ki_2");
        botonSemilla = document.getElementById("btn_semilla_2");
    }

    const noEsSuTurno = combateTerminado || turnoActual !== numero;
    if (botonBasico) {
        botonBasico.disabled = noEsSuTurno || !jugador.puedeAtacarBasico();
    }
    if (botonEspecial) {
        botonEspecial.disabled = noEsSuTurno || !jugador.puedeAtacarFuerte(ataquesBasicosEnCombate);
    }
    if (botonCargar) botonCargar.disabled = noEsSuTurno;
    if (botonSemilla) botonSemilla.disabled = noEsSuTurno;
};

const cambiarTurno = () => {
    turnoActual = turnoActual === 1 ? 2 : 1;
    actualizarBotonesJugador(1, jugador1);
    actualizarBotonesJugador(2, jugador2);
};

const mostrarCombate = () => {
    if (!jugador1 || !jugador2) return;

    nombres.classList.add("d-none");
    panel_jugador1.classList.remove("d-none");
    panel_jugador2.classList.remove("d-none");
    controles_jugador1.classList.remove("d-none");
    controles_jugador2.classList.remove("d-none");
    actualizarBotonesJugador(1, jugador1);
    actualizarBotonesJugador(2, jugador2);
};

const confirmarJugador = (numero) => {
    if (numero === 1) {
        if (nombre1.value === "") {
            return msj_error("Primero escribe el nombre del jugador 1.");
        }
        if (pj1 === "") {
            return msj_error("El jugador 1 debe seleccionar un personaje.");
        }

        jugador1 = new Acciones(nombre1.value);
        nombre1.disabled = true;
        player1.classList.add("d-none");
        btn_player1.classList.add("d-none");
        iniciar_juego(1);
        panel_jugador1.classList.remove("d-none");

        if (jugador2) {
            mostrarCombate();
        }
    } else {
        if (nombre2.value === "") {
            return msj_error("Primero escribe el nombre del jugador 2.");
        }
        if (pj2 === "") {
            return msj_error("El jugador 2 debe seleccionar un personaje.");
        }

        jugador2 = new Acciones(nombre2.value);
        nombre2.disabled = true;
        player2.classList.add("d-none");
        btn_player2.classList.add("d-none");
        iniciar_juego(2);
        panel_jugador2.classList.remove("d-none");

        if (jugador1) {
            mostrarCombate();
        }
    }
};

const iniciar_juego = (numero) => {
    if (numero === 1) {
        username1.innerText = nombre1.value;
        personaje1.innerText = pj1;
        img1.src = `./public/img/${pj1}/base.png`;
        actualizarEstadoJugador(1, jugador1);
        actualizarBotonesJugador(1, jugador1);
    } else {
        username2.innerText = nombre2.value;
        personaje2.innerText = pj2;
        img2.src = `./public/img/${pj2}/base.png`;
        actualizarEstadoJugador(2, jugador2);
        actualizarBotonesJugador(2, jugador2);
    }
}

const limpiarNombre = (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/, "");
};
nombre1.addEventListener("input", limpiarNombre);
nombre2.addEventListener("input", limpiarNombre);

const remover_seleccion = (selector, color) => {
    const imagenes = selector.querySelectorAll("img");
    imagenes.forEach((elemento) => {
        elemento.classList.remove("bg-warning");
        elemento.classList.add(`bg-${color}`);
    });
};

const msj_error = (msj) =>{
    Swal.fire({
        icon:"warning",
        title:"Error!",
        text:msj
    });
}

const obtenerJugador = (numero) => {
    if (numero === 1) {
        return jugador1;
    }
    return jugador2;
};

player1.querySelectorAll("img").forEach((imagen) => {
    imagen.addEventListener("click", (event) => {
        if (nombre1.value === "") {
            return msj_error("Primero escribe el nombre del jugador 1.");
        }
        remover_seleccion(player1, "danger");
        event.currentTarget.classList.remove("bg-danger");
        event.currentTarget.classList.add("bg-warning");
        pj1 = event.currentTarget.alt;
    });
});

player2.querySelectorAll("img").forEach((imagen) => {
    imagen.addEventListener("click", (event) => {
        if (nombre2.value === "") {
            return msj_error("Primero escribe el nombre del jugador 2.");
        }
        remover_seleccion(player2, "primary");
        event.currentTarget.classList.remove("bg-primary");
        event.currentTarget.classList.add("bg-warning");
        pj2 = event.currentTarget.alt;
    });
});

const ejecutarAtaque = (numero, tipo) => {
    if (combateTerminado) return;

    const jugador = obtenerJugador(numero);
    if (!jugador) return;

    if (tipo === "basico") {
        if (!jugador.puedeAtacarBasico()) {
            return msj_error(`El jugador ${numero} ya usó su ataque en este turno.`);
        }
    } else {
        if (ataquesBasicosEnCombate < 2) {
            return msj_error("Primero se deben realizar 2 ataques básicos.");
        }
        if (!jugador.puedeAtacarFuerte(ataquesBasicosEnCombate)) {
            return msj_error(`El jugador ${numero} ya usó su ataque en este turno.`);
        }
    }
    if (turnoActual !== numero) {
        return msj_error(`Es turno del jugador ${turnoActual}.`);
    }

    let ataqueCorrecto;
    let cantidadDanio;
    if (tipo === "basico") {
        ataqueCorrecto = jugador.atkBasico();
        cantidadDanio = DANIO_ATAQUE_BASICO;
        if (ataqueCorrecto) ataquesBasicosEnCombate += 1;
    } else {
        ataqueCorrecto = jugador.atkEspecial(ataquesBasicosEnCombate);
        cantidadDanio = DANIO_ATAQUE_ESPECIAL;
    }
    if (!ataqueCorrecto) return;

    animarAtaque(numero, tipo);
    actualizarEstadoJugador(numero, jugador);
    if (danarRival(numero, cantidadDanio)) return;
    jugador.siguienteTurno();
    cambiarTurno();
};

const cargarEnergia = (numero) => {
    if (combateTerminado) return;
    if (turnoActual !== numero) {
        return msj_error(`Es turno del jugador ${turnoActual}.`);
    }

    const jugador = obtenerJugador(numero);
    if (!jugador) return;
    jugador.cargaEnergia();
    actualizarEstadoJugador(numero, jugador);
    jugador.siguienteTurno();
    cambiarTurno();
};

const usarSemilla = (numero) => {
    if (combateTerminado) return;
    if (turnoActual !== numero) {
        return msj_error(`Es turno del jugador ${turnoActual}.`);
    }

    const jugador = obtenerJugador(numero);
    if (!jugador) return;
    jugador.curacion();
    actualizarEstadoJugador(numero, jugador);
    jugador.siguienteTurno();
    cambiarTurno();
};

document.getElementById("btn_atk_basico_1").addEventListener("click", () => ejecutarAtaque(1, "basico"));
document.getElementById("btn_atk_especial_1").addEventListener("click", () => ejecutarAtaque(1, "especial"));
document.getElementById("btn_cargar_ki_1").addEventListener("click", () => cargarEnergia(1));
document.getElementById("btn_semilla_1").addEventListener("click", () => usarSemilla(1));

document.getElementById("btn_atk_basico_2").addEventListener("click", () => ejecutarAtaque(2, "basico"));
document.getElementById("btn_atk_especial_2").addEventListener("click", () => ejecutarAtaque(2, "especial"));
document.getElementById("btn_cargar_ki_2").addEventListener("click", () => cargarEnergia(2));
document.getElementById("btn_semilla_2").addEventListener("click", () => usarSemilla(2));

btn_player1.addEventListener("click", () => confirmarJugador(1));
btn_player2.addEventListener("click", () => confirmarJugador(2));