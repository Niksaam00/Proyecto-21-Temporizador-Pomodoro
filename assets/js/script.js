
// Obtener los elementos del HTML
const tiempo = document.getElementById("tiempo");
const botonIniciar = document.getElementById("botonIniciar");
const botonReiniciar = document.getElementById("botonReiniciar");
const contadorSesiones = document.getElementById("contadorSesiones");
const mensaje = document.getElementById("mensaje");
const nombreSesion = document.getElementById("nombreSesion");

// Tiempos de cada sesión
let tiempoTrabajo = 25;
let tiempoDescansoCorto = 5;
let tiempoDescansoLargo = 15;

// Variables del temporizador
let segundos = tiempoTrabajo * 60;
let temporizador;
let funcionando = false;
let sesionesCompletadas = 0;
let modoActual = "trabajo";

// Mostrar el tiempo en pantalla
function actualizarTiempo() {
    let minutos = Math.floor(segundos / 60);
    let segundosRestantes = segundos % 60;

    tiempo.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(segundosRestantes).padStart(2, "0");
}

// Iniciar o pausar el temporizador
function iniciarTemporizador() {
    if (funcionando === false) {
        funcionando = true;
        botonIniciar.textContent = "Pausar";

        temporizador = setInterval(function () {
            segundos--;
            actualizarTiempo();

            if (segundos <= 0) {
                clearInterval(temporizador);
                funcionando = false;
                botonIniciar.textContent = "Iniciar";
                finalizarSesion();
            }

        }, 1000);

    } else {
        clearInterval(temporizador);
        funcionando = false;
        botonIniciar.textContent = "Reanudar";
    }
}

// Reiniciar el tiempo actual
function reiniciarTemporizador() {
    clearInterval(temporizador);
    funcionando = false;

    if (modoActual === "trabajo") {
        segundos = tiempoTrabajo * 60;
    } else if (modoActual === "descansoCorto") {
        segundos = tiempoDescansoCorto * 60;
    } else {
        segundos = tiempoDescansoLargo * 60;
    }

    botonIniciar.textContent = "Iniciar";
    actualizarTiempo();
    mensaje.textContent = "Temporizador reiniciado";
}

// Cambiar el tipo de sesión
function cambiarSesion(modo) {
    clearInterval(temporizador);
    funcionando = false;
    modoActual = modo;

    if (modo === "trabajo") {
        segundos = tiempoTrabajo * 60;
        nombreSesion.textContent = "Tiempo de trabajo";
    } else if (modo === "descansoCorto") {
        segundos = tiempoDescansoCorto * 60;
        nombreSesion.textContent = "Descanso corto";
    } else {
        segundos = tiempoDescansoLargo * 60;
        nombreSesion.textContent = "Descanso largo";
    }

    botonIniciar.textContent = "Iniciar";
    mensaje.textContent = "¡Prepárate para tu sesión!";

    document.getElementById("botonTrabajo").classList.remove("activo");
    document.getElementById("botonDescansoCorto").classList.remove("activo");
    document.getElementById("botonDescansoLargo").classList.remove("activo");

    if (modo === "trabajo") {
        document.getElementById("botonTrabajo").classList.add("activo");
    } else if (modo === "descansoCorto") {
        document.getElementById("botonDescansoCorto").classList.add("activo");
    } else {
        document.getElementById("botonDescansoLargo").classList.add("activo");
    }

    actualizarTiempo();
}

// Reproducir un sonido al terminar
function reproducirSonido() {
    const sonido = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

    sonido.play().catch(function () { });
}

// Cuando termina una sesión
function finalizarSesion() {
    reproducirSonido();

    if (modoActual === "trabajo") {
        sesionesCompletadas++;
        contadorSesiones.textContent = sesionesCompletadas;
        mensaje.textContent = "¡Trabajo terminado! Hora de descansar.";

        if (sesionesCompletadas % 4 === 0) {
            cambiarSesion("descansoLargo");
        } else {
            cambiarSesion("descansoCorto");
        }

    } else {
        mensaje.textContent = "¡Descanso terminado! Sigue trabajando.";
        cambiarSesion("trabajo");
    }
}

// Guardar los nuevos tiempos
function guardarConfiguracion() {
    let nuevoTrabajo = Number(document.getElementById("tiempoTrabajo").value);
    let nuevoDescansoCorto = Number(document.getElementById("tiempoDescansoCorto").value);
    let nuevoDescansoLargo = Number(document.getElementById("tiempoDescansoLargo").value);

    if (
        nuevoTrabajo < 1 || nuevoTrabajo > 120 || !Number.isInteger(nuevoTrabajo) ||
        nuevoDescansoCorto < 1 || nuevoDescansoCorto > 120 || !Number.isInteger(nuevoDescansoCorto) ||
        nuevoDescansoLargo < 1 || nuevoDescansoLargo > 120 || !Number.isInteger(nuevoDescansoLargo)
    ) {
        alert("Ingresa tiempos entre 1 y 120 minutos.");
        return;
    }

    tiempoTrabajo = nuevoTrabajo;
    tiempoDescansoCorto = nuevoDescansoCorto;
    tiempoDescansoLargo = nuevoDescansoLargo;

    reiniciarTemporizador();
    mensaje.textContent = "Configuración guardada correctamente";
}

// Eventos de los botones
botonIniciar.addEventListener("click", iniciarTemporizador);
botonReiniciar.addEventListener("click", reiniciarTemporizador);

document.getElementById("botonTrabajo").addEventListener("click", function () {
    cambiarSesion("trabajo");
});

document.getElementById("botonDescansoCorto").addEventListener("click", function () {
    cambiarSesion("descansoCorto");
});

document.getElementById("botonDescansoLargo").addEventListener("click", function () {
    cambiarSesion("descansoLargo");
});

document.getElementById("botonGuardar").addEventListener("click", guardarConfiguracion);

// Mostrar el tiempo inicial
actualizarTiempo();
