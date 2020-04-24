import React from  'react'
import ApiContext from '../ApiContext'
import config from '../config'
import EditNoteForm from './EditNoteForm'

class EditNote extends React.Component {
    constructor(props) {
        super(props)
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    static contextType = ApiContext

    state = {
        id: null,
        name: null,
        content: null
    }

    componentDidMount() {
        const { noteId } = this.props.match.params
        fetch(`${config.API_ENDPOINT}/notes/${noteId}`, 
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                  }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
                return res.json()

            })
            .then(note => {
                this.setState({
                    id: noteId,
                    name: note.name,
                    content: note.content,
                })
            })
            .catch(error => {
                console.error(error)
            })
    }

    handleChangeName = value => {
        this.setState({
            name: value
        })
    }

    handleChangeContent = value => {
        this.setState({
            content: value
        })
    }

    handleSubmit = () => {
        const { id, name, content } = this.state
        const newNote = { id, name, content }
        const { noteId } = this.props.match.params
        fetch(config.API_ENDPOINT + `/notes/${noteId}`, 
        {
            method: 'PATCH',
            body: JSON.stringify(newNote),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
            })
            .then(() => {
                this.context.updateNote(newNote)
                this.props.history.push('/')
            })
            .catch(error => {
                console.error(error)
            })
    }

    render() {
        const { id, name, content } = this.state
        const note = { id, name, content }
        return (
        <section className='EditNote'>
            <h2>Edit note</h2>
            {id && (
            <EditNoteForm
                onSubmit={this.handleSubmit}
                onNameChange={this.handleChangeName}
                onContentChange={this.handleChangeContent}
                note={note}
            />
            )}
        </section>
        )
    }
}

export default EditNote