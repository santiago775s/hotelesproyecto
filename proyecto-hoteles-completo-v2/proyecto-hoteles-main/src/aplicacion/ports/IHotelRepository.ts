import { Hotel } from "../../dominio/Hotel"

export interface IHotelRepository {
    crearHotel(hotel: Hotel): Promise<Hotel>
    obtenerHotel(id: string): Promise<Hotel>
    listHoteles(): Promise<Hotel[]>
}