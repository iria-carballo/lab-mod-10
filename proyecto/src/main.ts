import { Personaje } from "./main.model";
import { obtenerPersonajes } from "./main.api";

//Crear tarjetas de personaje en la UI

const crearElementoImagen = (
  portada: string,
  titulo: string
): HTMLImageElement => {
  const imagen = document.createElement("img");
  imagen.src = portada;
  imagen.alt = titulo;

  return imagen;
};

const crearElementoParrafo = (
  label: string,
  texto: string
): HTMLParagraphElement => {
  const parrafo = document.createElement("p");
  const elementoLabel = document.createElement("strong");
  elementoLabel.classList.add("label-personaje");
  elementoLabel.textContent = `${label}:`;
  parrafo.appendChild(elementoLabel);
  parrafo.append(` ${texto}`);
  return parrafo;
};

const crearTarjetaPersonaje = (personaje: Personaje): HTMLDivElement => {
  const elementoPersonaje = document.createElement("div");
  elementoPersonaje.classList.add("personajes-contenedor");
  const imagen = crearElementoImagen(
    `http://localhost:3000/${personaje.imagen}`,
    personaje.nombre
  );
  elementoPersonaje.appendChild(imagen);
  const infoPersonaje = document.createElement("div");
  infoPersonaje.classList.add("contenedor-info-personaje");

  const nombre = crearElementoParrafo("Nombre", personaje.nombre);
  infoPersonaje.appendChild(nombre);
  const especialidad = crearElementoParrafo(
    "Especialidad",
    personaje.especialidad
  );
  infoPersonaje.appendChild(especialidad);
  const habilidades = crearElementoParrafo(
    "Habilidades",
    personaje.habilidades.join(", ")
  );
  infoPersonaje.appendChild(habilidades);
  elementoPersonaje.appendChild(infoPersonaje);

  return elementoPersonaje;
};


//Obtener el valor del campo de texto

const obtenerValorCampo = (campo: string): string => {
  const elementoCampo = document.querySelector(`#${campo}`);

  if (
    (elementoCampo && elementoCampo instanceof HTMLInputElement) ||
    (elementoCampo && elementoCampo instanceof HTMLTextAreaElement)
  ) {
    return elementoCampo.value;
  } else {
    throw new Error(`No se ha encontrado el campo ${campo}`);
  }
};

//Filtrar los personajes por el valor del campo de texto

const filtrarPersonajes = async (): Promise<Personaje[]> => {
  const texto = obtenerValorCampo("name");
  const personajes = await obtenerPersonajes();
  const personajesFiltrados = personajes.filter((personaje) =>
    personaje.nombre.toLowerCase().includes(texto.toLowerCase())
  );
  return personajesFiltrados;
};

// Pintar los personajes filtrados en la UI

const pintarPersonajes = async (personajes: Personaje[]): Promise<void> => {
  const listado = document.querySelector("#listado-personajes");
  if (listado && listado instanceof HTMLDivElement) {
    listado.innerHTML = "";
    personajes.forEach((personaje) => {
      const tarjetaPersonaje = crearTarjetaPersonaje(personaje);
      listado.appendChild(tarjetaPersonaje);
    });
  } else {
    throw new Error("No se ha encontrado el contenedor del listado");
  }
};


//Evento

document.addEventListener("DOMContentLoaded", async () => {
  const personajes = await filtrarPersonajes();
  pintarPersonajes(personajes);

  const formulario = document.querySelector("#formulario");
  if (formulario && formulario instanceof HTMLFormElement) {
    formulario.addEventListener("submit", async (evento: Event) => {
      evento.preventDefault();
      const personajesFiltrados = await filtrarPersonajes();
      pintarPersonajes(personajesFiltrados);
    });
  }
});
