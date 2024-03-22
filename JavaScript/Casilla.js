

class Casilla {
    // Propiedades asignadas a la clase Casillas
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bombasAdyacentes = 0;
        this.bomba = false;
        this.descubierta = false;
        this.bandera = false;
        this.descubrirCasilla();
        this.colocarBandera();
    }
    
    // Métodos
    descubrirCasilla(){
        if (this.descubierta) {
            this.descubierta = true;
        }
    }

    colocarBandera(){
        if (this.bandera) {
            this.bandera = true;
        }
    }

}