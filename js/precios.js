"use strict";

document.addEventListener("DOMContentLoaded", iniciarPaginaPrecios);

function iniciarPaginaPrecios() {
    const CANT_INGRESOS = 3;
    const COSTO_DESTACADO = 99;

    const CANT_ITEM_PAGINACION = 5;

    let pagina_numero = 1;

    let estaFiltrando = false;

    const URL_SERVICIOS = "https://60be7ff7d03b43001792c8ed.mockapi.io/api/servicios";

    document.getElementById("p-tabla-nota-aviso").innerHTML = "En ROJO los valores mayores a " + COSTO_DESTACADO;

    let bodyServicios = document.getElementById("id-boby-servicios");
    let pRequerido = document.getElementById("p-valor-tabla-requerido");

    let paginaNumero = document.querySelector("#id-paginado");

    mostrarServicios();

    async function mostrarServicios(filtroServicio, filtroCostoDesde, filtroCostoHasta) {
        try {
            let res;
            if (estaFiltrando) {
                res = await fetch(URL_SERVICIOS);
            } else {
                res = await fetch(`${URL_SERVICIOS}/?p=${pagina_numero}&l=${CANT_ITEM_PAGINACION}`);
            }

            if (res.ok) {
                let servicios = await res.json();
                bodyServicios.innerHTML = '';

                paginaNumero.innerHTML = `Página ${pagina_numero}`;

                for (let item of servicios) {

                    /*for (let arg of arguments){
                        console.log(arg);
                        filtro = arg;
                    }*/

                    if ((!filtroServicio || ((item.servicio).toLowerCase()).includes(filtroServicio.toLowerCase()) ) && (!filtroCostoDesde || Number(filtroCostoDesde) <= item.costo) && (!filtroCostoHasta || Number(filtroCostoHasta) >= item.costo)) {
                        /*Se crea un elemento nuevo tr para la nueva fila*/
                        let tr = document.createElement("tr");
                        tr.classList.add("row-servicio");
                        if (item.costo > COSTO_DESTACADO) {
                            tr.classList.add("tabla-valor-superior");
                        }
                        let td = document.createElement("td");
                        td.innerHTML = `${item.id}`;
                        tr.appendChild(td);
                        /*Se crea un elemento td, dato con el servicio y lo agrego a la fila tr*/
                        td = document.createElement("td");
                        td.innerHTML = `${item.servicio}`;
                        tr.appendChild(td);
                        /*Se crea un elemento td, dato con el costo y lo agrego a la fila tr*/
                        td = document.createElement("td");
                        td.innerHTML = `${item.costo}`;
                        tr.appendChild(td);
                        /*Se crea un elemento td, además, se crea el elemento button para editar*/
                        let btnEditar = document.createElement("button");
                        btnEditar.classList.add("btnFila");
                        btnEditar.innerHTML = 'Editar';
                        //btnEditar.name = `Editar${item.id}`;
                        btnEditar.addEventListener("click", (event) => {
                            event.preventDefault;
                            editarFila(item.id, item.servicio);
                        });
                        td = document.createElement("td");
                        td.appendChild(btnEditar);
                        tr.appendChild(td);
                        /*Se crea un elemento td, además, se crea el elemento button para eliminar*/
                        let btnEliminar = document.createElement("button");
                        btnEliminar.classList.add("btnFila");
                        btnEliminar.innerHTML = 'Eliminar';
                        //btnEliminar.name = `Eliminar${item.id}`;
                        btnEliminar.addEventListener("click", (event) => {
                            event.preventDefault;
                            eliminarFila(item.id, item.servicio);
                        });
                        td = document.createElement("td");
                        td.appendChild(btnEliminar);
                        tr.appendChild(td);
                        /*Por último se agrega la fila a la tabla */
                        bodyServicios.appendChild(tr);
                    }
                }
            } else {
                pRequerido.innerHTML = 'Error en la conexión';
            }
        } catch (error) {
            pRequerido.innerHTML = 'Error en la conexión';
        }
    }

    async function editarFila(id, nombreServicio) {
        let inputServicio = document.getElementById("input-tabla-servicio");
        let inputCosto = document.getElementById("input-tabla-costo");

        if (inputServicio.value == null || inputServicio.value == "") {
            pRequerido.innerHTML = "Ingrese descricpión del servicio";
        } else {
            if (inputCosto.value == null || inputCosto.value == "") {
                pRequerido.innerHTML = "Ingrese costo para el servicio";
            }
            else {
                try {
                    pRequerido.innerHTML = "";
                    let servicio = { "servicio": inputServicio.value, "costo": inputCosto.value };
                    inputServicio.value = "";
                    inputCosto.value = "";
                    let res = await fetch(`${URL_SERVICIOS}/${id}`, {
                        "method": "PUT",
                        "headers": { "Content-type": "application/json" },
                        "body": JSON.stringify(servicio)
                    });
                    if (res.ok) {
                        pRequerido.innerHTML = `El servicio ${nombreServicio} fue Modificado con éxito!`;
                        filtrarServicios();
                    } else {
                        pRequerido.innerHTML = `No se pudo modificar el servicio ${nombreServicio} :( `;
                    }
                } catch (error) {
                    pRequerido.innerHTML = error;
                }
            }
        }
    }

    async function eliminarFila(id, servicio) {
        try {
            let res = await fetch(`${URL_SERVICIOS}/${id}`, {
                "method": "DELETE"
            });
            if (res.ok) {
                pRequerido.innerHTML = `El servicio ${servicio} fue Eliminado con éxito!`;
                filtrarServicios();
            } else {
                pRequerido.innerHTML = `No se pudo eliminar el servicio ${servicio} :( `;
            }
        } catch (error) {
            pRequerido.innerHTML = error;
        }
    }

    async function agregarServicio(servicio) {
        try {
            let res = await fetch(URL_SERVICIOS, {
                "method": "POST",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(servicio)
            });

            if (res.ok) {
                //if (res.status === 200 || res.status === 201) {
                pRequerido.innerHTML = `Se creo el servicio ${servicio.servicio} correctamente`;
                filtrarServicios();
            } else {
                pRequerido.innerHTML = `No se pudo crear el servicio`;
            }
        } catch (error) {
            pRequerido.innerHTML = 'Error en la conexión';
        }

    }

    /*Botón para agregar un nuevo servicio*/
    document.getElementById("btn-agregar-servicio").addEventListener("click", function (event) {
        event.preventDefault();
        let inputServicio = document.getElementById("input-tabla-servicio");
        let inputCosto = document.getElementById("input-tabla-costo");

        if (inputServicio.value == null || inputServicio.value == "") {
            pRequerido.innerHTML = "Ingrese descricpión del servicio";
        } else {
            if (inputCosto.value == null || inputCosto.value == "") {
                pRequerido.innerHTML = "Ingrese costo para el servicio";
            }
            else {
                pRequerido.innerHTML = "";
                let servicio = { "servicio": inputServicio.value, "costo": inputCosto.value };
                inputServicio.value = "";
                inputCosto.value = "";
                agregarServicio(servicio);
            }
        }

    });

    /*Se van a pedir todos los datos e eliminando uno por uno por id*/
    document.getElementById("btn-vaciar-tabla").addEventListener("click", vaciarTabla);
    async function vaciarTabla(event) {
        event.preventDefault();
        try {
            let resGET = await fetch(URL_SERVICIOS);
            if (resGET.ok) {
                let servicios = await resGET.json();
                bodyServicios.innerHTML = '';
                pagina_numero = 1;
                for (let item of servicios) {
                    try {
                        let resDelete = await fetch(`${URL_SERVICIOS}/${item.id}`, {
                            "method": "DELETE"
                        });

                        if (resDelete.ok) {
                            pRequerido.innerHTML = `Se eliminaron todos los servicios `;
                        } else {
                            pRequerido.innerHTML = `No se pudo eliminar los servicios`;
                        }
                    } catch (error) {
                        pRequerido.innerHTML = error;
                    }
                }
            }
            else {
                pRequerido.innerHTML = 'Error en la conexión para eliminar todos los servicios';
            }
        } catch (error) {
            pRequerido.innerHTML = error;
        }
    }

    /*Botón para genere N datos dentro de la tabla*/
    document.getElementById("btn-cant-ingresos").addEventListener("click", generarCantIngresos);
    function generarCantIngresos(event) {
        event.preventDefault();
        /*for (let i = 0; i < CANT_INGRESOS; i++) {
            let servicio = { "servicio": "Servicio" + i, "costo": i };
            agregarServicio(servicio);
        }*/
        /**Solución que habilitaron Javier y Nacho para que no se repitan los id y tirre error Mockappi*/
        let contador = CANT_INGRESOS;
        setInterval(() => {
            if (contador > 0) {
                let servicio = { "servicio": "Servicio" + contador, "costo": contador };
                agregarServicio(servicio);
                contador--;
            }
        }, 2500);
    }

    /* Funcionalidad para el filtrado de la tabla */
    let btnFiltrar = document.querySelector("#btn-filtrar");
    btnFiltrar.addEventListener("click", filtrarServicios);
    function filtrarServicios() {
        let filtroServicio = document.querySelector("#input-filtro-servicio");
        let filtroCostoDesde = document.querySelector("#input-filtro-costo-desde");
        let filtroCostoHasta = document.querySelector("#input-filtro-costo-hasta");
        if (filtroServicio.value || filtroCostoDesde.value || filtroCostoHasta.value) {
            estaFiltrando = true;
            pagina_numero = 1;
        }
        mostrarServicios(filtroServicio.value, filtroCostoDesde.value, filtroCostoHasta.value);
    }

    /* Funcionalidad para limpiar el filtro aplicado y volver a cargar la lista. */
    let btnLimpiarFiltro = document.querySelector("#btn-limpiar-filtro");
    btnLimpiarFiltro.addEventListener("click", (event) => {
        event.preventDefault();
        let filtroServicio = document.querySelector("#input-filtro-servicio");
        let filtroCostoDesde = document.querySelector("#input-filtro-costo-desde");
        let filtroCostoHasta = document.querySelector("#input-filtro-costo-hasta");
        filtroServicio.value = "";
        filtroCostoDesde.value = "";
        filtroCostoHasta.value = "";
        estaFiltrando = false;
        pagina_numero = 1;
        filtrarServicios();
    });

    /*Paginado*/
    let btnSiguiente = document.querySelector("#btn-siguiente");
    btnSiguiente.addEventListener("click", () => {
        sumarPagina(1);
    });

    let btnAnterior = document.querySelector("#btn-anterior");
    btnAnterior.addEventListener("click", () => {
        if (pagina_numero > 1) {
            sumarPagina(-1);
        }
    })

    function sumarPagina(pagina) {
        pagina_numero += pagina;
        filtrarServicios();
    }

}