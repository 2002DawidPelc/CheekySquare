comenzarPartida = function () {
    let cuadrado = document.getElementById("cuadrado");
    let duracionAnimacion = 0.5; // duración de la animacion de movimiento del cuadro
    
    let subesDeNivel = document.getElementById("subesDeNivel"); // texto que se mueve para avisar del cambio de nivel
    let direccion = "derecha"; // el primer texto de cambio de nivel saldrá desde la derecha

    let puntos = 0; // se empieza con 0 puntos
    let nivel = 1; // se empieza por el nivel 1
    let objetivo = 5; // el objetivo para el primer nivel son 5 puntos
    let fallos = 0 // número de clicks fuera del cuadro

    let nivelDOM = document.getElementById("nivel"); // <span> para actualizar el nivel en pantalla

    // función para cuando se falla
    seHaFallado = function () {
        fallos++; // se suma un fallo
        document.getElementById("cuadro-perdiste").style.display = "block"; // se muestra el cuadro de volver a intentar
        // Obtener una referencia para el último intervalo + 1
        const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);
        for (let i = 1; i < interval_id; i++) { // Eliminar cualquier timeout/intervalo hasta esa id
            window.clearInterval(i);
        }
        document.getElementById("boton-reintentar").onclick = function (event) {
            event.target.parentNode.style.display = "none"; // ocultar el cuadro de reintentar
            event.stopPropagation(); // parar propagación para que no cuente como click fuera del cuadro
            document.getElementById("segundos").innerHTML = 30; // el contador vuelve a empezar desde 30
            // el cuadrado vuelve al centro
            cuadrado.style.marginLeft = "48vw";
            cuadrado.style.marginTop = "20vh";
            // se reinician los marcadores
            objetivo = 5;
            puntos = 0;
            nivel = 1;
            // se actualizan los puntos, objetivo y nivel en pantalla
            document.getElementById("puntos").innerHTML = 0;
            document.getElementById("objetivo").innerHTML = objetivo;
            nivelDOM.innerHTML = nivel;
            duracionAnimacion = 0.5; // se vuelve a establecer la duración de la animación a 0.5 segundos
            iniciarCuentaAtras(); // se inicia la cuenta atrás de nuevo
        }
    };

    var cuentaAtras = null;

    // iniciar la cuenta atrás en cada nivel
    iniciarCuentaAtras = function () {
        var tiempoRestante = 30; // para cada nivel se cuenta con 30 segundos
        // si se hace click fuera del cuadro la partida acaba
        document.getElementById("principal").onclick = seHaFallado;
        cuentaAtras = setInterval(function () { // intervalo para actualizar los segundos restantes
            if (tiempoRestante <= 1) { // si el contador ha llegado a 0
                seHaFallado();
            }
            tiempoRestante -= 1; // se resta un segundo
            document.getElementById("segundos").innerHTML = tiempoRestante; // se actualiza el tiempo restante en pantalla
        }, 1000); // el intervalo se ejecuta cada segundo
    }

    iniciarCuentaAtras(); // iniciar la cuenta atrás al principio de la partida

    // cuando se hace click en el cuadrado
    cuadrado.onclick = function (e) {
        rotarCuadradoModificarTamaño(); // se rota el cuadrado 90 grados y se modifica el tamaño
        e.stopPropagation(); // parar propagación para que no cuente como click fuera del cuadro
        let anchura = numeroRandom(90); // anchura aleatoria
        let altura = numeroRandom(50); // altura aleatoria
        if (anchura < 5) anchura = 5; // corregir posición para que el cuadro no salga de la pantalla
        cuadrado.style.marginTop = altura + "vh"; // se mueve el cuadrado verticalmente
        cuadrado.style.marginLeft = anchura + "vw"; // se mueve el cuadrado horizontalmente
        // se cambia el color de fondo del cuadrado - pura estética
        cuadrado.style.backgroundImage = "linear-gradient(45deg, " + colorHex() + " 0%, " + colorHex() + " 100%)";
        puntos++; // se suma un punto
        document.getElementById("puntos").innerHTML = puntos; // se actualizan los puntos en la pantalla
        if (puntos >= objetivo) { // si se ha llegado al objetivo
            AnimacionSubirDeNivel();
            objetivo += 5; // el próximo objetivo será de 5 puntos más
            puntos = 0; // se restablecen los puntos
            nivel++; // se pasa al siguiente nivel
            // se actualizan los puntos, objetivo y nivel en pantalla
            document.getElementById("puntos").innerHTML = 0;
            document.getElementById("objetivo").innerHTML = objetivo;
            nivelDOM.innerHTML = nivel;
            if (duracionAnimacion > 0.1){ // se hará la animación más rápida hasta que llegue a 0.1s
                duracionAnimacion=duracionAnimacion-0.1;
                cuadrado.style.transitionDuration = (duracionAnimacion)+"s";
            }
            clearInterval(cuentaAtras)
            document.getElementById("segundos").innerHTML = 30; // el contador vuelve a empezar desde 30
            // efecto para visualizar el cambio de nivel
            document.getElementById("nivel-transicion").classList.add("nivel-transicion");
            setTimeout(function () { document.getElementById("nivel-transicion").classList.remove("nivel-transicion"); }, 1000);
            iniciarCuentaAtras(); // se inicia la cuenta atrás de nuevo
        }
    }

    let grados = [90,180,270,360,270,180];
    let rotacionGrados = 0;

    // animación al subir de nivel
    function AnimacionSubirDeNivel(){
        if (direccion=="derecha") {
            subesDeNivel.classList.add("animacionNivelDerecha"); // se añade la clase para que el texto salga desde la derecha
            setTimeout(function(){subesDeNivel.classList.remove("animacionNivelDerecha");},3000) // se elimina la clase tras 3 segundos
            direccion="izquierda"; // el texto saldrá desde la izquierda la próxima vez
        } else {
            subesDeNivel.classList.add("animacionNivelIzquierda"); // se añade la clase para que el texto salga desde la izquierda
            setTimeout(function(){subesDeNivel.classList.remove("animacionNivelIzquierda");},3000) // se elimina la clase tras 3 segundos
            direccion="derecha"; // el texto saldrá desde la derecha la próxima vez
        } 
    }

    // rotar y modificar el tamaño del cuadrado
    function rotarCuadradoModificarTamaño(){
        cuadrado.style.transform = 'rotate('+grados[rotacionGrados]+'deg) scale('+numeroRandomDecimales(0,2,2)+')';
        rotacionGrados++;
        if (rotacionGrados>=6) rotacionGrados=0;
    }

    // obtener un número aleatorio
    function numeroRandom(max) {
        return Math.floor(Math.random() * max);
    }

    // obtener un número aleatorio con decimales
    function numeroRandomDecimales(min, max, decimalPlaces) {  
        var rand = Math.random()*(max-min) + min;
        var power = Math.pow(10, decimalPlaces);
        let resultadoFinal=Math.floor(rand*power) / power;
        if (resultadoFinal<=0.4) resultadoFinal=0.5; // no generar un número menor de 0,5
        return resultadoFinal;
    } 

    // generar un color hexadecimal aleatorio
    function colorHex() {
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
    }
}

// Al pulsar el botón de empezar se oculta el cuadro de introducción y empieza la partida
window.onload = function () {
    document.getElementById("boton-empezar").onclick = function (event) {
        event.target.parentNode.parentNode.style.display = "none";
        event.stopPropagation(); // parar propagación para que no cuente como click fuera del cuadro
        comenzarPartida();
    }
}