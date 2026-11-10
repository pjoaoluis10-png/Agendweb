import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const services = [
  { name: 'Corte de cabelo', duration: '30 min', price: 45 },
  { name: 'Barba', duration: '20 min', price: 30 },
  { name: 'Corte + barba', duration: '50 min', price: 65 },
  { name: 'Hidratação', duration: '40 min', price: 55 },
]

const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
const today = new Date()
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
let appointments = JSON.parse(localStorage.getItem('agendweb-appointments') || '[]')
let selectedService = services[0].name
let bookedTimes = []

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="brand" href="#"><span class="brand-mark">A</span> agend<span>web</span></a>
    <nav><a href="#agendar">Agendar</a><a href="#meus-horarios">Meus horários</a></nav>
    <a class="top-cta" href="#agendar">Fazer agendamento <span>↗</span></a>
  </header>
  <main>
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><i></i> SEU TEMPO, DO SEU JEITO</span>
        <h1>Seu próximo<br>momento de <em>cuidado.</em></h1>
        <p>Escolha o serviço, encontre o melhor horário e deixe o resto com a gente. Agendar nunca foi tão simples.</p>
        <a class="primary-button" href="#agendar">Agendar agora <span>→</span></a>
        <div class="hero-note"><span class="avatars">● ● ●</span> <span>Rápido, simples e sem complicação</span></div>
      </div>
      <div class="hero-art" aria-label="Ilustração abstrata de uma agenda">
        <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
        <div class="calendar-card">
          <div class="calendar-head"><span>SEU DIA</span><span class="calendar-dot">✳</span></div>
          <div class="calendar-date">12 <small>QUARTA-FEIRA</small></div>
          <div class="calendar-line"></div>
          <div class="calendar-event"><b>10:30</b><span><i></i> Corte de cabelo</span></div>
          <div class="calendar-event"><b>14:00</b><span><i></i> Barba</span></div>
          <div class="calendar-event muted"><b>16:30</b><span><i></i> Seu próximo horário</span></div>
          <div class="calendar-footer">TUDO ORGANIZADO. ✨</div>
        </div>
        <div class="floating-star">✳</div><div class="floating-label">HORÁRIO<br>CONFIRMADO ✓</div>
      </div>
    </section>
    <section class="booking-section" id="agendar">
      <div class="section-heading"><div><span class="eyebrow">VAMOS COMEÇAR</span><h2>Faça seu <em>agendamento.</em></h2></div><span class="step-label">01 — 03</span></div>
      <div class="booking-layout">
        <form id="booking-form" class="booking-card">
          <div class="form-block">
            <div class="form-title"><span class="number">01</span><div><h3>Seus dados</h3><p>Como podemos chamar você?</p></div></div>
            <label for="customer">Nome completo</label><input id="customer" name="customer" placeholder="Ex.: João Silva" required minlength="2" />
            <label for="phone">Telefone</label><input id="phone" name="phone" type="tel" placeholder="(85) 99999-9999" required />
          </div>
          <div class="form-block">
            <div class="form-title"><span class="number">02</span><div><h3>Escolha o serviço</h3><p>O que você deseja fazer hoje?</p></div></div>
            <div class="service-options">
              ${services.map((service, index) => `
                <label class="service-option ${index === 0 ? 'selected' : ''}">
                  <input type="radio" name="service" value="${service.name}" ${index === 0 ? 'checked' : ''}>
                  <span class="service-info"><b>${service.name}</b><small>${service.duration}</small></span>
                  <strong>R$ ${service.price.toFixed(2).replace('.', ',')}</strong>
                </label>`).join('')}
            </div>
          </div>
          <div class="form-block last-block">
            <div class="form-title"><span class="number">03</span><div><h3>Data e horário</h3><p>Escolha quando fica melhor para você.</p></div></div>
            <label for="date">Data do atendimento</label>
            <input id="date" name="date" type="date" min="${localDate}" value="${localDate}" required />
            <label for="time">Horário disponível</label>
            <div class="time-grid" id="time-grid">${times.map(time => `<button type="button" class="time-option" data-time="${time}">${time}</button>`).join('')}</div>
            <input type="hidden" name="time" id="selected-time" required />
            <p id="availability-message" class="form-message" role="status">Consultando horários...</p>
          </div>
          <button class="submit-button" type="submit">Confirmar agendamento <span>→</span></button>
          <p class="form-disclaimer">Seu agendamento será salvo online.</p>
          <p id="form-message" class="form-message" role="status"></p>
        </form>
        <aside class="booking-aside">
          <div class="aside-card dark-card"><span class="aside-icon">✳</span><span class="eyebrow">AGENDWEB</span><h3>Um bom serviço começa com um bom horário.</h3><p>Organize sua rotina e reserve um momento para você.</p><div class="aside-divider"></div><div class="aside-detail"><span>◷</span><div><b>Segunda a sábado</b><small>09h às 18h</small></div></div><div class="aside-detail"><span>⌖</span><div><b>Atendimento com hora marcada</b><small>Sem filas, sem espera.</small></div></div></div>
          <div class="help-card"><span>Precisa de ajuda?</span><p>Entre em contato com nosso atendimento.</p><a href="mailto:contato@agendweb.com">contato@agendweb.com ↗</a></div>
        </aside>
      </div>
    </section>
    <section class="appointments-section" id="meus-horarios">
      <div class="section-heading"><div><span class="eyebrow">SUA AGENDA NESTE DISPOSITIVO</span><h2>Seus próximos <em>horários.</em></h2></div><span class="appointment-count" id="appointment-count">0 agendamentos</span></div>
      <div id="appointments-list" class="appointments-list"></div>
    </section>
  </main>
  <footer><a class="brand" href="#"><span class="brand-mark">A</span> agend<span>web</span></a><span>Organize seu tempo. Aproveite seu dia.</span><span>© 2026 AgendWeb</span></footer>
`

function saveAppointments() {
  localStorage.setItem('agendweb-appointments', JSON.stringify(appointments))
}

function renderAppointments() {
  const list = document.querySelector('#appointments-list')
  document.querySelector('#appointment-count').textContent = `${appointments.length} ${appointments.length === 1 ? 'agendamento' : 'agendamentos'}`
  if (!appointments.length) {
    list.innerHTML = '<div class="empty-state"><span>▦</span><b>Nenhum horário por enquanto</b><p>Os agendamentos feitos neste dispositivo aparecerão aqui.</p></div>'
    return
  }
  list.innerHTML = appointments.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).map(item => `
    <article class="appointment-item">
      <div class="appointment-date"><b>${item.date.split('-')[2]}</b><span>${new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()}</span></div>
      <div class="appointment-info"><b>${item.service}</b><span>${item.customer} · ${item.phone}</span></div>
      <div class="appointment-time"><b>${item.time}</b><span>${item.date.split('-').reverse().join('/')}</span></div>
    </article>`).join('')
}

function renderTimeButtons() {
  document.querySelectorAll('.time-option').forEach(button => {
    const unavailable = bookedTimes.includes(button.dataset.time)
    button.disabled = unavailable
    button.classList.toggle('unavailable', unavailable)
    if (unavailable && button.classList.contains('chosen')) {
      button.classList.remove('chosen')
      document.querySelector('#selected-time').value = ''
    }
  })
}

async function loadBookedTimes() {
  const date = document.querySelector('#date').value
  const info = document.querySelector('#availability-message')
  info.textContent = 'Consultando horários...'
  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('appointment_date', date)
    .eq('status', 'confirmed')
  if (error) {
    bookedTimes = []
    renderTimeButtons()
    info.textContent = 'Não foi possível consultar os horários. Tente atualizar a página.'
    console.error('Erro ao consultar horários:', error)
    return
  }
  bookedTimes = (data || []).map(item => String(item.appointment_time).slice(0, 5))
  renderTimeButtons()
  info.textContent = bookedTimes.length ? 'Os horários indisponíveis já estão reservados.' : 'Todos os horários estão disponíveis.'
}

document.querySelectorAll('input[name="service"]').forEach(input => {
  input.addEventListener('change', () => {
    selectedService = input.value
    document.querySelectorAll('.service-option').forEach(option => option.classList.toggle('selected', option.querySelector('input').checked))
  })
})

document.querySelector('#time-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-time]')
  if (!button || button.disabled) return
  document.querySelectorAll('.time-option').forEach(option => option.classList.remove('chosen'))
  button.classList.add('chosen')
  document.querySelector('#selected-time').value = button.dataset.time
})

document.querySelector('#date').addEventListener('change', () => {
  document.querySelector('#selected-time').value = ''
  document.querySelectorAll('.time-option').forEach(option => option.classList.remove('chosen'))
  loadBookedTimes()
})

document.querySelector('#booking-form').addEventListener('submit', async event => {
  event.preventDefault()
  const form = new FormData(event.currentTarget)
  const time = form.get('time')
  const date = form.get('date')
  const message = document.querySelector('#form-message')
  if (!time) {
    message.textContent = 'Selecione um horário disponível para continuar.'
    message.className = 'form-message error'
    return
  }
  if (bookedTimes.includes(time)) {
    message.textContent = 'Esse horário já foi reservado. Escolha outro, por favor.'
    message.className = 'form-message error'
    await loadBookedTimes()
    return
  }

  const { error } = await supabase.from('appointments').insert({
    customer_name: form.get('customer'),
    phone: form.get('phone'),
    service: form.get('service'),
    appointment_date: date,
    appointment_time: time,
    status: 'confirmed'
  })

  if (error) {
    message.textContent = error.code === '23505'
      ? 'Esse horário acabou de ser reservado. Escolha outro, por favor.'
      : 'Não foi possível confirmar. Verifique sua conexão e tente novamente.'
    message.className = 'form-message error'
    console.error('Erro ao salvar agendamento:', error)
    await loadBookedTimes()
    return
  }

  appointments.push({ id: crypto.randomUUID(), customer: form.get('customer'), phone: form.get('phone'), service: form.get('service'), date, time })
  saveAppointments()
  renderAppointments()
  event.currentTarget.reset()
  document.querySelector('#date').value = localDate
  document.querySelector('#selected-time').value = ''
  document.querySelectorAll('.time-option').forEach(option => option.classList.remove('chosen'))
  document.querySelectorAll('.service-option').forEach((option, index) => option.classList.toggle('selected', index === 0))
  document.querySelector('input[name="service"]').checked = true
  message.textContent = 'Agendamento confirmado e salvo online!'
  message.className = 'form-message success'
  await loadBookedTimes()
  document.querySelector('#meus-horarios').scrollIntoView({ behavior: 'smooth' })
})

renderAppointments()
loadBookedTimes()
