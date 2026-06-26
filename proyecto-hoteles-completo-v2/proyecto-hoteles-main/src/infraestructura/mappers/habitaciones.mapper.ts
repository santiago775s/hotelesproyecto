import { Habitacion } from "../../dominio/Habitacion";

export class HabitacionesMapper {
    public static map(habitacion: Habitacion) {
        return {
            numero: habitacion.numero,
            precioBase: habitacion.precioBase,
            capacidad: habitacion.capacidad 
        }
    }
}