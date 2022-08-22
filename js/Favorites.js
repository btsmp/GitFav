/* 
--- Esquema da aplicação --

- Atualizar a lista de favoritos toda vez que for adicionado ou removido um novo usuário.

- *Ataulizar* irá consistir em excluir todas os itens e adicionar novamente com o item faltante ou adicionado

- Os usuários ficaram guardados em uma lista, [{nome, login, ...}, {nome, login, ...}].

- Separativa em classes para dividir melhor as funções de cada parte de código.

*/

// classe que irá lidar com dados
import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector('table tbody')
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-users:')) || []
    }

    save() {
        localStorage.setItem('@github-users:', JSON.stringify(this.entries))
    }


    async add(username) {
        try {

            const userExists = this.entries.find(entry =>  entry.login == username)
            const user = await GithubUser.search(username)

            if (userExists) {
                throw new Error('Usuário já cadastrado')
            }

            if (user.login === undefined) {

                throw new Error('Usuário não encontrado!')

            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {

            alert(error.message)

        }
    }

    delete(user) {
        this.entries = this.entries
            .filter(entry => entry.login !== user.login)
        this.update()
        this.save()
    }
}

// classe que irá montar o html e cuidar da visualização


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.update()
        this.load()
        this.onadd()
    }

    async onadd() {
        const searchButton = this.root.querySelector('.search')
        
        searchButton.onclick = () => {

            const inputArea = this.root.querySelector('#input')

            this.add(inputArea.value)

            inputArea.value = ''
        }
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }


    update() {
        this.removeAllTr()

        this.entries.forEach((user) => {

            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/users/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm("Tem certeza que deseja remover esse usuário?")

                if (isOk) {
                    this.delete(user) // criar função de deletar dado
                }
            }
            this.tbody.append(row)
        })

    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML =
            `
        <td class="user">
           
            <img src="" alt="">
            
            <a href="">
                <p></p>
                <span>/</span>
            </a>
        </td>
        
        <td class="repositories">
        </td>
        
        <td class="followers">
        </td>
       
        <td class="remove">
        Remover
        </td>
        `

        return tr
    }

}
