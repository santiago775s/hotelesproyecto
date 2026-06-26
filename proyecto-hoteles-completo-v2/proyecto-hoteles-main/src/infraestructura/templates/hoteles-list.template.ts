import Handlebars from "handlebars";
import { Hotel } from "../../dominio/Hotel";

const source = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LISTA HOTELES</title>
  </head>
  <body>
    <h1>LISTA DE HOTELES</h1>
    <table class="table table-dark table-striped">
      <thead>
        <th>ID</th>
        <th>NOMBRE</th>
        <th>DIRECCION</th>
        <th>ESTRELLAS</th>
      </thead>
      <tbody>
        {{#hoteles}}
            <tr>
                <td>{{id}}</td>
                <td>{{nombre}}</td>
                <td>{{direccion}}</td>
                <td>{{estrellas}}</td>
            </tr>
        {{/hoteles}}
      </tbody>
    </table>
  </body>
  <script src="/interfazGrafica/index.js">
  </script>
</html>
`;

export const HotelListTemplate = Handlebars.compile(source);

export function renderHotelListTemplate(hoteles: Hotel[]) {
    const hotelesMapped = hoteles.map((hotel) => ({
        id: hotel.getId(),
        nombre: hotel.nombre,
        direccion: hotel.getDireccion(),
        estrellas: hotel.getEstrellas()
    }));
    return HotelListTemplate({
        hoteles: hotelesMapped
    });
}

