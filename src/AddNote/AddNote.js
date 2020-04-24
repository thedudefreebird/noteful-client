import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidateError from '../ValidateError'

class AddNote extends React.Component {
    constructor(props) {
        super(props)
        this.noteContentInput = React.createRef()
        this.noteFolderInput = React.createRef()
        this.noteNameInput = React.createRef()
    }

    static contextType = ApiContext

    static defaultProps ={
        addNote: () => {}
    }

    state = {
        name: {
        value: '',
        touched: false
        }
    }

    addNote(noteContent, noteFolder, noteName) {
        let date = new Date()
        fetch(`${config.API_ENDPOINT}/notes`, 
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
            },
            body: JSON.stringify({
                content: noteContent,
                date_published: date,
                folder_id: noteFolder,
                modified: date,
                name: noteName
            })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error
                    })
                }
                return res.json()
            })
            .then(note => {
                this.context.addNote(note)
                this.props.history.push('/')
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleSubmit(event) {
        event.preventDefault()
        const noteContent = this.noteContentInput.current.value
        const noteFolder = this.noteFolderInput.current.value
        const noteName = this.noteNameInput.current.value
        if (noteName.length >= 3) {
            this.addNote(noteContent, noteFolder, noteName)
        } else {
            this.noteNameInput.current.focus()
        }
    }

    updateName(noteName) {
        this.setState({name: {value: noteName, touched: true}})
    }

    validateName(noteName) {
        if (noteName.length === 0) {
            return(
                <div id='noteNameFeedback'>
                    Name is required to create note.
                </div>
            )
        } else if (noteName.length < 3) {
            return(
                <div id='noteNameFeedback'>
                    Name for note must be at least 3 characters long.
                </div>
            )
        }
    }

    render() {
        if (this.context.folders.length === 0) {
            return(
                <div className='folderPrompt'>
                    Please create a folder to begin adding notes.
                </div>
            )
        } else {
            let folderSelections =
            this.context.folders.map((folder) => {
                return(
                    <option value={folder.id} key={folder.id}>{folder.name}</option>
                )
            })
            return(
                <form className='addNote' onSubmit={e => this.handleSubmit(e)}>
                    <h2>Add a Note</h2>
                    <label htmlFor='noteName'>Note Name*</label>
                    <input 
                        type='text' 
                        name='noteName' 
                        id='noteName'
                        ref={this.noteNameInput} 
                        onChange={e => this.updateName(e.target.value)}
                        aria-label='Enter name for Note'
                        aria-required='true'
                        aria-describedby='noteNameFeedback'
                    />
                    {this.state.name.touched && (<ValidateError message={this.validateName(this.state.name.value)} />)}
                    <label htmlFor='noteContent'>Note Content</label>
                    <textarea name='noteContent' id='noteContent' ref={this.noteContentInput}></textarea>
                    <label htmlFor='noteFolder'>Folder</label>
                    <select
                        htmlFor='noteFolder'
                        id='noteFolder'
                        ref={this.noteFolderInput}
                        aria-label='Select a folder to store note'
                        aria-required='false'
                    >
                        {folderSelections}
                    </select>
                    <button 
                        type='submit'
                        className='submitButton'
                        onSubmit={this.handleSubmit}
                    >
                        Submit
                    </button>
                </form>
            )
        }
    }
}

export default AddNote