// aula 05
// criar a variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de pratas na modal
let quantpratas = 1

let cart = [] // carrinho
// /aula 05

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.prataWindowArea').style.opacity = 0 // transparente
    seleciona('.prataWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.prataWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.prataWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.prataWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.prataInfo--cancelButton, .prataInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDaspratas = (prataItem, item, index) => {
    // aula 05
    // setar um atributo para identificar qual elemento foi clicado
	prataItem.setAttribute('data-key', index)
    prataItem.querySelector('.prata-item--img img').src = item.img
    prataItem.querySelector('.prata-item--price').innerHTML = formatoReal(item.price[2])
    prataItem.querySelector('.prata-item--name').innerHTML = item.name
    prataItem.querySelector('.prata-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.prataBig img').src = item.img
    seleciona('.prataInfo h1').innerHTML = item.name
    seleciona('.prataInfo--desc').innerHTML = item.description
    seleciona('.prataInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

// aula 05
const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .prata-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.prata-item').getAttribute('data-key')
    console.log('prata clicada ' + key)
    console.log(prataJson[key])

    // garantir que a quantidade inicial de pratas é 1
    quantpratas = 1

    // Para manter a informação de qual prata foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.prataInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.prataInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = prataJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.prataInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.prataInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.prataInfo--actualPrice').innerHTML = formatoReal(prataJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.prataInfo--qtmais').addEventListener('click', () => {
        quantpratas++
        seleciona('.prataInfo--qt').innerHTML = quantpratas
    })

    seleciona('.prataInfo--qtmenos').addEventListener('click', () => {
        if(quantpratas > 1) {
            quantpratas--
            seleciona('.prataInfo--qt').innerHTML = quantpratas	
        }
    })
}
// /aula 05

// aula 06
const adicionarNoCarrinho = () => {
    seleciona('.prataInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual prata? pegue o modalKey para usar prataJson[modalKey]
    	console.log("prata " + modalKey)
    	// tamanho
	    let size = seleciona('.prataInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantpratas)
        // preco
        let price = seleciona('.prataInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = prataJson[modalKey].id+'t'+size

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantpratas
        } else {
            // adicionar objeto prata no carrinho
            let prata = {
                identificador,
                id: prataJson[modalKey].id,
                size, // size: size
                qt: quantpratas,
                price: parseFloat(price) // price: price
            }
            cart.push(prata)
            console.log(prata)
            console.log('Sub total R$ ' + (prata.qt * prata.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let prataItem = prataJson.find( (item) => item.id == cart[i].id )
			console.log(prataItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let prataSizeName = cart[i].size

			let prataName = `${prataItem.name} `

			// preencher as informacoes
			cartItem.querySelector('img').src = prataItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = prataName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

// /aula 06

// MAPEAR prataJson para gerar lista de pratas
prataJson.map((item, index ) => {
    //console.log(item)
    let prataItem = document.querySelector('.models .prata-item').cloneNode(true)
    //console.log(prataItem)
    //document.querySelector('.prata-area').append(prataItem)
    seleciona('.prata-area').append(prataItem)

    // preencher os dados de cada prata
    preencheDadosDaspratas(prataItem, item, index)
    
    // prata clicada
    prataItem.querySelector('.prata-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na prata')

        // aula 05
        let chave = pegarKey(e)
        // /aula 05

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // aula 05
        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.prataInfo--qt').innerHTML = quantpratas

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
        // /aula 05

    })

    botoesFechar()

}) // fim do MAPEAR prataJson para gerar lista de pratas

// aula 05
// mudar quantidade com os botoes + e -
mudarQuantidade()
// /aula 05

// aula 06
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
// /aula 06
