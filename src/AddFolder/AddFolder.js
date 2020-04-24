import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidateError from '../ValidateError'

class AddFolder extends React.Component {
    constructor(props) {
        super(props)
        this.folderNameInput = React.createRef()
    }

    static contextType = ApiContext

    static defaultProps ={
        addFolder: () => {}
    }

    state = {
        name: {
        value: '',
        touched: false
        }
    }

    addFolder(folderName) {
        fetch(`${config.API_ENDPOINT}/folders`, 
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
            },
            body: JSON.stringify({
                name: folderName
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
            .then(folder => {
                this.context.addFolder(folder)
                this.props.history.push('/')
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleSubmit(event) {
        event.preventDefault()
        const folderName = this.folderNameInput.current.value
        if (folderName.length >= 3) {
            this.addFolder(folderName)
        } else {
            this.folderNameInput.current.focus()
        }
    }

    updateName(folderName) {
        this.setState({name: {value: folderName, touched: true}})
    }

    validateName(folderName) {
        if (folderName.length === 0) {
            return(
                <div id='foldernameFeedback'>
                    Name is required to create note.
                </div>
            )
        } else if (folderName.length < 3) {
            return(
                <div id='foldernameFeedback'>
                    Name for folder must be at least 3 characters long.
                </div>
            )
        }
    }

    render() {
        return(
            <form className='addFolder' onSubmit={e => this.handleSubmit(e)} id={this.context.folders.length === 0 ? 'noFolders' : 'yesFolders'}>
                <h2>Add a Folder</h2>
                <label htmlFor='folderName' id='folderName'>Folder Name*</label>
                <input
                    type='text'
                    name='folderName'
                    id='folderName'
                    ref={this.folderNameInput}
                    onChange={e => this.updateName(e.target.value)}
                    aria-label='Enter name for folder'
                    aria-required='true'
                    aria-describedby='folderNameFeedback'
                />
                {this.state.name.touched && (<ValidateError message={this.validateName(this.state.name.value)} />)}
                <button 
                    type='submit'
                    className='submitButton'
                    onSubmit={this.handleSubmit}>
                        Submit
                </button>
            </form>
        )
    }
}

export default AddFolder