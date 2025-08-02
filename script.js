function reservarCita() {
    const popup = document.getElementById("popup");
    popup.style.display = "flex"; // Mostrar el Pop Up
  }
  
  function cerrarPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none"; // Ocultar el Pop Up
  }  
  
  const listaServicios = document.querySelectorAll('#lista-servicios li');
  const imagenServicio = document.getElementById('imagen-servicio');
  
  listaServicios.forEach(item => {
    item.addEventListener('mouseover', () => {
      const img = item.getAttribute('data-img');
      imagenServicio.style.backgroundImage = `url('img/${img}')`;
      imagenServicio.style.display = 'block';
    });
  
    item.addEventListener('mouseout', () => {
      imagenServicio.style.display = 'none';
      imagenServicio.style.backgroundImage = '';
    });
  });

  let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-img");
const carousel = document.querySelector(".carousel");
let autoSlideInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

function cambiarSlide(n) {
  currentSlide = (currentSlide + n + slides.length) % slides.length;
  showSlide(currentSlide);
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    cambiarSlide(1);
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

showSlide(currentSlide);
startAutoSlide();

document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fecha');
  const horaSelect = document.getElementById('hora');
  const form = document.getElementById('form-reserva');
  const nombreInput = document.getElementById('nombre');
  const correoInput = document.getElementById('correo');
  const servicioInput = document.getElementById('servicio');

  const toISOStringDate = date => date.toISOString().split('T')[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  fechaInput.setAttribute('min', toISOStringDate(today));
  fechaInput.setAttribute('max', toISOStringDate(maxDate));

  const mostrarTooltipError = (mensaje) => {
    const oldTooltip = document.getElementById('tooltip-error');
    if (oldTooltip) oldTooltip.remove();

    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip-error';
    tooltip.textContent = mensaje;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#f8d7da';
    tooltip.style.color = '#721c24';
    tooltip.style.border = '1px solid #f5c6cb';
    tooltip.style.borderRadius = '6px';
    tooltip.style.padding = '8px 12px';
    tooltip.style.fontSize = '14px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    tooltip.style.zIndex = '999';

    const rect = fechaInput.getBoundingClientRect();
    tooltip.style.top = `${window.scrollY + rect.top + rect.height / 2 - 20}px`;
    tooltip.style.left = `${window.scrollX + rect.right + 10}px`;

    document.body.appendChild(tooltip);

    fechaInput.classList.add('error-input');

    setTimeout(() => {
      tooltip.remove();
      fechaInput.classList.remove('error-input');
    }, 4000);
  };

  const mostrarMensajeExito = (mensaje) => {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.position = 'fixed';
    mensajeDiv.style.top = '20px';
    mensajeDiv.style.right = '20px';
    mensajeDiv.style.backgroundColor = '#d4edda';
    mensajeDiv.style.color = '#155724';
    mensajeDiv.style.border = '1px solid #c3e6cb';
    mensajeDiv.style.padding = '12px 20px';
    mensajeDiv.style.borderRadius = '6px';
    mensajeDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
    mensajeDiv.style.fontSize = '15px';
    mensajeDiv.style.zIndex = '9999';
    mensajeDiv.style.opacity = '0';
    mensajeDiv.style.transition = 'opacity 0.3s ease-in-out';

    document.body.appendChild(mensajeDiv);
    setTimeout(() => {
      mensajeDiv.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      mensajeDiv.style.opacity = '0';
      setTimeout(() => mensajeDiv.remove(), 300);
    }, 4000);
  };

  const generarHorasDisponibles = () => {
    horaSelect.innerHTML = '<option value="">-- Selecciona una hora --</option>';

    if (!fechaInput.value) return;

    const [year, month, day] = fechaInput.value.split('-');
    const fechaSeleccionada = new Date(year, month - 1, day);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < today || fechaSeleccionada > maxDate) {
      mostrarTooltipError('La fecha debe estar entre hoy y dentro de 7 días.');
      return;
    }

    const horaInicio = 10;
    const horaFin = 18;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let horaLimite;
    if (fechaSeleccionada.getTime() === hoy.getTime()) {
      const ahora = new Date();
      let minutos = ahora.getMinutes();
      let minutosRedondeados = Math.ceil(minutos / 15) * 15;
      let horas = ahora.getHours();

      if (minutosRedondeados === 60) {
        minutosRedondeados = 0;
        horas += 1;
      }

      horaLimite = { hora: horas, minutos: minutosRedondeados };
    } else {
      horaLimite = { hora: horaInicio, minutos: 0 };
    }

    for (let h = horaInicio; h <= horaFin; h++) {
      for (let m of [0, 15, 30, 45]) {
        if (h === horaFin && m > 0) continue;
        if (fechaSeleccionada.getTime() === hoy.getTime()) {
          if (h < horaLimite.hora || (h === horaLimite.hora && m < horaLimite.minutos)) continue;
        }

        const horaString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        horaSelect.innerHTML += `<option value="${horaString}">${horaString}</option>`;
      }
    }

    if (horaSelect.options.length === 1) {
      horaSelect.innerHTML += `<option disabled>No hay horas disponibles</option>`;
    }
  };

  if (fechaInput.value) generarHorasDisponibles();

  fechaInput.addEventListener('change', generarHorasDisponibles);

  form.addEventListener('submit', e => {
    e.preventDefault();

    const [year, month, day] = fechaInput.value.split('-');
    const fechaSeleccionada = new Date(year, month - 1, day);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < today || fechaSeleccionada > maxDate) {
      mostrarTooltipError('La fecha debe estar entre hoy y dentro de 7 días.');
      return;
    }

    const nombreValido = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombreInput.value);
    if (!nombreValido) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }

    const reserva = {
      nombre: nombreInput.value.trim(),
      correo: correoInput.value.trim(),
      servicio: servicioInput.value,
      fecha: fechaInput.value,
      hora: horaSelect.value
    };

    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservasGuardadas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservasGuardadas));

    mostrarMensajeExito('✅ ¡Tu cita ha sido agendada con éxito!');

    form.reset();
    horaSelect.innerHTML = '<option value="">-- Selecciona una hora --</option>';
  });
});