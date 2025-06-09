/**
 * Aplicativo Ovelha High-tech
 * Sistema para cálculo de composição de ração ovina
 */

// Estado global da aplicação
const appState = {
  currentScreen: "welcome-screen",
  lotInfo: {
    name: "",
    averageWeight: 0,
  },
  selectedLifecycle: null,
  inputs: {
    corn: 0,
    soy: 0,
  },
}

// Dados dos ciclos de vida das ovelhas
const lifecycleData = [
  {
    id: "lamb",
    title: "Cordeiro",
    description: "Até 4 meses de idade",
    icon: "🐑",
    cornPercentage: 60,
    soyPercentage: 40,
    features: ["Alto teor proteico", "Fácil digestão", "Crescimento acelerado", "Minerais essenciais"],
  },
  {
    id: "young",
    title: "Jovem",
    description: "4 a 12 meses",
    icon: "🐏",
    cornPercentage: 70,
    soyPercentage: 30,
    features: ["Desenvolvimento muscular", "Transição alimentar", "Ganho de peso", "Fortalecimento ósseo"],
  },
  {
    id: "adult",
    title: "Adulto",
    description: "1 a 5 anos",
    icon: "🐑",
    cornPercentage: 65,
    soyPercentage: 35,
    features: ["Manutenção corporal", "Reprodução ativa", "Produção de lã", "Energia balanceada"],
  },
  {
    id: "senior",
    title: "Idoso",
    description: "Acima de 5 anos",
    icon: "🐏",
    cornPercentage: 55,
    soyPercentage: 45,
    features: ["Digestão facilitada", "Cuidados especiais", "Menor atividade", "Suporte nutricional"],
  },
]

/**
 * Navega entre as telas da aplicação
 * @param {string} screenId - ID da tela de destino
 */
function navigateToScreen(screenId) {
  // Salva dados da tela atual antes de navegar
  if (appState.currentScreen === "lot-info-screen") {
    saveLotInfo()
  } else if (appState.currentScreen === "inputs-screen") {
    saveInputsInfo()
  }

  // Esconde todas as telas
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active")
  })

  // Mostra a tela selecionada
  document.getElementById(screenId).classList.add("active")
  appState.currentScreen = screenId

  // Executa ações específicas para cada tela
  if (screenId === "lifecycle-screen") {
    renderLifecycleCards()
  }
}

/**
 * Salva as informações do lote no estado da aplicação
 */
function saveLotInfo() {
  const lotName = document.getElementById("lot-name").value
  const averageWeight = document.getElementById("average-weight").value

  if (lotName) appState.lotInfo.name = lotName
  if (averageWeight) appState.lotInfo.averageWeight = Number.parseFloat(averageWeight)
}

/**
 * Renderiza os cards de ciclo de vida das ovelhas
 */
function renderLifecycleCards() {
  const container = document.getElementById("lifecycle-carousel")
  container.innerHTML = ""

  lifecycleData.forEach((lifecycle) => {
    const card = createLifecycleCard(lifecycle)
    container.appendChild(card)
  })
}

/**
 * Cria um card de ciclo de vida
 * @param {Object} lifecycle - Dados do ciclo de vida
 * @returns {HTMLElement} - Elemento do card
 */
function createLifecycleCard(lifecycle) {
  const card = document.createElement("div")
  card.className = "lifecycle-card"
  card.onclick = () => selectLifecycle(lifecycle.id)

  const featuresHTML = lifecycle.features.map((feature) => `<li>${feature}</li>`).join("")

  card.innerHTML = `
    <div class="card-image">
      <div class="card-icon">${lifecycle.icon}</div>
    </div>
    <div class="card-content">
      <h3 class="card-title">${lifecycle.title}</h3>
      <p class="card-description">${lifecycle.description}</p>
      <ul class="card-features">
        ${featuresHTML}
      </ul>
      <button class="card-select-btn" onclick="event.stopPropagation(); selectLifecycle('${lifecycle.id}')">
        Selecionar
      </button>
    </div>
  `

  return card
}

/**
 * Seleciona um ciclo de vida específico
 * @param {string} lifecycleId - ID do ciclo de vida selecionado
 */
function selectLifecycle(lifecycleId) {
  // Remove seleção anterior
  document.querySelectorAll(".lifecycle-card").forEach((card) => {
    card.classList.remove("selected")
  })

  // Encontra e seleciona o card correto
  const cards = document.querySelectorAll(".lifecycle-card")
  const selectedIndex = lifecycleData.findIndex((l) => l.id === lifecycleId)

  if (selectedIndex !== -1 && cards[selectedIndex]) {
    cards[selectedIndex].classList.add("selected")

    // Scroll suave para centralizar o card selecionado
    const container = document.querySelector(".carousel-container")
    const cardWidth = 300 // 280px + 20px gap
    const scrollPosition = selectedIndex * cardWidth

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })
  }

  // Salva no estado
  appState.selectedLifecycle = lifecycleData.find((l) => l.id === lifecycleId)
}

/**
 * Calcula a composição da ração e exibe o relatório
 */
function calculateAndShowReport() {
  // Salva os valores dos insumos
  const cornAmount = Number.parseFloat(document.getElementById("corn-amount").value) || 0
  const soyAmount = Number.parseFloat(document.getElementById("soy-amount").value) || 0

  appState.inputs.corn = cornAmount
  appState.inputs.soy = soyAmount

  // Calcula as porcentagens baseadas no ciclo de vida selecionado
  let cornPercentage = 65 // Valor padrão
  let soyPercentage = 35 // Valor padrão

  if (appState.selectedLifecycle) {
    cornPercentage = appState.selectedLifecycle.cornPercentage
    soyPercentage = appState.selectedLifecycle.soyPercentage
  }

  // Atualiza o relatório
  updateReport(cornPercentage, soyPercentage)

  // Navega para a tela de relatório
  navigateToScreen("report-screen")
}

/**
 * Atualiza os dados do relatório na tela final
 * @param {number} cornPercentage - Porcentagem de milho
 * @param {number} soyPercentage - Porcentagem de farelo de soja
 */
function updateReport(cornPercentage, soyPercentage) {
  document.getElementById("report-lot-name").textContent = `Lote: ${appState.lotInfo.name || "Não informado"}`

  document.getElementById("report-weight").textContent = `Peso médio: ${appState.lotInfo.averageWeight || 0} kg`

  document.getElementById("report-lifecycle").textContent =
    `Fase: ${appState.selectedLifecycle?.title || "Não selecionada"}`

  document.getElementById("corn-percentage").textContent = `${cornPercentage}%`
  document.getElementById("soy-percentage").textContent = `${soyPercentage}%`
}

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Ovelha High-tech App iniciado")

  // Configura eventos de formulário para prevenir submit padrão
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
    })
  })

  // Configura validação em tempo real dos inputs
  setupInputValidation()
})

/**
 * Configura validação em tempo real para os campos de entrada
 */
function setupInputValidation() {
  const inputs = document.querySelectorAll('input[type="number"]')

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value < 0) {
        this.value = 0
      }
    })
  })
}

/**
 * Navega para editar informações do lote mantendo dados preenchidos
 */
function editLotInfo() {
  // Preenche os campos com os dados atuais
  document.getElementById("lot-name").value = appState.lotInfo.name || ""
  document.getElementById("average-weight").value = appState.lotInfo.averageWeight || ""

  navigateToScreen("lot-info-screen")
}

/**
 * Navega para editar o ciclo de vida mantendo seleção atual
 */
function editLifecycle() {
  navigateToScreen("lifecycle-screen")

  // Aguarda a renderização dos cards e então restaura a seleção
  setTimeout(() => {
    if (appState.selectedLifecycle) {
      const cards = document.querySelectorAll(".lifecycle-card")
      cards.forEach((card, index) => {
        if (lifecycleData[index].id === appState.selectedLifecycle.id) {
          card.classList.add("selected")
        }
      })
    }
  }, 100)
}

/**
 * Navega para editar os insumos mantendo valores atuais
 */
function editInputs() {
  // Preenche os campos com os dados atuais
  document.getElementById("corn-amount").value = appState.inputs.corn || ""
  document.getElementById("soy-amount").value = appState.inputs.soy || ""

  navigateToScreen("inputs-screen")
}

/**
 * Salva as informações dos insumos no estado da aplicação
 */
function saveInputsInfo() {
  const cornAmount = Number.parseFloat(document.getElementById("corn-amount").value) || 0
  const soyAmount = Number.parseFloat(document.getElementById("soy-amount").value) || 0

  appState.inputs.corn = cornAmount
  appState.inputs.soy = soyAmount
}
