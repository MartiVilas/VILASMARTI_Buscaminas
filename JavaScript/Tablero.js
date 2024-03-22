

class Tablero {
    // Propiedades asignadas a la clase Tablero
    constructor(filas, columnas, numBombas) {
        this.filas = filas;
        this.columnas = columnas;
        this.numBombas = numBombas;
        this.tablero = this.crearTabler();
        this.ponerBombas();
        this.calcularAdyacentes();
    }

    crearTabler() {
        let array = [];
        for (let i = 0; i < this.filas; i++) {
            let fila = [];
            for (let j = 0; j < this.columnas; j++) {
                fila.push(new Casilla());
            }
            array.push(fila);
        }
        return array;
    }

    ponerBombas() {
        let contador = 0;

        while (contador < this.numBombas) {
            let numX = Math.floor(Math.random() * this.filas);
            let numY = Math.floor(Math.random() * this.columnas);

            if (!this.tablero[numX][numY].bomba) {
                this.tablero[numX][numY].bomba = true;
                contador++;
            }
        }
    }

    contarBombas(x, y) {
            let bombasAdyacentes = 0;
            const casillasAdyacentes = this.obtenCasillasAdyacentes(x, y);

            for (const casilla of casillasAdyacentes) {
                if (this.tablero[casilla.x][casilla.y].bomba) {
                    bombasAdyacentes++;
                }
            }

            return bombasAdyacentes;
    }  

    obtenCasillasAdyacentes(x, y) {
        const adyacentes = [];
        //Recorrer del -1 al 1 pasando por 0 para sacar las coordenadas
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newX = x + i;
                const newY = y + j;

                if (newX >= 0 && newX < this.filas && newY >= 0 && newY < this.columnas) {
                    adyacentes.push({ x: newX, y: newY });
                }
            }
        }

        return adyacentes;
    }
    calcularAdyacentes() {
            for (let i = 0; i < this.filas; i++) {
                for (let j = 0; j < this.columnas; j++) {
                    const bombasAdyacentes = this.contarBombas(i, j);
                    this.tablero[i][j].adyacentes = bombasAdyacentes;
                }
            }
    }
}