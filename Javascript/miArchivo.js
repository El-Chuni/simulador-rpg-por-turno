//Variables y funciones necesarias para comenzar el juego:

const personaje = [{nombre: "Jugador", vida: 100, descripcion: "Eres tú."}, {nombre: "Malote", vida: 200, descripcion: "Aberración hecha en photoshop en 20 minutos, parece que te odia. Es debil ante las provocaciones."}];
sessionStorage.setItem('danetteUsado', false);
let numeroTurnos = 0;
let danioJugador;
let danioBoss;

//Para la musica
function play() {
    var audio = document.getElementById("audio");
    audio.play();
}

//Para calcular el daño de cada personaje:

function ataque(chance, bonusDanio) {
    let ataque = Math.ceil(Math.random() * 100);
    
    //Para la Optimización, decidí hacer este condicional para decidir que variante asignar.
    return (ataque >= (100 - chance) ? (Math.ceil(Math.random() * 15) + 10) * bonusDanio : 0);
}

//La introducción del jefe

let pantalla = document.getElementById("pantalla");
let introEnemigo = document.getElementById("introEnemigo"); 
let nombreJefe = document.getElementById("nombreJefe");
let botonIntro = document.getElementById("botonIntro1");
botonIntro.addEventListener("click", continuarIntro);
let menu = document.getElementById("menu");


function continuarIntro() {
    introEnemigo.innerHTML = '<p>"???: ¡Tendrás que enfrentarte a mí!"</p><button class="boton" id="botonIntro2">=></button>';
    botonIntro = document.getElementById("botonIntro2");
    botonIntro.addEventListener("click", terminarIntro);
}

function terminarIntro() {
    pantalla.innerHTML = '<div id="pantallaEnemigo"></div>';
    let pantallaEnemigo = document.getElementById("pantallaEnemigo");
    pantallaEnemigo.innerHTML = '<img src="./Multimedia/elMalote.png" alt="El Malote" class="malote"></img>';
    nombreJefe.innerHTML = 'Boss: Malote';
    menu.innerHTML = '<strong id="contadorSalud">Salud: ' + personaje[0].vida + '</strong><div><button id="combo">Combo</button><button id="esencia">Esencia de Destrucción</button><button id="tigerDrop">Tiger Drop</button><button id="danette">Danette</button><button id="analisis">Analisis</button><button id="explicacion">Explicación botones</button></div>'

    let contadorSalud = document.getElementById("contadorSalud");

    let combo = document.getElementById("combo");
    combo.addEventListener("click", opcionCombo);
    let esencia = document.getElementById("esencia");
    esencia.addEventListener("click", opcionEsencia);
    let tigerDrop = document.getElementById("tigerDrop");
    tigerDrop.addEventListener("click", opcionTigerDrop);
    let danette = document.getElementById("danette");
    danette.addEventListener("click", opcionDanette);
    let analisis = document.getElementById("analisis");
    analisis.addEventListener("click", opcionAnalisis);
    let explicacion = document.getElementById("explicacion");
    explicacion.addEventListener("click", opcionExplicacion);
}

//Las funciones que simulan toda la batalla, no se acaba hasta que se pierde un personaje.

let tuAccion = document.getElementById("tuAccion");
let laDelEnemigo = document.getElementById("laDelEnemigo"); 


function opcionCombo () {
    numeroTurnos++;
    
    //Uso el spread para ver cual golpe en el combo acierta el ataque y uso el mejor.
    const ataques = [];
    for (let i = 0; i < 3; i++){
        ataques.push(ataque(80, 1));
    }

    danioJugador = Math.max(...ataques);

    if (danioJugador != 0){
        personaje[1].vida = personaje[1].vida - danioJugador;
        tuAccion.innerHTML = "HIT! Los golpes le hicieron " + danioJugador + " de daño.";
        personaje[1].vida < 1 && victoria();
    }else{
        tuAccion.innerHTML = "¡Malote evadió los golpes!";
    }

    danioBoss = ataque(70, 1);

    if (danioBoss != 0){
        personaje[0].vida = personaje[0].vida - danioBoss;
        laDelEnemigo.innerHTML= "¡Malote te pegó un tiro quitandote " + danioBoss + " de vida!";
        personaje[0].vida < 1 && derrota();
    }else{
        laDelEnemigo.innerHTML= "¡Esquivas el tiro de Malote!";
    }

    contadorSalud.innerHTML = "Salud: " + personaje[0].vida;
}

function opcionEsencia () {
    numeroTurnos++;

    danioJugador = ataque(65, 2);

    if (danioJugador != 0){
        personaje[1].vida = personaje[1].vida - danioJugador;
        tuAccion.innerHTML = "¡Agarraste la cabeza del Malote y lo tiraste al suelo! Le haces " + danioJugador + " de daño.";
        personaje[1].vida < 1 && victoria();
    }else{
        tuAccion.innerHTML ="¡Tu mano no alcanza a Malote!";
    }

    danioBoss = ataque(80, 1);

    if (danioBoss != 0){
        personaje[0].vida = personaje[0].vida - danioBoss;
        laDelEnemigo.innerHTML= "¡Malote dispara a quemarropa quitandote " + danioBoss + " de vida!";
        personaje[0].vida < 1 && derrota();
    }else{
        laDelEnemigo.innerHTML= "¡Esquivas el tiro a quemarropa de Malote!";
    }

    contadorSalud.innerHTML = "Salud: " + personaje[0].vida;
}

function opcionTigerDrop () {
    numeroTurnos++;

    tuAccion.innerHTML = "¡Provocas al Malote de cerca!";

    danioBoss = ataque(50, 1);

    if (danioBoss != 0){
        personaje[0].vida = personaje[0].vida - danioBoss;
        laDelEnemigo.innerHTML=  "¡Pero no sirvió, te lastimó con la culata! Pierdes " + danioBoss + " de vida y tu chance de golpearle.";
        personaje[0].vida < 1 && derrota();
    }else{
        danioJugador = ataque(100, 1.5);
        personaje[1].vida = personaje[1].vida - danioJugador;
        laDelEnemigo.innerHTML= "Enojado, intenta pegarte con la culata de su pistola, ¡Pero le desvias su brazo y le pegas en el estomago haciendole " + danioJugador + " de daño!";
        personaje[1].vida < 1 && victoria();
    }

    contadorSalud.innerHTML = "Salud: " + personaje[0].vida;
}

function opcionDanette () {
    let danetteUsado = JSON.parse(sessionStorage.getItem('danetteUsado'));
    if (!danetteUsado){
        numeroTurnos++;
        sessionStorage.setItem('danetteUsado', true);
        personaje[0].vida = 100;

        tuAccion.innerHTML = "El sabor a dulce de leche te renueva completamente, ¡Tu vida se regenera del todo!";

        danioBoss = ataque(70, 1);

        if (danioBoss != 0){
            personaje[0].vida = personaje[0].vida - danioBoss;
            laDelEnemigo.innerHTML= "Pero a Malote le da envidia y te dispara en el pecho quitandote " + danioBoss + " de vida, todo mal.";
        }else{
            laDelEnemigo.innerHTML= "¡A Malote le da envidia y te dispara sin darte con éxito!";
        }

        contadorSalud.innerHTML = "Salud: " + personaje[0].vida;
    }else{
        //Pensé que Toastify sería perfecto para esta acción en especifico ya que no cambia nada pero lo hace más elegante.
        Toastify({
            text: "Ya te comiste el Danette. :(",
            duration: 3000,
            gravity: 'top',
            position: 'right',
            destination: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }).showToast();
    }
}

function opcionAnalisis () {
    //Uso la desestructuración solo para este caso (Por ahora no le veo muchos usos pero toca practicar)

    const {nombre, descripcion} = personaje[1];
    tuAccion.innerHTML = nombre + ": " + descripcion;
    laDelEnemigo.innerHTML = "";
}

function opcionExplicacion () {
    tuAccion.innerHTML= '<p>"[1] Combo de golpes: Daño normal con chance de esquivar ataque enemigo."</p><p>"[2] Esencia de Destrucción: Doble de fuerza pero menor chance acertar y esquivar."</p><p>"[3] Tiger Drop: Te arriesgas a que te dañe primero pero si esquivas puedes contraatacar en su punto debil."</p><p>"[4] Danette: Tan rico que te cura del todo, solo tenes uno."</p><p>"[5] Analisis: Describe a una unidad en batalla."</p>';
}

//Se anuncia el resultado de la batalla y se registra en un fetch


//Ambas fueron modificadas para que se invoquen con operadores AND
function victoria (){
    registroFetch ('El jugador', numeroTurnos);
    
    let conclusion = document.getElementById("fraseFinal");
    menu.innerHTML = "";
    conclusion.innerHTML = '<p>Malote: ¡NOOOOOOOOOOOO! ¡NI SIQUIERA PUDE DAR MI DISCURSO EPICO!</p><p>Luego de decir esto, Malote cae en el acantilado y muere (tal vez)</p><h4>¡Felicidades, ganaste!</h4>';
}

function derrota (){
    registroFetch ('Malote', numeroTurnos);

    let conclusion = document.getElementById("fraseFinal");
    menu.innerHTML = "";
    conclusion.innerHTML = '<p>Malote: Disfruta siendo un queso en el suelo, ¡Muajajajaja!</p><h2>(GAME OVER)</h2>';
}

function registroFetch (personaje, turnos){
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: 'Resultado combate:',
            body: personaje + ' gana la pelea luego de ' + turnos + ' turnos.',
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}