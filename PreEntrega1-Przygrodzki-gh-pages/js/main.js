import { modal, main, btnCreate, btnSave, btnCancel, form, inputSearch, tareaContainer, fechaNota } from './variables.js';

let textoBuscado = '';

// Array contenedor de las tareas
const tareas = localStorage.getItem('tareas') ? JSON.parse(localStorage.getItem('tareas')) : [];

modal.style.display = 'none';

async function mostrarTareas() {
  tareaContainer.innerHTML = '';

  // Cargando las notitas desde localStorage
  for (let i = tareas.length - 1; i >= 0; i--) {
    const tareaTexto = tareas[i];
    crearYAgregarTarea(tareaTexto);
  }

  // Trayendo las notitas de tareas.json
  try {
    const response = await fetch('tareas.json'); 
    
    if (!response.ok) {
      throw new Error('Error al cargar tareas.json');
    }

    const data = await response.json();

    console.log(response)

    data.forEach((tareaTexto) => {
      crearYAgregarTarea(tareaTexto);
    });

    } catch (error) {
        console.error(error);
    }
}


// crear y agregar una tarea al DOM
function crearYAgregarTarea(tareaTexto) {
    const nuevoItemTarea = document.createElement('div');
    nuevoItemTarea.className = 'tareas__lista animate__animated animate__zoomIn';
    nuevoItemTarea.innerHTML = `
      <div class="tarea">
        <div class="tarea__items">
          <label class="tarea__label">${tareaTexto}</label>
          <input class="tarea__input-edit" type="text">
          <button class="btn__edit"></button>
          <button class="btn__save-edit">save</button>
          <button class="btn__delete"></button>
        </div>
      </div>
    `;
  
    tareaContainer.appendChild(nuevoItemTarea);
  
    const btnEdit = nuevoItemTarea.querySelector('.btn__edit');
    const btnSaveEdit = nuevoItemTarea.querySelector('.btn__save-edit');
    const btnDelete = nuevoItemTarea.querySelector('.btn__delete');
    const tareaLabel = nuevoItemTarea.querySelector('.tarea__label');
    const tareaInputEdit = nuevoItemTarea.querySelector('.tarea__input-edit');
  
    btnSaveEdit.style.display = 'none';
    tareaInputEdit.style.display = 'none';
  
    btnEdit.addEventListener('click', function () {
      tareaLabel.style.display = 'none';
      tareaInputEdit.style.display = '';
      btnEdit.style.display = 'none';
      btnSaveEdit.style.display = '';
      tareaInputEdit.value = tareaLabel.textContent;
    });
  
    // Botón Editar
    btnSaveEdit.addEventListener('click', function () {
    const editarTextoTarea = tareaInputEdit.value.trim();
        if (editarTextoTarea !== '') {
            const index = tareas.indexOf(tareaTexto);
            tareas[index] = editarTextoTarea;
            localStorage.setItem('tareas', JSON.stringify(tareas));

            // mostrar modal sweetalert 'notita editada :D'
            mostrarTareas();
        }
    });
  
    btnDelete.addEventListener('click', function () {
      Swal.fire({
          title: '¿Seguro que deseas eliminar esta notita?',
          text: "Esta acción no se puede deshacer D:",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminalo.'
      }).then((result) => {
          if (result.isConfirmed) {
              const index = tareas.indexOf(tareaTexto);
              tareas.splice(index, 1);
              localStorage.setItem('tareas', JSON.stringify(tareas));
              mostrarTareas();
              Swal.fire('Tarea eliminada ☑️', '', '✅');
          }
      });
  });


  }
  

// Boton Crear
btnCreate.addEventListener('click', function () {
  modal.style.display = '';
  main.style.filter = 'blur(20px)';
});

btnCancel.addEventListener('click', function () {
  modal.style.display = 'none';
  main.style.filter = 'none';
});

// Boton Guardar
btnSave.addEventListener('click', function () {
  const nuevaTareaTexto = document.getElementById('nueva-nota-nombre').value;

  if (nuevaTareaTexto.trim() !== '') {
    tareas.push(nuevaTareaTexto);
    document.getElementById('nueva-nota-nombre').value = '';
    localStorage.setItem('tareas', JSON.stringify(tareas));
    modal.style.display = 'none';
    main.style.filter = 'none';
    mostrarTareas();
  }
});

// Busqueda por letra/nombre de cada tarea
inputSearch.addEventListener('keyup', function () {
  textoBuscado = inputSearch.value;
  const tareasCargadas = Array.from(document.querySelectorAll('.tareas__lista'));

  tareasCargadas.forEach((div) => {
    const label = div.querySelector('.tarea__label');

    if (label.textContent.toLowerCase().includes(textoBuscado.toLowerCase())) {
      div.style.display = '';
    } else {
      div.style.display = 'none';
    }
  });
});

// Previene la recarga de la página al enviar el formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const nuevaTareaTexto = document.getElementById('nueva-nota-nombre').value;

  if (nuevaTareaTexto.trim() !== '') {
    tareas.push(nuevaTareaTexto);
    document.getElementById('nueva-nota-nombre').value = '';
    localStorage.setItem('tareas', JSON.stringify(tareas));
    modal.style.display = 'none';
    main.style.filter = 'none';
    mostrarTareas();
  }
});

// Mostrar fecha actual
function mostrarFecha() {
  let fecha = new Date();
  fecha = fecha.toString().split(' ');
  fechaNota.innerHTML = fecha[2] + ' ' + fecha[1] + ' ' + fecha[3][2] + fecha[3][3];
}

// Llamar a mostrarTareas() al cargar la página
window.addEventListener('load', (event) => {
  mostrarTareas();
  mostrarFecha()
});
