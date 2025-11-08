describe('Pruebas completas de botones flotantes y ChatBot', () => {

    beforeEach(() => {
        // 👇 Cambia la ruta según donde esté tu página
        cy.visit('http://192.168.56.1:8080')
    })

    // 🟢 --- BOTÓN DE WHATSAPP ---
    it('Verifica el botón de WhatsApp y su enlace', () => {
        cy.log('✅ Verificando botón de WhatsApp...')
        cy.get('.btn-whatsapp')
            .should('be.visible')
            .and('have.attr', 'href')
            .and('include', 'https://wa.me/573144230347')

        cy.get('.btn-whatsapp')
            .should('have.attr', 'target', '_blank')
    })

    // 🌙 --- MODO OSCURO / CLARO ---
    it('Activa y desactiva el modo oscuro', () => {
        cy.log('🌗 Probando modo oscuro...')
        cy.get('#darkModeToggle').should('be.visible').click()

        // Verifica que el modo oscuro se haya aplicado (ajusta la clase según tu CSS)
        cy.get('body').should('have.class', 'dark-mode')

        cy.wait(500)

        // Cambia de nuevo al modo claro
        cy.get('#darkModeToggle').click()
        cy.get('body').should('not.have.class', 'dark-mode')
    })

    // 🤖 --- CHATBOT ---
    it('Abre el ChatBot, envía un mensaje y lo cierra', () => {
        cy.log('💬 Probando ChatBot...')

        // Abre el ChatBot
        cy.get('.btn-chat').should('be.visible').click()

        // Verifica que el panel esté visible
        cy.get('#chatbot-panel').should('be.visible')

        // Escribe un mensaje
        cy.get('#chatbot-input').type('Hola ChatBot, ¿cómo estás?')

        // Envía el mensaje
        cy.get('#chatbot-send').click()

        // Verifica que el mensaje aparezca en el contenedor
        cy.get('#chatbot-messages').should('contain.text', 'Hola ChatBot')

        // Cierra el ChatBot
        cy.get('#close-chatbot').click()
        cy.get('#chatbot-panel').should('not.be.visible')
    })

    // 🧩 --- TODO EN FLUJO SECUENCIAL ---
    it('Ejecuta el flujo completo: modo oscuro → abrir chatbot → enviar mensaje → abrir WhatsApp', () => {
        cy.log('🚀 Iniciando flujo completo de pruebas...')

        // 1️⃣ Activa modo oscuro
        cy.get('#darkModeToggle').click()
        cy.get('body').should('have.class', 'dark-mode')

        // 2️⃣ Abre ChatBot
        cy.get('.btn-chat').click()
        cy.get('#chatbot-panel').should('be.visible')

        // 3️⃣ Envía un mensaje al ChatBot
        cy.get('#chatbot-input').type('Probando el flujo completo 🔥')
        cy.get('#chatbot-send').click()
        cy.get('#chatbot-messages').should('contain.text', 'Probando el flujo completo')

        // 4️⃣ Cierra ChatBot
        cy.get('#close-chatbot').click()
        cy.get('#chatbot-panel').should('not.be.visible')

        // 5️⃣ Abre el botón de WhatsApp (verifica link)
        cy.get('.btn-whatsapp')
            .should('have.attr', 'href')
            .and('include', 'https://wa.me/573144230347')

        // 6️⃣ Desactiva modo oscuro
        cy.get('#darkModeToggle').click()
        cy.get('body').should('not.have.class', 'dark-mode')
    })
})
