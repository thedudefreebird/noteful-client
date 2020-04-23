import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import { findNote, findFolder} from '../notes-helpers'
import config from '../config'
//import EditNotePage from '../EditNote/EditNotePage'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import ApiContext from '../ApiContext'
import './App.css'

class App extends Component {
    state = {
        notes: [],
        folders: []
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/api/notes`),
            fetch(`${config.API_ENDPOINT}/api/folders`)
            ], 
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok) {
                    return notesRes.json().then(e => Promise.reject(e))
                }
                if (!foldersRes.ok) {
                    return foldersRes.json().then(e => Promise.reject(e))
                }
                return Promise.all([notesRes.json(), foldersRes.json()])
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders})
            })
            .catch(error => {
                console.error({error})
            })
      }

    addNote = note => {
        this.state.notes.push(note)
    }

    addFolder = folder => {
        this.state.folders.push(folder)
    }

    deleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        })
    }

    updateNote = updateNote => {
        const newNotes = this.state.notes.map(note =>
          (note.id === updateNote.id)
          ? updateNote
          : note
        )
        this.setState({
          notes: newNotes
        })
        this.fetchData()
      }

    renderNavRoutes() {
        const {notes, folders} = this.state
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NoteListNav
                                folders={folders}
                                notes={notes}
                                {...routeProps}
                            />
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params
                        const note = findNote(notes, noteId) || {}
                        const folder = findFolder(folders, note.folder_id)
                        return <NotePageNav {...routeProps} folder={folder} />
                    }}
                />
            </>
        )
    }

    renderMainRoutes() {
        const {notes} = this.state
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params
                            const notesForFolder = (!folderId) ? notes : notes.filter(note => `${note.folder_id}` === folderId)
                            return (
                                <NoteListMain
                                    {...routeProps}
                                    notes={notesForFolder}
                                />
                            )
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params
                        const note = findNote(notes, noteId)
                        return <NotePageMain {...routeProps} note={note} />
                    }}
                />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
            </>
        )
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            addNote: this.addNote,
            addFolder: this.addFolder,
            deleteNote: this.deleteNote,
            updateNote: this.updateNote
        }
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </ApiContext.Provider>
        )
    }
}

export default App;