import Personaje from "./Personaje.js";

class Acciones extends Personaje{
    #turno = 1;
    #ataquesUsadosEnTurno = 0;

    constructor(nombre){
        super(nombre);
    }

    getTurno(){
        return this.#turno;
    }

    getAtaquesUsadosEnTurno(){
        return this.#ataquesUsadosEnTurno;
    }

    siguienteTurno(){
        this.#turno += 1;
        this.#ataquesUsadosEnTurno = 0;
    }

    puedeAtacarBasico(){
        return this.#ataquesUsadosEnTurno < 1;
    }

    puedeAtacarFuerte(ataquesBasicos){
        return this.#ataquesUsadosEnTurno < 1 && ataquesBasicos >= 2;
    }

    atkBasico(){
        if (!this.puedeAtacarBasico()) {
            return false;
        }

        this.setEnergia(Math.max(0, this.getEnergia() - 5));
        this.setKi(Math.max(0, this.getKi() - 10));
        this.#ataquesUsadosEnTurno += 1;
        this.mostrarEstadisticas();
        return true;
    }

    atkEspecial(ataquesBasicos){
        if (!this.puedeAtacarFuerte(ataquesBasicos)) {
            return false;
        }

        this.setEnergia(Math.max(0, this.getEnergia() - 15));
        this.setKi(Math.max(0, this.getKi() - 20));
        this.#ataquesUsadosEnTurno += 1;
        this.mostrarEstadisticas();
        return true;
    }

    curacion(){
        this.setEnergia(100);
        this.setKi(100);
        this.setVida(100);
        this.setSemilla(this.getSemilla() - 1);
    }

    cargaEnergia(){
        this.setEnergia((this.getEnergia() + 15) > 100 ? 100 : (this.getEnergia() + 15));
        this.setKi((this.getKi() + 10) > 100 ? 100 : (this.getKi() + 10));
        this.mostrarEstadisticas();
    }

    defensa(){

    }
}

export default Acciones;