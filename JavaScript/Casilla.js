

class Casilla {
    // Propiedades asignadas a la clase Casillas
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bombasAdyacentes = 0;
        this.bomba = false;
        this.descubierta = false;
        this.bandera = false;
        this.abrirCasilla();
        this.ponerBandera();
    }
    
    // Métodos de a clase Casilla
    abrirCasilla(){
        if (this.descubierta) {
            this.descubierta = true;
        }
    }

    ponerBandera(){
        if (this.bandera) {
            this.bandera = true;
        }
    }

}