

document.addEventListener("DOMContentLoaded", function () {
    mostrarFormulario()
});

function mostrarFormulario() {
    const tableroContainer = document.getElementById("TableroContainer");

    const formularioHTML = `
        <form id="inicioForm">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required><br><br>
            
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required><br><br>
            
            <label for="fechaNacimiento">Fecha de Nacimiento:</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" required><br><br>
            
            <label for="nick">Nick (debe acabar en número):</label>
            <input type="text" id="nick" name="nick" required pattern=".*[0-9]$"><br><br>
            
            <label for="mail">Mail (correo del ITB):</label>
            <input type="email" id="mail" name="mail" required pattern="[a-zA-Z0-9._%+-]+@itb.edu.ar$"><br><br>
             
            <label for="filas">Filas:</label>
            <input type="number" id="filas" name="filas" min="1" required><br><br>
                
            <label for="columnas">Columnas:</label>
            <input type="number" id="columnas" name="columnas" min="1" required><br><br>
                
            <label for="bombas">Bombas:</label>
            <input type="number" id="bombas" name="bombas" min="1" required><br><br>
                
            <input type="submit" value="Iniciar juego">
        </form>
    `;
    tableroContainer.innerHTML = formularioHTML;

    // Obtener los datos almacenados en localStorage
    const datosGuardados = JSON.parse(localStorage.getItem('datosUsuario'));
    if (datosGuardados) {
        document.getElementById("nombre").value = datosGuardados.nombre;
        document.getElementById("apellido").value = datosGuardados.apellido;
        document.getElementById("fechaNacimiento").value = datosGuardados.fechaNacimiento;
        document.getElementById("nick").value = datosGuardados.nick;
        document.getElementById("mail").value = datosGuardados.mail;
        document.getElementById("filas").value = datosGuardados.filas;
        document.getElementById("columnas").value = datosGuardados.columnas;
        document.getElementById("bombas").value = datosGuardados.bombas;
    }

    const inicio = document.getElementById("inicioForm");

    inicio.addEventListener("submit", function (event) {
        event.preventDefault();

        // Verificar la validez del formulario
        if (!inicio.checkValidity()) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const fechaNacimiento = document.getElementById("fechaNacimiento").value;
        const nick = document.getElementById("nick").value;
        const mail = document.getElementById("mail").value;
        const filas = parseInt(document.getElementById("filas").value);
        const columnas = parseInt(document.getElementById("columnas").value);
        const bombas = parseInt(document.getElementById("bombas").value);

        // Validar que el usuario sea mayor de edad
        const dia = new Date();
        const fechaNacimientoDate = new Date(fechaNacimiento);
        let edad = dia.getFullYear() - fechaNacimientoDate.getFullYear();
        if (dia.getMonth() < fechaNacimientoDate.getMonth() ||
            (dia.getMonth() === fechaNacimientoDate.getMonth() && dia.getDate() < fechaNacimientoDate.getDate())) {
            edad--;
        }
        if (edad < 18) {
            alert("Debes ser mayor de edad para jugar.");
            return;
        }

        // Comprobar que el nick termine en número
        if (!/\d$/.test(nick)) {
            alert("El nick debe acabar en un número.");
            return;
        }

        // Comprobar que el correo sea del ITB
        if (!mail.endsWith("@itb.cat")) {
            alert("El correo debe ser del ITB.");
            return;
        }

        darBienvenida(nombre);
        reiniciarJuego(nombre, apellido, fechaNacimiento, nick, mail, filas, columnas, bombas);
    });
}


function darBienvenida(nombre) {
    const bienvenida = document.getElementById("nombre"); // Obtener elemento h4
    bienvenida.textContent = "¡Bienvenido/a " + nombre + ", disfruta del buscaminas!"; // Crear el contenido del elemento
}


function reiniciarJuego(nombre, apellido, fechaNacimiento, nick, mail, filas, columnas, bombas) {
    //Datos del usuario, del formulario
    const datosUsuario = {
        nombre: nombre,
        apellido: apellido,
        fechaNacimiento: fechaNacimiento,
        nick: nick,
        mail: mail,
        filas: filas,
        columnas: columnas,
        bombas: bombas
    };

    //Guardar los datos en localStorage
    localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));

    const tablero = new Tablero(filas, columnas, bombas);
    mostrarTablero(tablero);
    console.log(tablero);
}


function mostrarTablero(tablero) {
    const tableroContainer = document.getElementById("TableroContainer");
    tableroContainer.innerHTML = "";

    const tabla = document.createElement("table");
    for (let i = 0; i < tablero.filas; i++) {
        const fila = document.createElement("tr");
        for (let j = 0; j < tablero.columnas; j++) {
            const casilla = tablero.tablero[i][j];
            const celda = document.createElement("td");

            if (!casilla.revelada) {
                celda.addEventListener("click", () => {
                    if (casilla.bomba) {
                        celda.textContent = "*";
                        setTimeout(() => {
                            alert("¡Ha explotado una bomba! Fin del juego.");
                            mostrarFormulario();
                        }, 2000);
                    } else {
                        revelarCasilla(tablero, i, j);
                        if (finalizarPartida(tablero)) {
                            alert("¡Felicidades! Has ganado la partida.");
                            mostrarFormulario();
                        }
                    }
                });

                celda.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    celda.textContent = "/\\";
                    casilla.marcada = true;
                    if (finalizarPartida(tablero)) {
                        alert("¡Felicidades! Has ganado la partida.");
                        mostrarFormulario();
                    }
                });
            }
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    tableroContainer.appendChild(tabla);
}


function revelarCasilla(tablero, fila, columna) {
    const casilla = tablero.tablero[fila][columna];
    const celda = document.querySelector(`#TableroContainer table tr:nth-child(${fila + 1}) td:nth-child(${columna + 1})`);

    if (casilla.adyacentes == 0 && !casilla.revelada) {
        casilla.revelada = true;
        celda.textContent = '';
        celda.style.backgroundColor = "grey";

        // Destapar todas las casillas adyacentes sin nada
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nuevaFila = fila + dx;
                const nuevaColumna = columna + dy;
                if (nuevaFila >= 0 && nuevaFila < tablero.filas && nuevaColumna >= 0 && nuevaColumna < tablero.columnas) {
                    revelarCasilla(tablero, nuevaFila, nuevaColumna);
                }
            }
        }
    } else if (!casilla.revelada) {
        casilla.revelada = true;
        celda.textContent = casilla.adyacentes;

       // Cambiar el color del texto para diferentes cantidad de bombas cerca
        if (casilla.adyacentes === 1) {
            celda.style.color = "#008cff"; 
        } else if (casilla.adyacentes === 2) {
            celda.style.color = "#04ff00"; 
        } else if (casilla.adyacentes === 3) {
            celda.style.color = "red"; 
        } else if (casilla.adyacentes === 4) {
            celda.style.color = "blue"; 
        } else if (casilla.adyacentes === 5) {
            celda.style.color = "maroon"; 
        } else if (casilla.adyacentes === 6) {
            celda.style.color = "teal"; 
        } else if (casilla.adyacentes === 7) {
            celda.style.color = "black"; 
        } else if (casilla.adyacentes === 8) {
            celda.style.color = "gray"; 
        } else { celda.style.color = "black"; }
    }
}


function finalizarPartida(tablero) {
    let bombasMarcadas = 0;
    let casillasReveladas = 0;

    // Iterar sobre todas las casillas del tablero
    for (let i = 0; i < tablero.filas; i++) {
        for (let j = 0; j < tablero.columnas; j++) {
            const casilla = tablero.tablero[i][j];

            if (casilla.bomba && casilla.marcada) {
                bombasMarcadas++; // Contar bombas marcadas con bandera
            }

            if (casilla.revelada) {
                casillasReveladas++; // Contar casillas reveladas
            }
        }
    }

    // Verificar si todas las bombas están marcadas y todas las casillas están reveladas
    if (bombasMarcadas == tablero.bombas && casillasReveladas === (tablero.filas * tablero.columnas - tablero.bombas)) {
        return true; // La partida ha finalizado
    } else {
        return false; // La partida aún no ha finalizado
    }
}




