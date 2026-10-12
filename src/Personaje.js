class Personaje{
    #vida = 100;
    #nombre;
    #ki = 100;
    #energia = 100;
    #semilla = 2;

    constructor(nombre){
        this.#nombre = nombre;
        this.mostrarEstadisticas();
    }
    mostrarEstadisticas(){
        console.log(`
            nombre:${this.#nombre},
            *********************
            ki:${this.#ki},
            vida:${this.#vida},
            energia:${this.#energia},
            semilla:${this.#semilla},
        `);
    }
    getVida(){
        return this.#vida;
    }
    getKi(){
        return this.#ki;
    }
    getEnergia(){
        return this.#energia;
    }
    getSemilla(){
        return this.#semilla;
    }
    getNombre(){
        return this.#nombre;
    }
    puedeUsarSemilla(){
        return this.#semilla > 0 && (this.#vida < 100 || this.#ki < 100 || this.#energia < 100);
    }
    setVida(vida){
        this.#vida = Math.max(0, Math.min(100, vida));
    }
    setKi(ki){
        this.#ki = Math.max(0, Math.min(100, ki));
    }
    setEnergia(energia){
        this.#energia = Math.max(0, Math.min(100, energia));
    }
    setSemilla(semilla){
        this.#semilla = Math.max(0, Math.min(2, semilla));
    }
}

export default Personaje;