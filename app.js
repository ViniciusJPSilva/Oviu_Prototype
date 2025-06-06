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
  },
  {
    id: "young",
    title: "Jovem",
    description: "4 a 12 meses",
    icon: "🐏",
    cornPercentage: 70,
    soyPercentage: 30,
  },
  {
    id: "adult",
    title: "Adulto",
    description: "1 a 5 anos",
    icon: "🐑",
    cornPercentage: 65,
    soyPercentage: 35,
  },
  {
    id: "senior",
    title: "Idoso",
    description: "Acima de 5 anos",
    icon: "🐏",
    cornPercentage: 55,
    soyPercentage: 45,
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
  card.className = "lifecycle-card bg-white rounded-lg shadow-md p-6 border-2 border-gray-200"
  card.onclick = () => selectLifecycle(lifecycle.id)

  card.innerHTML = `
        <div class="flex items-center space-x-4">
            <div class="text-4xl">${lifecycle.icon}</div>
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">${lifecycle.title}</h3>
                <p class="text-gray-600 text-sm">${lifecycle.description}</p>
            </div>
            <div class="card-border w-6 h-6 rounded-full border-2 border-gray-300"></div>
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

  // Adiciona seleção ao card clicado
  event.currentTarget.classList.add("selected")

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
